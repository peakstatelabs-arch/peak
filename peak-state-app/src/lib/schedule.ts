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

/**
 * Generate the full dose schedule for a POWER CUT protocol.
 *
 * All three peptides anchor on whatever weekday `startDate` falls on
 * (was previously forced to Monday, which discarded the user's pick).
 *  - Reta: weekly on start day-of-week, morning
 *  - CJC: 5 days on / 2 off counted from start day, evening
 *  - BPC: Foundation = start day + start+3; Performance = start day +
 *         start+2 + start+4. Evenly spaced, shifted with start day.
 *         BPC tracks CJC ON weeks (weeks 1-10, 13-22, 25-34).
 */
export function generatePowerCutSchedule(opts: {
  protocol: StackProtocol;
  bpc: PowerCutChoice;
  startDate: Date;
}): DoseRow[] {
  const { protocol, bpc, startDate } = opts;
  const rows: DoseRow[] = [];
  const week1Start = new Date(startDate);

  for (let w = 0; w < protocol.totalWeeks; w++) {
    const weekNum = w + 1;
    const weekStart = new Date(week1Start.getTime() + w * 7 * DAY);

    // RETA — same weekday as start, morning
    const retaDoseStr = protocol.reta.schedule[w]?.dose;
    if (retaDoseStr && !protocol.reta.schedule[w].isOff) {
      const mg = parseMg(retaDoseStr);
      if (mg > 0) {
        rows.push({
          peptide_name: "Retatrutide",
          dose_mg: mg,
          scheduled_for: iso(weekStart),
          time_of_day: "morning",
          notes: `Week ${weekNum} · POWER CUT`,
        });
      }
    }

    // CJC — 5 consecutive days from start day, evening
    const cjcEntry = protocol.cjc.schedule[w];
    if (cjcEntry && !cjcEntry.isOff) {
      const mg = parseMg(cjcEntry.dose);
      if (mg > 0) {
        for (let d = 0; d < 5; d++) {
          const day = new Date(weekStart.getTime() + d * DAY);
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
      const days = bpc === "foundation" ? [0, 3] : [0, 2, 4];
      const dosePerInj = bpc === "foundation" ? 2.0 : 1.3;
      for (const d of days) {
        const day = new Date(weekStart.getTime() + d * DAY);
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

/**
 * Generate JUST the CJC slice of a POWER CUT stack protocol — useful when
 * the user is doing CJC as a single vial but wants the per-week titration
 * + ON/OFF cycles from POWER CUT. Mirrors generatePowerCutSchedule's CJC
 * arm (5 days on / 2 off, evening, anchored to startDate's weekday).
 */
export function generateCjcStackSchedule(opts: {
  protocol: StackProtocol;
  startDate: Date;
}): DoseRow[] {
  const { protocol, startDate } = opts;
  const rows: DoseRow[] = [];
  const week1Start = new Date(startDate);

  for (let w = 0; w < protocol.totalWeeks; w++) {
    const weekNum = w + 1;
    const weekStart = new Date(week1Start.getTime() + w * 7 * DAY);
    const cjcEntry = protocol.cjc.schedule[w];
    if (!cjcEntry || cjcEntry.isOff) continue;
    const mg = parseMg(cjcEntry.dose);
    if (mg <= 0) continue;
    for (let d = 0; d < 5; d++) {
      const day = new Date(weekStart.getTime() + d * DAY);
      rows.push({
        peptide_name: "CJC-1295 + Ipamorelin",
        dose_mg: mg,
        scheduled_for: iso(day),
        time_of_day: "evening",
        notes: `Week ${weekNum} · fasted (90 min after meal, before next meal)`,
      });
    }
  }
  return rows;
}

/**
 * Single-vial CJC schedule: 10-week titration (no ON/OFF cycling).
 *   Weeks 1-4: 0.30 mg per injection
 *   Weeks 5-6: 0.40 mg per injection
 *   Weeks 7-10: 0.50 mg per injection
 * Each week is 5 consecutive days from startDate (Mon-Fri pattern, but
 * shifted to whatever weekday startDate falls on). Used when CJC is run
 * as a standalone single vial; POWER CUT uses generatePowerCutSchedule's
 * own CJC arm with cycling.
 */
const SINGLE_CJC_WEEKLY_MG = [0.3, 0.3, 0.3, 0.3, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5];

export function generateSingleCjcSchedule(opts: { startDate: Date }): DoseRow[] {
  const rows: DoseRow[] = [];
  const week1Start = new Date(opts.startDate);
  for (let w = 0; w < SINGLE_CJC_WEEKLY_MG.length; w++) {
    const weekNum = w + 1;
    const mg = SINGLE_CJC_WEEKLY_MG[w];
    const weekStart = new Date(week1Start.getTime() + w * 7 * DAY);
    for (let d = 0; d < 5; d++) {
      const day = new Date(weekStart.getTime() + d * DAY);
      rows.push({
        peptide_name: "CJC-1295 + Ipamorelin",
        dose_mg: mg,
        scheduled_for: iso(day),
        time_of_day: "evening",
        notes: `Week ${weekNum} · fasted (90 min after meal, before next meal)`,
      });
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
    for (let t = start.getTime(); t <= end.getTime(); t += 7 * DAY) {
      rows.push(makeRow(peptide_name, dose_mg, new Date(t), time_of_day));
    }
  } else if (frequency === "five-on-two-off") {
    // 5 consecutive days from start, then 2 off — repeated weekly.
    for (let w = 0; w < weeks; w++) {
      const weekStart = new Date(start.getTime() + w * 7 * DAY);
      for (let d = 0; d < 5; d++) {
        rows.push(makeRow(peptide_name, dose_mg, new Date(weekStart.getTime() + d * DAY), time_of_day));
      }
    }
  } else if (frequency === "twice-weekly" || frequency === "thrice-weekly") {
    // Evenly spaced around the start day. 2×/wk → start, start+3.
    // 3×/wk → start, start+2, start+4. `weekdays` (1=Mon..7=Sun) still
    // works as an explicit override for callers that want fixed days.
    const offsets =
      opts.weekdays && opts.weekdays.length > 0
        ? opts.weekdays.map((wd) => {
            const startWd = start.getDay() === 0 ? 7 : start.getDay();
            return ((wd - startWd) + 7) % 7;
          })
        : frequency === "twice-weekly"
        ? [0, 3]
        : [0, 2, 4];
    for (let w = 0; w < weeks; w++) {
      const weekStart = new Date(start.getTime() + w * 7 * DAY);
      for (const off of offsets) {
        rows.push(makeRow(peptide_name, dose_mg, new Date(weekStart.getTime() + off * DAY), time_of_day));
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
