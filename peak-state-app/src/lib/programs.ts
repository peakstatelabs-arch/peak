// Workout program library.
// Source: Peak State Labs' 12-Week Body Life Mastery Plans
// (Men/Women × Home/Gym, all body recomp, 3 phases of 4 weeks each).

export type Exercise = {
  code: string;        // "A1", "A2", "B1"  (shared letter = superset)
  name: string;
  sets: string;        // "4", "6 sets of 6,6,4,4,2,2", "AMRAP"
  reps: string;        // "8-10", "AMRAP", "60s", "20 reps total"
  restSec: number;     // 0 means "no rest" / superset back-to-back
  note?: string;
  videoId?: string;    // YouTube video ID — falls back to search if missing
};

export type Workout = {
  label: string;       // "Workout 1 - Upper"
  focus: string;       // "Upper" | "Lower" | "Legs + Glutes + Core" | "Upper + HIIT Cardio" | ...
  exercises: Exercise[];
};

export type Phase = {
  label: string;       // "Plan A" | "Plan B" | "Plan C"
  weeks: number;       // 4
  workouts: Workout[];
};

export type Program = {
  slug: string;
  name: string;
  audience: "men" | "women";
  location: "home" | "gym";
  goal: "recomp";
  level: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;          // recommended (max workouts/week across phases)
  totalWeeks: number;            // 12
  blurb: string;
  equipment: string[];
  phases: Phase[];
};

// Compact builder helpers ------------------------------------------------
type Tup = [code: string, name: string, sets: string, reps: string, restSec: number, note?: string];
const ex = (t: Tup): Exercise => ({
  code: t[0], name: t[1], sets: t[2], reps: t[3], restSec: t[4], note: t[5],
});
const w = (label: string, focus: string, rows: Tup[]): Workout =>
  ({ label, focus, exercises: rows.map(ex) });

// Returns workouts/week across all phases.
export function workoutsPerWeek(p: Program): number {
  return Math.max(...p.phases.map((ph) => ph.workouts.length));
}

export function getProgram(slug: string) {
  return PROGRAMS.find((p) => p.slug === slug);
}

/** Given a 0-indexed week number, return which phase + its workouts. */
export function phaseForWeek(p: Program, weekIdx: number) {
  let acc = 0;
  for (const ph of p.phases) {
    if (weekIdx < acc + ph.weeks) return ph;
    acc += ph.weeks;
  }
  return p.phases[p.phases.length - 1];
}

