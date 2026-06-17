import { type StackProtocol, parseMg, getStackProtocol } from "./protocols";

export type DoseRow = {
  peptide_name: string;
  dose_mg: number;
  scheduled_for: string; // YYYY-MM-DD
  time_of_day: "morning" | "evening";
  notes: string | null;
};

export type PowerCutChoice = "foundation" | "performance";

const DAY = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Roll a date to next occurrence of given weekday (1=Mon … 7=Sun). */
function rollTo(d: Date, weekday: number): Date {
  const out = new Date(d);
  const cur = out.getDay() === 0 ? 7 : out.getDay();
  const diff = (weekday - cur + 7) % 7;
  out.setDate(out.getDate() + diff);
  return out;
}

/**
 * Generate the full dose schedule for a POWER CUT protocol.
 *  - Reta: weekly Monday morning per `protocol.reta.schedule`
 *  - CJC: Mon–Fri evening per `protocol.cjc.schedule` (weekly dose, 5x/wk)
 *  - BPC: Foundation = Mon+Thu, Performance = Mon+Wed+Fri, evening
 *         BPC stays ON when CJC is ON (mirrors weeks 1-10, 13-22, 25-34)
 */
export function generatePowerCutSchedule(opts: {
  protocol: StackProtocol;
  bpc: PowerCutChoice;
  startDate: Date;
}): DoseRow[] {
  const { protocol, bpc, startDate } = opts;
  const rows: DoseRow[] = [];
  // Anchor on the Monday of the start week (or the supplied date if it's a Monday).
  const week1Monday = rollTo(startDate, 1);

  for (let w = 0; w < protocol.totalWeeks; w++) {
    const weekNum = w + 1;
    const monday = new Date(week1Monday.getTime() + w * 7 * DAY);

    // RETA — Monday morning
    const retaDoseStr = protocol.reta.schedule[w]?.dose;
    if (retaDoseStr && !protocol.reta.schedule[w].isOff) {
      const mg = parseMg(retaDoseStr);
      if (mg > 0) {
        rows.push({
          peptide_name: "Retatrutide",
          dose_mg: mg,
          scheduled_for: iso(monday),
          time_of_day: "morning",
          notes: `Week ${weekNum} · POWER CUT`,
        });
      }
    }

    // CJC — Mon–Fri evening
    const cjcEntry = protocol.cjc.schedule[w];
    if (cjcEntry && !cjcEntry.isOff) {
      const mg = parseMg(cjcEntry.dose);
      if (mg > 0) {
        for (let d = 0; d < 5; d++) {
          const day = new Date(monday.getTime() + d * DAY);
          rows.push({
            peptide_name: "CJC-1295 + Ipamorelin",
            dose_mg: mg,
            scheduled_for: iso(day),
            time_of_day: "evening",
            notes: `Week ${weekNum} · fasted (90 min after meal, before next meal)`,
          });
        }
      }
    }

    // BPC — pairs with CJC ON weeks
    if (cjcEntry && !cjcEntry.isOff) {
      const days = bpc === "foundation" ? [0, 3] : [0, 2, 4]; // Mon+Thu OR Mon+Wed+Fri
      const dosePerInj = bpc === "foundation" ? 2.0 : 1.3;
      for (const d of days) {
        const day = new Date(monday.getTime() + d * DAY);
        rows.push({
          peptide_name: "BPC-157 + TB-500",
          dose_mg: dosePerInj,
          scheduled_for: iso(day),
          time_of_day: "evening",
          notes: `Week ${weekNum} · ${bpc === "foundation" ? "Foundation 2×/wk" : "Performance 3×/wk"}`,
        });
      }
    }
  }
  return rows;
}

/** Generate a simple single-peptide schedule. */
export function generateSingleSchedule(opts: {
  peptide_name: string;
  dose_mg: number;
  frequency:
    | "daily"
    | "every-other-day"
    | "twice-weekly"
    | "thrice-weekly"
    | "five-on-two-off"
    | "weekly";
  time_of_day: "morning" | "evening";
  startDate: Date;
  weeks: number;
  weekdays?: number[]; // 1=Mon..7=Sun, for "thrice-weekly" / "twice-weekly"
}): DoseRow[] {
  const { peptide_name, dose_mg, frequency, time_of_day, startDate, weeks } = opts;
  const rows: DoseRow[] = [];
  const start = new Date(startDate);
  const end = new Date(start.getTime() + weeks * 7 * DAY);

  if (frequency === "daily") {
    for (let t = start.getTime(); t <= end.getTime(); t += DAY) {
      rows.push(makeRow(peptide_name, dose_mg, new Date(t), time_of_day));
    }
  } else if (frequency === "every-other-day") {
    for (let t = start.getTime(); t <= end.getTime(); t += 2 * DAY) {
      rows.push(makeRow(peptide_name, dose_mg, new Date(t), time_of_day));
    }
  } else if (frequency === "weekly") {
    const anchor = rollTo(start, ((start.getDay() === 0 ? 7 : start.getDay()) as number));
    for (let t = anchor.getTime(); t <= end.getTime(); t += 7 * DAY) {
      rows.push(makeRow(peptide_name, dose_mg, new Date(t), time_of_day));
    }
  } else if (frequency === "five-on-two-off") {
    // Mon–Fri
    const week1Mon = rollTo(start, 1);
    for (let w = 0; w < weeks; w++) {
      const monday = new Date(week1Mon.getTime() + w * 7 * DAY);
      for (let d = 0; d < 5; d++) {
        rows.push(makeRow(peptide_name, dose_mg, new Date(monday.getTime() + d * DAY), time_of_day));
      }
    }
  } else if (frequency === "twice-weekly" || frequency === "thrice-weekly") {
    const days = opts.weekdays ?? (frequency === "twice-weekly" ? [1, 4] : [1, 3, 5]);
    const week1Mon = rollTo(start, 1);
    for (let w = 0; w < weeks; w++) {
      const monday = new Date(week1Mon.getTime() + w * 7 * DAY);
      for (const wd of days) {
        const offset = wd - 1; // Mon=0
        rows.push(makeRow(peptide_name, dose_mg, new Date(monday.getTime() + offset * DAY), time_of_day));
      }
    }
  }
  return rows;
}

function makeRow(name: string, mg: number, d: Date, t: "morning" | "evening"): DoseRow {
  return {
    peptide_name: name,
    dose_mg: mg,
    scheduled_for: iso(d),
    time_of_day: t,
    notes: null,
  };
}

export { getStackProtocol };
