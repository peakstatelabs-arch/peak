-- Peak State Labs — client portal schema + RLS
-- Run this in the Supabase SQL editor against the project.
-- Re-running is safe: uses IF NOT EXISTS / DROP-then-CREATE for policies.

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  must_change_password boolean not null default true,
  disclaimer_dismissed boolean not null default false,
  disclaimer_dismissed_at timestamptz,
  goal_weight_lb numeric(6,2),
  active_program text,
  public_handle text,
  created_at timestamptz not null default now()
);

-- Auto-insert a profile row on user creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, must_change_password, disclaimer_dismissed)
  values (new.id, true, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert" on public.profiles
  for insert with check (public.is_admin() or auth.uid() = id);

-- ────────────────────────────────────────────────────────────────────────────
-- peptide protocols + doses
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.peptide_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  peptide_name text not null,
  dose_mg numeric(6,3) not null,
  frequency text not null,
  time_of_day text,
  start_date date not null,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists peptide_protocols_user_idx on public.peptide_protocols(user_id, created_at desc);

create table if not exists public.peptide_doses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  protocol_id uuid references public.peptide_protocols(id) on delete set null,
  peptide_name text not null,
  dose_mg numeric(6,3) not null,
  scheduled_for date not null,
  time_of_day text,
  taken boolean not null default false,
  taken_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists peptide_doses_user_idx on public.peptide_doses(user_id, scheduled_for);

alter table public.peptide_protocols enable row level security;
alter table public.peptide_doses enable row level security;

drop policy if exists "protocols_owner" on public.peptide_protocols;
create policy "protocols_owner" on public.peptide_protocols
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "doses_owner" on public.peptide_doses;
create policy "doses_owner" on public.peptide_doses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- body tracking
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.body_weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_lb numeric(6,2) not null,
  logged_for date not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, logged_for)
);
create index if not exists body_weight_user_idx on public.body_weight_logs(user_id, logged_for desc);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_for date not null,
  waist_in numeric(5,2),
  chest_in numeric(5,2),
  hip_in numeric(5,2),
  arm_in numeric(5,2),
  thigh_in numeric(5,2),
  body_fat_pct numeric(5,2),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists body_meas_user_idx on public.body_measurements(user_id, logged_for desc);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  logged_for date not null,
  created_at timestamptz not null default now()
);
create index if not exists progress_photos_user_idx on public.progress_photos(user_id, logged_for desc);

alter table public.body_weight_logs enable row level security;
alter table public.body_measurements enable row level security;
alter table public.progress_photos enable row level security;

drop policy if exists "bw_owner" on public.body_weight_logs;
create policy "bw_owner" on public.body_weight_logs for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "meas_owner" on public.body_measurements;
create policy "meas_owner" on public.body_measurements for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "photos_owner" on public.progress_photos;
create policy "photos_owner" on public.progress_photos for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- workouts
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  scheduled_for date not null,
  completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists ws_user_idx on public.workout_sessions(user_id, scheduled_for desc);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.workout_sessions(id) on delete cascade,
  exercise text not null,
  set_number int not null,
  weight_lb numeric(6,2),
  reps int,
  rpe numeric(3,1),
  created_at timestamptz not null default now()
);
create index if not exists ws_sets_idx on public.workout_sets(session_id);

alter table public.workout_sessions enable row level security;
alter table public.workout_sets enable row level security;

drop policy if exists "ws_owner" on public.workout_sessions;
create policy "ws_owner" on public.workout_sessions for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "ws_sets_owner" on public.workout_sets;
create policy "ws_sets_owner" on public.workout_sets for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- weekly check-ins
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_key text not null,
  weight_lb numeric(6,2),
  energy int check (energy between 1 and 10),
  sleep int check (sleep between 1 and 10),
  mood int check (mood between 1 and 10),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists wc_user_idx on public.weekly_checkins(user_id, created_at desc);

alter table public.weekly_checkins enable row level security;

drop policy if exists "wc_owner" on public.weekly_checkins;
create policy "wc_owner" on public.weekly_checkins for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- community
-- ────────────────────────────────────────────────────────────────────────────
-- A view that exposes only privacy-safe info: public_name + streak_days.
create or replace view public.community_members as
select
  p.id as user_id,
  case
    when p.first_name is not null and p.last_name is not null
      then p.first_name || ' ' || left(p.last_name, 1) || '.'
    when p.first_name is not null then p.first_name
    else coalesce(p.public_handle, 'Anonymous')
  end as public_name,
  coalesce((
    select count(*)::int from (
      select scheduled_for, bool_and(taken) as all_done
      from public.peptide_doses d
      where d.user_id = p.id
        and d.scheduled_for between current_date - 60 and current_date
      group by scheduled_for
    ) s
    where s.all_done
  ), 0) as streak_days
from public.profiles p
where p.role = 'client';

grant select on public.community_members to authenticated;

create table if not exists public.community_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  created_at timestamptz not null default now()
);
create index if not exists milestones_idx on public.community_milestones(created_at desc);

alter table public.community_milestones enable row level security;

drop policy if exists "milestones_select_all" on public.community_milestones;
create policy "milestones_select_all" on public.community_milestones
  for select to authenticated using (true);

drop policy if exists "milestones_self_insert" on public.community_milestones;
create policy "milestones_self_insert" on public.community_milestones
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "milestones_self_delete" on public.community_milestones;
create policy "milestones_self_delete" on public.community_milestones
  for delete using (auth.uid() = user_id or public.is_admin());

create table if not exists public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.community_milestones(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now()
);
create index if not exists reactions_idx on public.community_reactions(milestone_id);

alter table public.community_reactions enable row level security;

drop policy if exists "reactions_select_all" on public.community_reactions;
create policy "reactions_select_all" on public.community_reactions
  for select to authenticated using (true);

drop policy if exists "reactions_self_insert" on public.community_reactions;
create policy "reactions_self_insert" on public.community_reactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "reactions_self_delete" on public.community_reactions;
create policy "reactions_self_delete" on public.community_reactions
  for delete using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- Auto-emit milestones at week 4, 8, 12 of streak (simple example).
-- This is left as a manual / cron job in v1; the table is ready.
-- ────────────────────────────────────────────────────────────────────────────

-- To make yourself admin after signing up:
-- update public.profiles set role = 'admin', must_change_password = false where id = '<your-uid>';
