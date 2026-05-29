export interface RetaWeek {
  week: number;
  mg: number;
}

// Retatrutide 12-week titration schedule.
// The mg schedule is identical regardless of vial size — only the
// bacteriostatic-water dilution (and therefore the syringe-unit conversion)
// changes between the 10 mg and 20 mg vials.
export const retaSchedule: RetaWeek[] = [
  { week: 1, mg: 0.5 },
  { week: 2, mg: 1.0 },
  { week: 3, mg: 1.5 },
  { week: 4, mg: 2.0 },
  { week: 5, mg: 2.5 },
  { week: 6, mg: 3.0 },
  { week: 7, mg: 3.5 },
  { week: 8, mg: 4.0 },
  { week: 9, mg: 4.5 },
  { week: 10, mg: 5.5 },
  { week: 11, mg: 6.0 },
  { week: 12, mg: 6.0 },
];

export type VialSize = 10 | 20;

// Both vials are reconstituted with 2 mL of BAC water.
//   20 mg vial → 20 mg / 2 mL = 10 mg/mL → 0.1 mg per unit  → units = mg * 10
//   10 mg vial → 10 mg / 2 mL =  5 mg/mL → 0.05 mg per unit → units = mg * 20
// The 10 mg vial is more dilute, so it needs double the units for the same dose.
export function unitsForDose(mg: number, vial: VialSize): number {
  const unitsPerMg = vial === 20 ? 10 : 20;
  return Math.round(mg * unitsPerMg);
}

export function totalMg(): number {
  return retaSchedule.reduce((sum, w) => sum + w.mg, 0);
}
