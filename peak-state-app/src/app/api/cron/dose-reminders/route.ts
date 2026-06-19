import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPush, pushConfigured } from "@/lib/push";

export const runtime = "nodejs";

/**
 * Cron entrypoint. Send dose reminders to subscribed clients whose local time
 * falls within ±10 minutes of their morning_time or evening_time, for any
 * unlogged dose today that we haven't already sent a reminder for.
 *
 * Auth: requires header `Authorization: Bearer <CRON_SECRET>` or query
 * `?key=<CRON_SECRET>`. Vercel Cron sets the header automatically.
 *
 * Idempotent: stamps peptide_doses.reminder_sent_at the first time it fires,
 * so re-running the cron won't double-notify.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") ?? "";
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    if (auth !== `Bearer ${secret}` && key !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!pushConfigured()) {
    return NextResponse.json({ error: "Push not configured." }, { status: 503 });
  }

  const admin = createAdminClient();
  const result = await runReminders(admin);
  return NextResponse.json(result);
}

// Allow POST too so manual/external services that prefer POST also work.
export const POST = GET;

const TOLERANCE_MIN = 10;

type AdminClient = ReturnType<typeof createAdminClient>;

async function runReminders(admin: AdminClient) {
  const nowUtc = new Date();

  // Find all clients with notifications enabled, their time prefs + timezone
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, morning_time, evening_time, timezone, notifications_enabled, first_name")
    .eq("notifications_enabled", true);

  if (!profiles || profiles.length === 0) {
    return { ok: true, candidates: 0, sent: 0, skipped: 0 };
  }

  let totalSent = 0;
  let totalSkipped = 0;

  for (const p of profiles) {
    const tz = p.timezone || "UTC";
    const localNow = nowInZone(nowUtc, tz);
    if (!localNow) continue;

    const localDate = localNow.dateISO;
    const localMinutes = localNow.minutes;

    const morningMin = parseHM(p.morning_time);
    const eveningMin = parseHM(p.evening_time);

    const dueMorning = morningMin != null && diffMin(localMinutes, morningMin) <= TOLERANCE_MIN;
    const dueEvening = eveningMin != null && diffMin(localMinutes, eveningMin) <= TOLERANCE_MIN;
    if (!dueMorning && !dueEvening) continue;

    // Pull all doses scheduled for today (local), unlogged, no reminder sent yet
    const { data: doses } = await admin
      .from("peptide_doses")
      .select("id, peptide_name, dose_mg, time_of_day, scheduled_for, reminder_sent_at, taken")
      .eq("user_id", p.id)
      .eq("scheduled_for", localDate)
      .eq("taken", false)
      .is("reminder_sent_at", null);

    if (!doses || doses.length === 0) continue;

    const toSend = doses.filter((d) =>
      (d.time_of_day === "morning" && dueMorning) ||
      (d.time_of_day === "evening" && dueEvening)
    );
    if (toSend.length === 0) continue;

    const { data: subs } = await admin
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", p.id);

    if (!subs || subs.length === 0) {
      totalSkipped += toSend.length;
      continue;
    }

    // Group by time_of_day so one notification covers both BPC + CJC at PM, etc.
    const groups = new Map<string, typeof toSend>();
    for (const d of toSend) {
      const k = d.time_of_day ?? "evening";
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(d);
    }

    for (const [tod, list] of groups) {
      const names = list.map((d) => `${d.peptide_name} ${d.dose_mg}mg`).join(" · ");
      const title = tod === "morning" ? "Morning dose time" : "Evening dose time";
      const body = list.length === 1
        ? `${list[0].peptide_name} · ${list[0].dose_mg} mg — tap to log.`
        : `${list.length} doses due now: ${names}`;

      let anyDelivered = false;
      for (const s of subs) {
        const r = await sendPush({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }, {
          title,
          body,
          url: "/portal/peptide-tracker",
          tag: `dose-${tod}-${localDate}`,
        });
        if (r === "sent") { anyDelivered = true; totalSent += 1; }
        if (r === "expired") {
          await admin.from("push_subscriptions").delete().eq("id", s.id);
        }
      }

      if (anyDelivered) {
        const ids = list.map((d) => d.id);
        await admin
          .from("peptide_doses")
          .update({ reminder_sent_at: nowUtc.toISOString() })
          .in("id", ids);
      }
    }
  }

  return { ok: true, sent: totalSent, skipped: totalSkipped };
}

/** Convert UTC instant to a YYYY-MM-DD + minutes-since-midnight in the given IANA zone. */
function nowInZone(utc: Date, timeZone: string): { dateISO: string; minutes: number } | null {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
    const parts = Object.fromEntries(fmt.formatToParts(utc).map((p) => [p.type, p.value]));
    const dateISO = `${parts.year}-${parts.month}-${parts.day}`;
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    return { dateISO, minutes };
  } catch {
    return null;
  }
}

function parseHM(hm: string | null): number | null {
  if (!hm) return null;
  const [h, m] = hm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function diffMin(a: number, b: number): number {
  return Math.abs(a - b);
}
