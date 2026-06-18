-- Peak State Labs — schema v4 (Nutrition upgrade). Safe to re-run.

-- profiles: nutrition profile fields
alter table public.profiles add column if not exists metabolic_type text;
alter table public.profiles add column if not exists metabolic_quiz jsonb;          -- stored quiz answers/result
alter table public.profiles add column if not exists nutrition_targets jsonb;        -- { kcal, protein, carbs, fat, goal, inputs }
alter table public.profiles add column if not exists dietary_prefs jsonb;            -- { likes, dislikes, allergies, style }

-- meal logs (one row per logged meal)
create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_for date not null,
  meal_type text not null default 'meal',         -- breakfast | lunch | dinner | snack | meal
  description text not null,
  kcal int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0,
  items jsonb,                                      -- AI per-item breakdown
  source text not null default 'manual',           -- manual | ai-text | ai-photo
  created_at timestamptz not null default now()
);
create index if not exists meal_logs_user_day_idx on public.meal_logs (user_id, logged_for);

alter table public.meal_logs enable row level security;
drop policy if exists "meal_logs_owner" on public.meal_logs;
create policy "meal_logs_owner" on public.meal_logs for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- AI-generated meal plans
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  plan jsonb not null,                             -- { days: [ { day, meals: [...] } ], grocery: [...] }
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists meal_plans_user_idx on public.meal_plans (user_id, created_at desc);

alter table public.meal_plans enable row level security;
drop policy if exists "meal_plans_owner" on public.meal_plans;
create policy "meal_plans_owner" on public.meal_plans for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());