// =====================================================================
// MEN — 12 WEEK GYM
// =====================================================================
const MEN_GYM: Program = {
  slug: "mens-12wk-gym",
  name: "Men's 12-Week Body Recomp — Gym",
  audience: "men",
  location: "gym",
  goal: "recomp",
  level: "intermediate",
  daysPerWeek: 5,
  totalWeeks: 12,
  blurb: "Three progressive 4-week phases: hypertrophy base → strength density → power. Upper/Lower split with supersets and short rests for body composition.",
  equipment: ["Barbell + rack", "Dumbbells", "Bench", "Cables", "Pull-up bar"],
  phases: [
    {
      label: "Plan A — Foundation", weeks: 4,
      workouts: [
        w("Workout 1 - Upper", "Upper", [
          ["A1", "Chin Ups", "5", "8-10", 120],
          ["B1", "Standing Dumbbell Overhead Press", "5", "8-10", 120],
          ["C1", "Flat Dumbbell Chest Press", "4", "10-12", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "10-12 each", 90],
          ["D1", "Barbell Close-Grip Bench Press", "3", "10-12", 60],
          ["D2", "Standing Dumbbell Curls — Supinated", "3", "10-12", 60],
        ]),
        w("Workout 2 - Lower", "Lower", [
          ["A1", "Barbell Back Squats", "5", "8-10", 120],
          ["B1", "Dumbbell Alternating Reverse Lunge", "4", "10-12 total", 90],
          ["B2", "Barbell Hip Thrust", "4", "10-12", 90],
          ["C1", "Lying Leg Curls", "3", "8-10", 60],
          ["C2", "Seated Calf Raises", "3", "12-15", 60],
          ["E1", "Cable Trunk Rotation", "3", "10-12 each", 60],
        ]),
        w("Workout 3 - Upper", "Upper", [
          ["A1", "Incline Barbell Bench Press", "5", "8-10", 120],
          ["B1", "Bent Over Barbell Row — Supinated", "5", "8-10", 120],
          ["C1", "Rear Delt Lateral Raise", "4", "10-12", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "10-12", 90],
          ["D1", "Straight Bar Tricep Extension", "3", "12-15", 60],
          ["D2", "Dumbbell Cuban Rotation", "3", "10-12 each", 60],
        ]),
        w("Workout 4 - Lower", "Lower", [
          ["A1", "Barbell Deadlift", "5", "8-10", 120],
          ["B1", "Dumbbell Alternating Reverse Lunge", "4", "10-12 total", 90],
          ["B2", "Barbell Hip Thrust", "4", "10-12", 90],
          ["C1", "Standing Calf Raises", "3", "12-15", 60],
          ["C2", "Medicine Ball Russian Twist", "3", "18-20", 60],
          ["C3", "Stability Ball Crunch", "3", "10-12", 60],
        ]),
      ],
    },
    {
      label: "Plan B — Density", weeks: 4,
      workouts: [
        w("Workout 1 - Upper", "Upper", [
          ["A1", "Pronated Grip Pull Up", "5", "6-8", 120],
          ["B1", "Standing Dumbbell Overhead Press", "5", "6-8", 120],
          ["C1", "Flat Dumbbell Chest Press", "4", "8-10", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "8-10 each", 90],
          ["D1", "Incline Dumbbell Chest Fly", "3", "8-10", 60],
          ["D2", "Seated Face Pulls — Rope", "3", "8-10", 60],
        ]),
        w("Workout 2 - Lower", "Lower", [
          ["A1", "Barbell Back Squats — Sumo", "5", "6-8", 120],
          ["B1", "Dumbbell Alt. Deficit Reverse Lunge", "4", "12-16 total", 90],
          ["B2", "Barbell Hip Thrust", "4", "6-8", 90],
          ["C1", "Wall Assisted Single Leg Deadlift", "3", "6-8 each", 60],
          ["C2", "Seated Calf Raises", "3", "15-20", 60],
          ["E1", "Ab Roller", "3", "10-12", 60],
        ]),
        w("Workout 3 - Upper", "Upper", [
          ["A1", "Incline Dumbbell Bench Press", "5", "6-8", 90],
          ["A2", "Standing Curls w/ EZ Bar — Supinated", "5", "6-8", 90],
          ["B1", "Close Grip Bench Press — Smith Machine", "4", "8-10", 90],
          ["B2", "Standing Dumbbell Curls — Supinated", "4", "8-10", 90],
          ["C1", "Rope Overhead Tricep Extension", "3", "10-12", 60],
          ["C2", "Dumbbell Reverse Curls", "3", "10-12", 60],
        ]),
        w("Workout 4 - Lower", "Lower", [
          ["A1", "Barbell Straight-Leg Deadlift", "5", "6-8", 120],
          ["B1", "Dumbbell Bulgarian Split Squat", "4", "6-8 each", 90],
          ["B2", "45 Degree Back Extensions", "4", "12-15", 90],
          ["C1", "Standing Calf Raises", "3", "10-12", 60],
          ["C2", "Leg Raises", "3", "10-12", 0],
          ["C3", "Dumbbell Situps", "3", "10-12", 60],
        ]),
        w("Workout 5 - Upper", "Upper", [
          ["A1", "Dips", "5", "8-10", 120],
          ["B1", "Hex Press", "4", "8-10 each", 60],
          ["B2", "Wide-Grip Lat Pulldown", "4", "8-10", 90],
          ["C1", "Seated Dumbbell Lateral Raises", "3", "20", 0],
          ["C2", "Standing Rope Cable Face Pull", "3", "8-10", 60],
          ["C3", "Dumbbell Farmer's Carry", "3", "30s", 60],
        ]),
      ],
    },
    {
      label: "Plan C — Power", weeks: 4,
      workouts: [
        w("Workout 1 - Upper", "Upper", [
          ["A1", "Chin Ups", "6", "AMRAP", 120],
          ["B1", "Standing Dumbbell Overhead Press", "6", "6,6,4,4,2,2", 120, "Pyramid loading"],
          ["C1", "Flat Dumbbell Chest Press", "4", "4-6", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "4-6 each", 90],
          ["D1", "Lying Tricep Extensions — EZ Bar", "3", "6-8", 60],
          ["D2", "Standing Dumbbell Hammer Curls", "3", "6-8", 60],
        ]),
        w("Workout 2 - Lower", "Lower", [
          ["A1", "Barbell Reverse Lunges", "6", "6-8 total", 120],
          ["B1", "Dumbbell Suitcase Squat", "4", "4-6", 90],
          ["B2", "Barbell Hip Thrust", "4", "4-6", 90],
          ["C1", "Lying Leg Curls", "3", "4-6", 60],
          ["C2", "Seated Calf Raises", "3", "8-10", 0],
          ["C3", "Stability Ball Pass Through", "3", "10-12", 60],
        ]),
        w("Workout 3 - Upper", "Upper", [
          ["A1", "Incline Dumbbell Bench Press", "6", "6,6,4,4,2,2", 120],
          ["B1", "Bent Over Barbell Row — Supinated", "6", "6,6,4,4,2,2", 90],
          ["C1", "Incline Dumbbell Chest Fly", "4", "6-8", 90],
          ["C2", "Standing Dumbbell Curls — Supinated", "4", "6-8", 90],
          ["D1", "Standing Dumbbell Lateral Raises", "3", "6-8", 60],
          ["D2", "Dumbbell Reverse Curls", "3", "6-8", 60],
        ]),
        w("Workout 4 - Lower", "Lower", [
          ["A1", "Barbell Deadlift", "6", "6,6,4,4,2,2", 120],
          ["B1", "Dumbbell Bulgarian Split Squat", "4", "6-8 each", 90],
          ["B2", "Barbell Hip Thrust", "4", "6-8", 90],
          ["C1", "Standing Calf Raises", "3", "8-10", 60],
          ["C2", "Bicycle Crunch", "3", "18-20 total", 0],
          ["C3", "Dumbbell Stability Ball Crunch", "3", "8-10", 60],
        ]),
        w("Workout 5 - Upper", "Upper", [
          ["A1", "Dips", "5", "6-8", 120],
          ["B1", "Decline Pushup", "4", "AMRAP", 60],
          ["B2", "Dumbbell Preacher Curls", "4", "6-8", 90],
          ["C1", "Barbell Close-Grip Bench Press", "3", "6-8", 0],
          ["C2", "Seated Rope Cable Face Pull", "3", "8-10", 0],
          ["C3", "Forearm Plank", "3", "30-60s", 60],
        ]),
      ],
    },
  ],
};

