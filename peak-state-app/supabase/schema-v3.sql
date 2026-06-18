-- Peak State Labs — schema v3 migration (Workouts upgrade)
-- Adds program tracking, scheduled training days, and richer set logging.
-- Safe to re-run.

-- workout_sessions: link to a program + day, give each a body-part focus label
alter table public.workout_sessions add column if not exists program_slug text;
alter table public.workout_sessions add column if not exists day_label text;
alter table public.workout_sessions add column if not exists focus text;
alter table public.workout_sessions add column if not exists completed_at timestamptz;

-- workout_sets: track completion + ordering within an exercise
alter table public.workout_sets add column if not exists completed boolean not null default false;
alter table public.workout_sets add column if not exists target_reps text;
alter table public.workout_sets add column if not exists is_pr boolean not null default false;

-- profiles: workout preferences
alter table public.profiles add column if not exists weight_unit text not null default 'lb';
alter table public.profiles add column if not exists active_program_started date;

-- indexes for dashboard + calendar queries
create index if not exists ws_user_sched_idx on public.workout_sessions (user_id, scheduled_for);
create index if not exists ws_sets_user_idx on public.workout_sets (user_id, exercise);
