// Workout program library. Curated content lives in code (like protocols.ts);
// user-specific logs live in the database. Real Peak State programs will be
// dropped in here — this seed mirrors the previous samples in the richer model.

export type Exercise = {
  name: string;
  sets: number;
  reps: string; // "6-8", "AMRAP", "60s"
  restSec?: number; // default rest timer
  muscle?: string; // primary muscle group
  cue?: string; // short form cue
};

export type ProgramDay = {
  label: string; // "Push 1"
  weekday: number; // 1=Mon … 7=Sun (used for auto-scheduling)
  focus: string; // "Chest · Shoulders · Triceps"
  exercises: Exercise[];
};

export type Program = {
  slug: string;
  name: string;
  goal: "strength" | "hypertrophy" | "recomp" | "general";
  level: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
  weeks: number;
  blurb: string;
  days: ProgramDay[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "push-pull-legs",
    name: "Push / Pull / Legs",
    goal: "hypertrophy",
    level: "advanced",
    daysPerWeek: 6,
    weeks: 8,
    blurb: "Classic 6-day hypertrophy split. Best for intermediate and advanced lifters chasing recomp.",
    days: [
      {
        label: "Push 1", weekday: 1, focus: "Chest · Shoulders · Triceps",
        exercises: [
          { name: "Bench press", sets: 4, reps: "6-8", restSec: 150, muscle: "Chest", cue: "Drive feet, tuck elbows ~45°." },
          { name: "Overhead press", sets: 3, reps: "8-10", restSec: 120, muscle: "Shoulders" },
          { name: "Incline DB press", sets: 3, reps: "10-12", restSec: 90, muscle: "Chest" },
          { name: "Lateral raise", sets: 4, reps: "12-15", restSec: 60, muscle: "Shoulders", cue: "Lead with elbows, no swing." },
          { name: "Triceps pushdown", sets: 3, reps: "10-12", restSec: 60, muscle: "Triceps" },
        ],
      },
      {
        label: "Pull 1", weekday: 2, focus: "Back · Biceps",
        exercises: [
          { name: "Deadlift", sets: 3, reps: "5", restSec: 180, muscle: "Back", cue: "Brace, bar over mid-foot, push the floor away." },
          { name: "Barbell row", sets: 3, reps: "6-8", restSec: 120, muscle: "Back" },
          { name: "Pull-up", sets: 3, reps: "AMRAP", restSec: 120, muscle: "Back" },
          { name: "Face pull", sets: 3, reps: "12-15", restSec: 60, muscle: "Rear delts" },
          { name: "Barbell curl", sets: 3, reps: "10-12", restSec: 60, muscle: "Biceps" },
        ],
      },
      {
        label: "Legs 1", weekday: 3, focus: "Quads · Hamstrings · Calves",
        exercises: [
          { name: "Back squat", sets: 4, reps: "6-8", restSec: 180, muscle: "Quads", cue: "Brace, knees track over toes, hit depth." },
          { name: "Romanian deadlift", sets: 3, reps: "8-10", restSec: 120, muscle: "Hamstrings" },
          { name: "Leg press", sets: 3, reps: "10-12", restSec: 90, muscle: "Quads" },
          { name: "Leg curl", sets: 3, reps: "10-12", restSec: 60, muscle: "Hamstrings" },
          { name: "Standing calf raise", sets: 4, reps: "12-15", restSec: 45, muscle: "Calves" },
        ],
      },
      {
        label: "Push 2", weekday: 4, focus: "Shoulders · Chest · Triceps",
        exercises: [
          { name: "Overhead press", sets: 4, reps: "6-8", restSec: 150, muscle: "Shoulders" },
          { name: "Incline bench press", sets: 3, reps: "8-10", restSec: 120, muscle: "Chest" },
          { name: "Cable fly", sets: 3, reps: "12-15", restSec: 60, muscle: "Chest" },
          { name: "Lateral raise", sets: 4, reps: "12-15", restSec: 60, muscle: "Shoulders" },
          { name: "Overhead triceps extension", sets: 3, reps: "10-12", restSec: 60, muscle: "Triceps" },
        ],
      },
      {
        label: "Pull 2", weekday: 5, focus: "Back · Biceps",
        exercises: [
          { name: "Pull-up (weighted)", sets: 4, reps: "6-8", restSec: 150, muscle: "Back" },
          { name: "Seated cable row", sets: 3, reps: "10-12", restSec: 90, muscle: "Back" },
          { name: "Lat pulldown", sets: 3, reps: "10-12", restSec: 90, muscle: "Back" },
          { name: "Hammer curl", sets: 3, reps: "10-12", restSec: 60, muscle: "Biceps" },
          { name: "Rear delt fly", sets: 3, reps: "15-20", restSec: 45, muscle: "Rear delts" },
        ],
      },
      {
        label: "Legs 2", weekday: 6, focus: "Hamstrings · Quads · Calves",
        exercises: [
          { name: "Front squat", sets: 4, reps: "6-8", restSec: 180, muscle: "Quads" },
          { name: "Hip thrust", sets: 3, reps: "8-10", restSec: 120, muscle: "Glutes" },
          { name: "Walking lunge", sets: 3, reps: "10/leg", restSec: 90, muscle: "Quads" },
          { name: "Seated leg curl", sets: 3, reps: "12-15", restSec: 60, muscle: "Hamstrings" },
          { name: "Seated calf raise", sets: 4, reps: "15-20", restSec: 45, muscle: "Calves" },
        ],
      },
    ],
  },
  {
    slug: "upper-lower",
    name: "Upper / Lower 4-Day",
    goal: "strength",
    level: "intermediate",
    daysPerWeek: 4,
    weeks: 8,
    blurb: "Highest training economy for a 4-day week. Built around heavy compounds plus accessory work.",
    days: [
      {
        label: "Upper A", weekday: 1, focus: "Chest · Back · Arms",
        exercises: [
          { name: "Bench press", sets: 4, reps: "5", restSec: 180, muscle: "Chest" },
          { name: "Pendlay row", sets: 4, reps: "6", restSec: 150, muscle: "Back" },
          { name: "Overhead press", sets: 3, reps: "8", restSec: 120, muscle: "Shoulders" },
          { name: "Chest-supported row", sets: 3, reps: "10", restSec: 90, muscle: "Back" },
          { name: "Triceps + biceps superset", sets: 3, reps: "10-12", restSec: 60, muscle: "Arms" },
        ],
      },
      {
        label: "Lower A", weekday: 2, focus: "Quads · Hamstrings · Calves",
        exercises: [
          { name: "Back squat", sets: 4, reps: "5", restSec: 180, muscle: "Quads" },
          { name: "Romanian deadlift", sets: 3, reps: "8", restSec: 120, muscle: "Hamstrings" },
          { name: "Walking lunge", sets: 3, reps: "10/leg", restSec: 90, muscle: "Quads" },
          { name: "Standing calf raise", sets: 4, reps: "12", restSec: 45, muscle: "Calves" },
        ],
      },
      {
        label: "Upper B", weekday: 4, focus: "Shoulders · Back · Chest",
        exercises: [
          { name: "Overhead press", sets: 4, reps: "5", restSec: 180, muscle: "Shoulders" },
          { name: "Weighted pull-up", sets: 4, reps: "6", restSec: 150, muscle: "Back" },
          { name: "Incline DB press", sets: 3, reps: "8-10", restSec: 120, muscle: "Chest" },
          { name: "Cable row", sets: 3, reps: "10-12", restSec: 90, muscle: "Back" },
          { name: "Lateral raise", sets: 4, reps: "15", restSec: 45, muscle: "Shoulders" },
        ],
      },
      {
        label: "Lower B", weekday: 5, focus: "Hamstrings · Quads · Calves",
        exercises: [
          { name: "Deadlift", sets: 4, reps: "4", restSec: 210, muscle: "Back" },
          { name: "Front squat", sets: 3, reps: "8", restSec: 150, muscle: "Quads" },
          { name: "Hip thrust", sets: 3, reps: "10", restSec: 90, muscle: "Glutes" },
          { name: "Seated leg curl", sets: 3, reps: "12-15", restSec: 60, muscle: "Hamstrings" },
          { name: "Seated calf raise", sets: 4, reps: "15", restSec: 45, muscle: "Calves" },
        ],
      },
    ],
  },
  {
    slug: "minimalist-3day",
    name: "Minimalist 3-Day",
    goal: "general",
    level: "beginner",
    daysPerWeek: 3,
    weeks: 8,
    blurb: "Full-body, low volume, high intensity. Pairs well with aggressive cuts on Reta.",
    days: [
      {
        label: "Full Body A", weekday: 1, focus: "Squat focus",
        exercises: [
          { name: "Back squat", sets: 3, reps: "5", restSec: 180, muscle: "Quads" },
          { name: "Bench press", sets: 3, reps: "5", restSec: 150, muscle: "Chest" },
          { name: "Barbell row", sets: 3, reps: "8", restSec: 120, muscle: "Back" },
          { name: "Plank", sets: 3, reps: "60s", restSec: 45, muscle: "Core" },
        ],
      },
      {
        label: "Full Body B", weekday: 3, focus: "Hinge focus",
        exercises: [
          { name: "Deadlift", sets: 3, reps: "5", restSec: 210, muscle: "Back" },
          { name: "Overhead press", sets: 3, reps: "6", restSec: 150, muscle: "Shoulders" },
          { name: "Pull-up", sets: 3, reps: "AMRAP", restSec: 120, muscle: "Back" },
          { name: "Hanging leg raise", sets: 3, reps: "12", restSec: 45, muscle: "Core" },
        ],
      },
      {
        label: "Full Body C", weekday: 5, focus: "Press focus",
        exercises: [
          { name: "Front squat", sets: 3, reps: "6", restSec: 180, muscle: "Quads" },
          { name: "Incline bench press", sets: 3, reps: "8", restSec: 150, muscle: "Chest" },
          { name: "Chest-supported row", sets: 3, reps: "10", restSec: 90, muscle: "Back" },
          { name: "Cable crunch", sets: 3, reps: "15", restSec: 45, muscle: "Core" },
        ],
      },
    ],
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export const GOAL_LABEL: Record<Program["goal"], string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  recomp: "Recomp",
  general: "General",
};