// =====================================================================
// MEN — 12 WEEK HOME
// =====================================================================
const MEN_HOME: Program = {
  slug: "mens-12wk-home",
  name: "Men's 12-Week Body Recomp — Home",
  audience: "men",
  location: "home",
  goal: "recomp",
  level: "intermediate",
  daysPerWeek: 5,
  totalWeeks: 12,
  blurb: "Dumbbell-and-bench equivalent of the gym program. Same 3 phases, same recomp engine, no barbell or machines required.",
  equipment: ["Dumbbells (adjustable preferred)", "Bench", "Pull-up bar or doorway bar", "Resistance band (optional)"],
  phases: [
    {
      label: "Plan A — Foundation", weeks: 4,
      workouts: [
        w("Workout 1 - Upper", "Upper", [
          ["A1", "Chin Ups", "5", "8-10", 120],
          ["B1", "Standing Dumbbell Overhead Press", "5", "8-10", 120],
          ["C1", "Flat Dumbbell Chest Press", "4", "10-12", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "10-12 each", 90],
          ["D1", "Close-Grip Tricep Push Up", "3", "10-12", 60],
          ["D2", "Standing Dumbbell Curls — Supinated", "3", "10-12", 60],
        ]),
        w("Workout 2 - Lower", "Lower", [
          ["A1", "Dumbbell Back Squats", "5", "8-10", 120],
          ["B1", "Dumbbell Alternating Reverse Lunge", "4", "10-12 total", 90],
          ["B2", "Dumbbell Hip Thrust", "4", "10-12", 90],
          ["C1", "Lying Dumbbell Hamstring Leg Curls", "3", "8-10", 60],
          ["C2", "Standing Calf Raises", "3", "12-15", 60],
          ["E1", "Straight Arm Russian Twist", "3", "18-20", 60],
        ]),
        w("Workout 3 - Upper", "Upper", [
          ["A1", "Decline Push Up", "5", "AMRAP", 120],
          ["A2", "Bent Over Dumbbell Row — Supinated", "5", "8-10", 120],
          ["B1", "Bent Over Rear Delt Lateral Raise", "4", "10-12", 90],
          ["B2", "Single Arm Dumbbell Rows", "4", "10-12", 90],
          ["C1", "Hip Bridge Tricep Skull Crusher", "3", "12-15", 60],
          ["C2", "Dumbbell Cuban Rotation", "3", "10-12 each", 60],
        ]),
        w("Workout 4 - Lower", "Lower", [
          ["A1", "Dumbbell Straight Leg Deadlift", "5", "8-10", 120],
          ["B1", "Dumbbell Alternating Reverse Lunge", "4", "10-12 total", 90],
          ["B2", "Dumbbell Hip Thrust", "4", "10-12", 90],
          ["C1", "Standing Calf Raises", "3", "12-15", 60],
          ["C2", "Straight Arm Russian Twist", "3", "18-20", 60],
          ["C3", "Straight Arm Overhead Sit Up", "3", "10-12", 60],
        ]),
      ],
    },
    {
      label: "Plan B — Density", weeks: 4,
      workouts: [
        w("Workout 1 - Upper", "Upper", [
          ["A1", "Pronated Grip Pull Up", "5", "6-8", 120],
          ["B1", "Standing Dumbbell Overhead Press", "5", "6-8", 120],
          ["C1", "Flat Dumbbell Chest Press", "4", "8-10", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "8-10 each", 90],
          ["D1", "Incline Dumbbell Crush Grip Chest Press", "3", "8-10", 60],
          ["D2", "Dumbbell Face Pulls", "3", "8-10", 60],
        ]),
        w("Workout 2 - Lower", "Lower", [
          ["A1", "Dumbbell Back Squats — Sumo", "5", "6-8", 120],
          ["B1", "Dumbbell Alt. Lateral Lunge", "4", "12-16 total", 90],
          ["B2", "Dumbbell Hip Thrust", "4", "6-8", 90],
          ["C1", "Dumbbell Hamstring Curl", "3", "10-12", 60],
          ["C2", "Standing Calf Raises", "3", "15-20", 60],
          ["E1", "Bicycle Crunch", "3", "20-30 total", 60],
        ]),
        w("Workout 3 - Upper", "Upper", [
          ["A1", "Incline Dumbbell Bench Press", "5", "6-8", 90],
          ["A2", "Dumbbell Zottman Curls", "5", "10-12", 90],
          ["B1", "High Plank Renegade Row", "4", "10-12 total", 90],
          ["B2", "Bent Over Tricep Kickbacks", "4", "8-10", 90],
          ["C1", "Standing Overhead Tricep Extension", "3", "10-12", 60],
          ["C2", "Dumbbell Bent Rear Delt Lateral Raise", "3", "10-12", 60],
        ]),
        w("Workout 4 - Lower", "Lower", [
          ["A1", "Dumbbell Straight-Leg Deadlift", "5", "6-8", 120],
          ["B1", "Dumbbell Bulgarian Split Squat", "4", "6-8 each", 90],
          ["B2", "Reverse Hyperextensions", "4", "12-15", 90],
          ["C1", "Standing Calf Raises", "3", "10-12", 60],
          ["C2", "Leg Raises", "3", "10-12", 0],
          ["C3", "Dumbbell Situps", "3", "10-12", 60],
        ]),
        w("Workout 5 - Upper", "Upper", [
          ["A1", "Bench Dips", "5", "8-10", 120],
          ["B1", "Banded Lat Pull Downs", "4", "8-10 each", 60],
          ["B2", "Push Up", "4", "AMRAP", 90],
          ["C1", "Seated Dumbbell Lateral Raises", "3", "20", 0],
          ["C2", "Banded Face Pull", "3", "10-15", 60],
          ["C3", "Dumbbell Farmer's Carry", "3", "30s", 60],
        ]),
      ],
    },
    {
      label: "Plan C — Power", weeks: 4,
      workouts: [
        w("Workout 1 - Upper", "Upper", [
          ["A1", "Chin Ups", "6", "AMRAP", 120],
          ["B1", "Standing Dumbbell Overhead Press", "6", "6,6,4,4,2,2", 120, "Pyramid loading"],
          ["C1", "Flat Dumbbell Chest Press", "4", "4-6", 90],
          ["C2", "Single Arm Dumbbell Rows", "4", "4-6 each", 90],
          ["D1", "Lying Dumbbell Tricep Extensions", "3", "6-8", 60],
          ["D2", "Standing Dumbbell Hammer Curls", "3", "6-8", 60],
        ]),
        w("Workout 2 - Lower", "Lower", [
          ["A1", "Dumbbell Reverse Lunges Suitcase Hold", "6", "6-8 total", 120],
          ["B1", "Dumbbell Front Squat", "4", "4-6", 90],
          ["B2", "Dumbbell Hip Thrust", "4", "4-6", 90],
          ["C1", "Dumbbell Hamstring Curls", "3", "4-6", 60],
          ["C2", "Standing Calf Raises", "3", "8-10", 0],
          ["C3", "Stability Ball Pass Through", "3", "10-12", 60],
        ]),
        w("Workout 3 - Upper", "Upper", [
          ["A1", "Incline Dumbbell Bench Press", "6", "6,6,4,4,2,2", 120],
          ["B1", "Bent Over Dumbbell Row — Supinated", "6", "6,6,4,4,2,2", 90],
          ["C1", "Incline Dumbbell Chest Fly", "4", "6-8", 90],
          ["C2", "Standing Dumbbell Curls — Supinated", "4", "6-8", 90],
          ["D1", "Standing Dumbbell Lateral Raises", "3", "6-8", 60],
          ["D2", "Dumbbell Reverse Curls", "3", "6-8", 60],
        ]),
        w("Workout 4 - Lower", "Lower", [
          ["A1", "Dumbbell Straight-Leg Deadlift", "6", "6,6,4,4,2,2", 120],
          ["B1", "Dumbbell Bulgarian Split Squat", "4", "6-8 each", 90],
          ["B2", "Dumbbell Hip Thrust", "4", "6-8", 90],
          ["C1", "Standing Calf Raises", "3", "8-10", 60],
          ["C2", "Bicycle Crunch", "3", "18-20 total", 0],
          ["C3", "Dumbbell Stability Ball Crunch", "3", "8-10", 60],
        ]),
        w("Workout 5 - Upper", "Upper", [
          ["A1", "Bench Dips", "5", "6-8", 120],
          ["B1", "Decline Pushup", "4", "AMRAP", 60],
          ["B2", "Dumbbell Preacher Curls", "4", "6-8", 90],
          ["C1", "Dumbbell Crush Grip Bench Press", "3", "6-8", 0],
          ["C2", "Banded Face Pull", "3", "10-15", 0],
          ["C3", "Forearm Plank", "3", "30-60s", 60],
        ]),
      ],
    },
  ],
};

