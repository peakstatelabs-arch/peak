// Client-safe module registry. Pure constants + types — no server imports.
// The server-side gate lives in `./modules-server.ts`.

export type ModuleSlug = "workouts" | "nutrition" | "community" | "dosing-guide";

export type ModuleDef = {
  slug: ModuleSlug;
  label: string;
  blurb: string;
  href: string;
};

export const MODULES: ModuleDef[] = [
  {
    slug: "workouts",
    label: "Workouts",
    blurb:
      "12-week recomp programs, AI custom plans, set-by-set logger with rest timer + PR detection.",
    href: "/workouts",
  },
  {
    slug: "nutrition",
    label: "Nutrition",
    blurb:
      "Macros, meal logging, AI photo scan, AI 7-day meal plans, and your metabolic-type coach.",
    href: "/nutrition",
  },
  {
    slug: "community",
    label: "Community",
    blurb: "Wins, comments, weekly challenges, and streak leaderboard with other clients.",
    href: "/community",
  },
  {
    slug: "dosing-guide",
    label: "Dosing Guide",
    blurb:
      "Reference pages for each peptide — protocols, dose ranges, reconstitution calculator.",
    href: "/dosing-guide",
  },
];

export function isModuleEnabled(enabled: string[] | null | undefined, slug: ModuleSlug): boolean {
  return Array.isArray(enabled) && enabled.includes(slug);
}
