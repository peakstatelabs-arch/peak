import { NextRequest, NextResponse } from "next/server";

// Zapier Catch Hook that forwards Peak State Creator Program applications into
// ClickFunnels 2.0 (where the "Creator Program" tag is applied). Catch-hook URLs
// are write-only, so the value is safe to keep here as a fallback, but it can be
// overridden via the ZAPIER_CREATOR_WEBHOOK_URL env var without a redeploy.
//
// TODO: replace the placeholder below with the real catch-hook URL, or set
// ZAPIER_CREATOR_WEBHOOK_URL in the environment.
const ZAPIER_CREATOR_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/REPLACE_ME/creator-program/";

// Tag ClickFunnels should apply to everyone who comes through this funnel.
// Zapier reads this field off the payload so the tag can change without a deploy.
const CREATOR_PROGRAM_TAG = "Creator Program";

const FOLLOWER_OPTIONS = [
  "Just getting started",
  "Under 1K",
  "1K–5K",
  "5K–25K",
  "25K–100K",
  "100K+",
];

const CONTENT_OPTIONS = [
  "Health & wellness",
  "Fitness",
  "Weight loss / body transformation",
  "Peptides / GLP-1s",
  "Beauty / lifestyle",
  "Other",
];

const PEPTIDE_OPTIONS = ["Yes", "No", "Not currently, but interested"];

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = str(body.firstName);
    const lastName = str(body.lastName);
    const email = str(body.email).toLowerCase();
    const phone = str(body.phone);
    const tiktok = str(body.tiktok);
    const instagram = str(body.instagram);
    const followers = str(body.followers);
    // contentType is multi-select: accept an array (and tolerate a legacy string).
    const contentTypes: string[] = Array.isArray(body.contentType)
      ? body.contentType.map(str).filter(Boolean)
      : str(body.contentType)
      ? [str(body.contentType)]
      : [];
    const usingPeptides = str(body.usingPeptides);
    const why = str(body.why);
    const acknowledged = body.acknowledged === true;

    // Required fields (phone + Instagram are optional per the application copy).
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }
    if (!tiktok) {
      return NextResponse.json(
        { error: "TikTok handle is required" },
        { status: 400 }
      );
    }
    if (!FOLLOWER_OPTIONS.includes(followers)) {
      return NextResponse.json(
        { error: "Please select a follower range" },
        { status: 400 }
      );
    }
    if (
      contentTypes.length === 0 ||
      !contentTypes.every((c) => CONTENT_OPTIONS.includes(c))
    ) {
      return NextResponse.json(
        { error: "Please select at least one content type" },
        { status: 400 }
      );
    }
    if (!PEPTIDE_OPTIONS.includes(usingPeptides)) {
      return NextResponse.json(
        { error: "Please answer the peptide question" },
        { status: 400 }
      );
    }
    if (!why) {
      return NextResponse.json(
        { error: "Please tell us why you want to join" },
        { status: 400 }
      );
    }
    if (!acknowledged) {
      return NextResponse.json(
        { error: "You must agree to the creator guidelines" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const userAgent = req.headers.get("user-agent") || "";

    // Normalize social handles to bare @handles for a clean ClickFunnels record.
    const normalizeHandle = (raw: string) => {
      if (!raw) return "";
      const handle = raw
        .replace(/^https?:\/\/(www\.)?(tiktok|instagram)\.com\//i, "")
        .replace(/\/+$/, "")
        .replace(/^@/, "")
        .trim();
      return handle ? `@${handle}` : "";
    };

    // Single payload shared by every destination. ClickFunnels (via Zapier) only
    // needs the contact fields + tag; the email notification uses all of it.
    const payload = {
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      tiktok_handle: normalizeHandle(tiktok),
      instagram_handle: normalizeHandle(instagram),
      followers,
      // Comma-joined for a single field, plus the raw array to fan out if wanted.
      content_type: contentTypes.join(", "),
      content_types: contentTypes,
      using_peptides: usingPeptides,
      why,
      acknowledged_guidelines: acknowledged,
      tag: CREATOR_PROGRAM_TAG,
      source: "creator-program-application",
      timestamp: new Date().toISOString(),
      ip,
      user_agent: userAgent,
    };

    // Fan out to every configured destination:
    //  - ClickFunnels contact + "Creator Program" tag (Zapier catch hook)
    //  - A notification that emails the full application to the team. This can
    //    be a Google Apps Script Web App (see docs) or another Zapier hook.
    // Each is optional; the submission succeeds as long as at least one
    // configured destination accepts it, so a single integration hiccup never
    // costs an applicant.
    const zapierUrl =
      process.env.ZAPIER_CREATOR_WEBHOOK_URL || ZAPIER_CREATOR_WEBHOOK_URL;
    const notifyUrl = process.env.CREATOR_NOTIFY_WEBHOOK_URL || "";

    const targets: { name: string; url: string }[] = [];
    if (zapierUrl && !zapierUrl.includes("REPLACE_ME")) {
      targets.push({ name: "clickfunnels", url: zapierUrl });
    }
    if (notifyUrl) {
      targets.push({ name: "notify-email", url: notifyUrl });
    }

    if (targets.length === 0) {
      // Nothing is wired up yet — fail loudly in logs, generically to the client.
      console.error(
        "Creator apply: no destinations configured (set ZAPIER_CREATOR_WEBHOOK_URL and/or CREATOR_NOTIFY_WEBHOOK_URL)"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const results = await Promise.allSettled(
      targets.map((t) =>
        fetch(t.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`${res.status} ${text}`.trim());
          }
          return t.name;
        })
      )
    );

    const failures = results
      .map((r, i) => ({ r, name: targets[i].name }))
      .filter((x) => x.r.status === "rejected");
    for (const f of failures) {
      console.error(
        `Creator apply: ${f.name} dispatch failed:`,
        (f.r as PromiseRejectedResult).reason
      );
    }

    // Succeed if at least one destination accepted the application.
    if (failures.length === targets.length) {
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: "Application received", email });
  } catch (err) {
    console.error("Creator apply error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