// =====================================================================
// WOMEN — 12 WEEK GYM
// =====================================================================
const WOMEN_GYM: Program = {
  slug: "womens-12wk-gym",
  name: "Women's 12-Week Body Recomp — Gym",
  audience: "women",
  location: "gym",
  goal: "recomp",
  level: "intermediate",
  daysPerWeek: 5,
  totalWeeks: 12,
  blurb: "Lower-focused recomp with two glute days per week plus upper sessions ending in HIIT cardio finishers. Builds shape, drops body fat.",
  equipment: ["Barbell + rack", "Dumbbells", "Cables", "Bench", "Step / box"],
  phases: [
    {
      label: "Plan A — Foundation", weeks: 4,
      workouts: [
        w("Workout 1 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Barbell Squats", "4", "12-15", 90],
          ["B1", "Dumbbell Step Ups", "4", "10-12 total", 60],
          ["B2", "Barbell Hip Thrust", "4", "12-15", 90],
          ["C1", "Dumbbell Straight Leg Deadlift", "4", "10-12", 60],
          ["C2", "Leg Raises", "4", "12-15", 0],
          ["C3", "Medicine Ball Russian Twist", "4", "20", 60],
        ]),
        w("Workout 2 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Lat Pull Down — Supinated", "4", "12-15", 60],
          ["A2", "Standing Arnold Press", "4", "10-12", 60],
          ["B1", "Pushups", "4", "12-15", 60],
          ["B2", "Dumbbell Bicep Curl — Supinated", "4", "10-12", 60],
          ["C1", "Sit to Squat Jump", "3", "20", 0],
          ["C2", "Skater Lunges", "3", "30 total", 0],
          ["C3", "High Knees w/ Overhead Weight", "3", "50 total", 90],
        ]),
        w("Workout 3 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Reverse Lunges", "4", "12-16 total", 90],
          ["B1", "Dumbbell Goblet Sumo Squat", "4", "12-15", 60],
          ["B2", "Lying Leg Curls", "4", "12-15", 60],
          ["C1", "Banded Lateral Walk", "4", "15 steps each", 60],
          ["C2", "Spiderman Forearm Plank", "4", "12-16 total", 0],
          ["C3", "Stability Ball Crunch", "4", "20", 60],
        ]),
        w("Workout 4 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Dumbbell Bent Over Row — Supinated", "4", "12-15", 60],
          ["A2", "Tricep Dips", "4", "10-12", 60],
          ["B1", "Standing Rope Face Pulls", "4", "12-15", 0],
          ["B2", "Bent Over Rear Delt Flys", "4", "10-12", 60],
          ["C1", "Jumping Lunge", "3", "20 total", 0],
          ["C2", "Mountain Climbers", "3", "30 total", 0],
          ["C3", "No Push Up Burpee", "3", "12", 90],
        ]),
      ],
    },
    {
      label: "Plan B — Density", weeks: 4,
      workouts: [
        w("Workout 1 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Barbell Squats", "4", "10-12", 90],
          ["B1", "Weighted Curtsy Lunge", "4", "10-12 total", 60],
          ["B2", "Barbell Hip Thrust", "4", "10-12", 90],
          ["C1", "Wall Assisted Single Leg Deadlift", "4", "8-10 each", 60],
          ["C2", "Forearm Plank Hip Dips", "4", "16-20 total", 0],
          ["C3", "Hollow Body Hold", "4", "30-45s", 60],
        ]),
        w("Workout 2 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Lat Pull Down — Supinated", "4", "10-12", 60],
          ["A2", "Standing Cuban Press", "4", "10-12", 60],
          ["B1", "Flat Dumbbell Chest Press", "4", "12-15", 60],
          ["B2", "Dumbbell Hammer Curl", "4", "10-12", 60],
          ["C1", "High Plank Jacks", "3", "30", 0],
          ["C2", "Butt Kicks", "3", "50 total", 0],
          ["C3", "Bicycle Crunch", "3", "20 total", 90],
        ]),
        w("Workout 3 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Bulgarian Split Squat", "4", "8-10 each", 90],
          ["B1", "Dumbbell Goblet Sumo Squat Pulse", "4", "10-12 pulses", 60],
          ["B2", "Lying Leg Curls", "4", "10-12", 60],
          ["C1", "Cable Glute Kickbacks", "4", "10-12 each", 60],
          ["C2", "V Ups", "4", "12-15", 0],
          ["C3", "Forearm Plank Knee Drop", "4", "15", 60],
        ]),
        w("Workout 4 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Dumbbell Bent Over Row — Supinated", "4", "10-12", 60],
          ["A2", "Hip Bridge Dumbbell Tricep Extension", "4", "10-12", 60],
          ["B1", "Incline Bench Dumbbell Chest Flys", "4", "12-15", 60],
          ["B2", "Bent Over Rear Delt Flys", "4", "10-12", 60],
          ["C1", "Floor Tap Squats", "3", "20 total", 0],
          ["C2", "Reverse Lunge Power Skip", "3", "10 each", 0],
          ["C3", "High Plank Shoulder Tap", "3", "20 total", 90],
        ]),
        w("Workout 5 - Full Body Fire", "Full Body Fire", [
          ["A1", "Bench Lateral Step Up Skips", "4", "12-16 total", 60],
          ["A2", "Bench Incline Push Ups + 2x Spiderman Crunch", "4", "8-10", 60],
          ["B1", "Front Weighted Lateral Lunge", "4", "10-12", 60],
          ["B2", "Dumbbell Renegade Row", "4", "10-12 total", 60],
          ["C1", "No Push Up Burpee", "4", "10-12", 60],
          ["C2", "Stability Ball Pass Through", "4", "10-12", 60],
        ]),
      ],
    },
    {
      label: "Plan C — Power", weeks: 4,
      workouts: [
        w("Workout 1 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Barbell Reverse Lunges", "4", "10-12 total", 90],
          ["B1", "KB Squat Jump", "4", "8-10", 60],
          ["B2", "Dumbbell Single Leg Hip Thrust", "4", "8-10 each", 90],
          ["C1", "Dumbbell Straight Leg Deadlift", "4", "8-10", 60],
          ["C2", "Cable Torso Twist", "4", "10 each", 0],
          ["C3", "Reverse Crunch", "4", "15", 60],
        ]),
        w("Workout 2 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Cable Single Arm Pull Down", "4", "8-10 each", 60],
          ["A2", "Standing Dumbbell Overhead Press", "4", "10-12", 60],
          ["B1", "Pushups", "4", "12-15", 60],
          ["B2", "Dumbbell Bicep Curl — Supinated", "4", "8-10", 60],
          ["C1", "Bench Hops", "3", "12", 0],
          ["C2", "Banded Mountain Climbers", "3", "30 total", 0],
          ["C3", "Forearm Plank", "3", "45-60s", 30],
        ]),
        w("Workout 3 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Bulgarian Split Squat", "4", "6-8 each", 90],
          ["B1", "Dumbbell Suitcase Narrow Squat", "4", "10-12", 60],
          ["B2", "Stability Ball Hamstring Curls", "4", "8-10", 60],
          ["C1", "Cable Glute Kickbacks", "4", "8-10 each", 60],
          ["C2", "Oblique V Ups", "4", "8-10 each", 0],
          ["C3", "Stability Ball Forearm Plank", "4", "45-60s", 60],
        ]),
        w("Workout 4 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Dumbbell Bent Over Row — Pronated", "4", "8-10", 60],
          ["A2", "Hip Bridge Dumbbell Tricep Extension", "4", "10-12", 60],
          ["B1", "Stability Ball Chest Fly", "4", "12-15", 60],
          ["B2", "Dumbbell Hip Bridge Pullover", "4", "10-12", 60],
          ["C1", "Bodyweight Versa Climber", "3", "30s", 0],
          ["C2", "High Plank In/Outs", "3", "15", 0],
          ["C3", "Banded Bicycle Crunch", "3", "20 total", 90],
        ]),
        w("Workout 5 - Full Body Fire", "Full Body Fire", [
          ["A1", "Banded Squat to High Row", "4", "12-15", 60],
          ["A2", "Weighted Sit Up", "4", "10-12", 60],
          ["B1", "3 Point Lateral Raises", "4", "6-8", 60],
          ["B2", "Dumbbell Renegade Row", "4", "10-12 total", 60],
          ["C1", "Weighted Superman + Lat Pull", "4", "10-12", 60],
          ["C2", "Scissor Kicks", "4", "20 total", 60],
        ]),
      ],
    },
  ],
};

// =====================================================================
// WOMEN — 12 WEEK HOME
// =====================================================================
const WOMEN_HOME: Program = {
  slug: "womens-12wk-home",
  name: "Women's 12-Week Body Recomp — Home",
  audience: "women",
  location: "home",
  goal: "recomp",
  level: "intermediate",
  daysPerWeek: 5,
  totalWeeks: 12,
  blurb: "Dumbbell-only home version of the gym recomp plan. Identical structure: two glute days, two upper-plus-HIIT days, and a Full-Body Fire session in phases B and C.",
  equipment: ["Dumbbells (adjustable preferred)", "Bench", "Resistance band", "Stability ball (optional)"],
  phases: [
    {
      label: "Plan A — Foundation", weeks: 4,
      workouts: [
        w("Workout 1 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Front Squats", "4", "12-15", 90],
          ["B1", "Dumbbell Step Ups", "4", "10-12 total", 60],
          ["B2", "Dumbbell Hip Thrust", "4", "12-15", 90],
          ["C1", "Dumbbell Straight Leg Deadlift", "4", "10-12", 60],
          ["C2", "Leg Raises", "4", "12-15", 0],
          ["C3", "Straight Arm Russian Twist", "4", "20", 60],
        ]),
        w("Workout 2 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Banded Lat Pull Down", "4", "12-15", 60],
          ["A2", "Standing Arnold Press", "4", "10-12", 60],
          ["B1", "Pushups", "4", "12-15", 60],
          ["B2", "Dumbbell Bicep Curl — Supinated", "4", "10-12", 60],
          ["C1", "Sit to Squat Jump", "3", "20", 0],
          ["C2", "Skater Lunges", "3", "30 total", 0],
          ["C3", "High Knees w/ Overhead Weight", "3", "50 total", 90],
        ]),
        w("Workout 3 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Reverse Lunges", "4", "12-16 total", 90],
          ["B1", "Dumbbell Goblet Sumo Squat", "4", "12-15", 60],
          ["B2", "Lying Dumbbell Hamstring Leg Curls", "4", "12-15", 60],
          ["C1", "Banded Lateral Walk", "4", "15 steps each", 60],
          ["C2", "Spiderman Forearm Plank", "4", "12-16 total", 0],
          ["C3", "Straight Arm Overhead Sit Up", "4", "10-12", 60],
        ]),
        w("Workout 4 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Dumbbell Bent Over Row — Supinated", "4", "12-15", 60],
          ["A2", "Tricep Bench Dips", "4", "10-12", 60],
          ["B1", "Standing Dumbbell Upright Row", "4", "12-15", 0],
          ["B2", "Bent Over Rear Delt Flys", "4", "10-12", 60],
          ["C1", "Jumping Lunge", "3", "20 total", 0],
          ["C2", "Mountain Climbers", "3", "30 total", 0],
          ["C3", "No Push Up Burpee", "3", "12", 90],
        ]),
      ],
    },
    {
      label: "Plan B — Density", weeks: 4,
      workouts: [
        w("Workout 1 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Front Squats", "4", "10-12", 90],
          ["B1", "Dumbbell Alt. Curtsy Lunge", "4", "10-12 total", 60],
          ["B2", "Dumbbell Hip Thrust", "4", "10-12", 90],
          ["C1", "Wall Assisted Single Leg Deadlift", "4", "8-10 each", 60],
          ["C2", "Forearm Plank Hip Dips", "4", "16-20 total", 0],
          ["C3", "Hollow Body Hold", "4", "30-45s", 60],
        ]),
        w("Workout 2 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Banded Lat Pull Down", "4", "10-12", 60],
          ["A2", "Standing Cuban Press", "4", "10-12", 60],
          ["B1", "Flat Dumbbell Chest Press", "4", "12-15", 60],
          ["B2", "Dumbbell Hammer Curl", "4", "10-12", 60],
          ["C1", "High Plank Jacks", "3", "30", 0],
          ["C2", "Butt Kicks", "3", "50 total", 0],
          ["C3", "Bicycle Crunch", "3", "20 total", 90],
        ]),
        w("Workout 3 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Bulgarian Split Squat", "4", "8-10 each", 90],
          ["B1", "Dumbbell Goblet Sumo Squat Pulse", "4", "10-12 pulses", 60],
          ["B2", "Lying Dumbbell Hamstring Leg Curls", "4", "10-12", 60],
          ["C1", "Table Top Dumbbell Glute Kickbacks", "4", "10-12 each", 60],
          ["C2", "V Ups", "4", "12-15", 0],
          ["C3", "Forearm Plank Knee Drop", "4", "15", 60],
        ]),
        w("Workout 4 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Dumbbell Bent Over Row — Supinated", "4", "10-12", 60],
          ["A2", "Hip Bridge Dumbbell Tricep Extension", "4", "10-12", 60],
          ["B1", "Incline Bench Dumbbell Chest Flys", "4", "12-15", 60],
          ["B2", "Bent Over Rear Delt Flys", "4", "10-12", 60],
          ["C1", "Floor Tap Squats", "3", "20 total", 0],
          ["C2", "Reverse Lunge Power Skip", "3", "10 each", 0],
          ["C3", "High Plank Shoulder Tap", "3", "20 total", 90],
        ]),
        w("Workout 5 - Full Body Fire", "Full Body Fire", [
          ["A1", "Bench Lateral Step Up Skips", "4", "12-16 total", 60],
          ["A2", "Bench Incline Push Ups + 2x Spiderman Crunch", "4", "8-10", 60],
          ["B1", "Front Weighted Lateral Lunge", "4", "10-12", 60],
          ["B2", "Dumbbell Renegade Row", "4", "10-12 total", 60],
          ["C1", "No Push Up Burpee", "4", "10-12", 60],
          ["C2", "Stability Ball Pass Through", "4", "10-12", 60],
        ]),
      ],
    },
    {
      label: "Plan C — Power", weeks: 4,
      workouts: [
        w("Workout 1 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Suitcase Hold Reverse Lunges", "4", "10-12 total", 90],
          ["B1", "KB/DB Squat Jump", "4", "8-10", 60],
          ["B2", "Dumbbell Single Leg Hip Thrust", "4", "8-10 each", 90],
          ["C1", "Dumbbell Straight Leg Deadlift", "4", "8-10", 60],
          ["C2", "Banded Torso Twist", "4", "10 each", 0],
          ["C3", "Reverse Crunch", "4", "15", 60],
        ]),
        w("Workout 2 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Banded Single Arm Pull Down", "4", "8-10 each", 60],
          ["A2", "Standing Dumbbell Overhead Press", "4", "10-12", 60],
          ["B1", "Pushups", "4", "12-15", 60],
          ["B2", "Dumbbell Bicep Curl — Supinated", "4", "8-10", 60],
          ["C1", "Bench Hops", "3", "12", 0],
          ["C2", "Banded Mountain Climbers", "3", "30 total", 0],
          ["C3", "Forearm Plank", "3", "45-60s", 30],
        ]),
        w("Workout 3 - Legs + Glutes + Core", "Legs + Glutes + Core", [
          ["A1", "Dumbbell Bulgarian Split Squat", "4", "6-8 each", 90],
          ["B1", "Dumbbell Suitcase Narrow Squat", "4", "10-12", 60],
          ["B2", "Stability Ball Hamstring Curls", "4", "8-10", 60],
          ["C1", "Table Top Dumbbell Kickbacks", "4", "8-10 each", 60],
          ["C2", "Oblique V Ups", "4", "8-10 each", 0],
          ["C3", "Stability Ball Forearm Plank", "4", "45-60s", 60],
        ]),
        w("Workout 4 - Upper + HIIT Cardio", "Upper + HIIT Cardio", [
          ["A1", "Dumbbell Bent Over Row — Pronated", "4", "8-10", 60],
          ["A2", "Hip Bridge Dumbbell Tricep Extension", "4", "10-12", 60],
          ["B1", "Stability Ball Chest Fly", "4", "12-15", 60],
          ["B2", "Dumbbell Hip Bridge Pullover", "4", "10-12", 60],
          ["C1", "Bodyweight Versa Climber", "3", "30s", 0],
          ["C2", "High Plank In/Outs", "3", "15", 0],
          ["C3", "Banded Bicycle Crunch", "3", "20 total", 90],
        ]),
        w("Workout 5 - Full Body Fire", "Full Body Fire", [
          ["A1", "Banded Squat to High Row", "4", "12-15", 60],
          ["A2", "Weighted Sit Up", "4", "10-12", 60],
          ["B1", "3 Point Lateral Raises", "4", "6-8", 60],
          ["B2", "Dumbbell Renegade Row", "4", "10-12 total", 60],
          ["C1", "Weighted Superman + Lat Pull", "4", "10-12", 60],
          ["C2", "Scissor Kicks", "4", "20 total", 60],
        ]),
      ],
    },
  ],
};

export const PROGRAMS: Program[] = [MEN_GYM, MEN_HOME, WOMEN_GYM, WOMEN_HOME];

export const GOAL_LABEL = { recomp: "Body Recomp" } as const;

/** YouTube watch / search URL for an exercise. Prefers curated videoId; falls back to a focused search. */
export function exerciseVideoUrl(ex: Exercise): string {
  if (ex.videoId) return `https://www.youtube.com/watch?v=${ex.videoId}`;
  const q = encodeURIComponent(`${ex.name} proper form tutorial`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

/** Recommended weekdays (1=Mon..7=Sun) for N workouts/week, evenly spaced. */
export function recommendedWeekdays(n: number): number[] {
  switch (n) {
    case 1: return [1];
    case 2: return [1, 4];
    case 3: return [1, 3, 5];
    case 4: return [1, 2, 4, 5];
    case 5: return [1, 2, 3, 5, 6];
    case 6: return [1, 2, 3, 4, 6, 7];
    case 7: return [1, 2, 3, 4, 5, 6, 7];
    default: return [1, 2, 4, 5];
  }
}
