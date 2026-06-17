-- Peak State Labs — schema v2 migration
-- Adds Power Cut protocol tracking, dosing time preferences, and notification opt-in.
-- Safe to re-run.

-- profiles: add dosing time preferences + notification opt-in
alter table public.profiles add column if not exists morning_time text default '08:00';
alter table public.profiles add column if not exists evening_time text default '20:00';
alter table public.profiles add column if not exists notifications_enabled boolean not null default false;
alter table public.profiles add column if not exists timezone text;

-- peptide_protocols: track which template they're on
alter table public.peptide_protocols add column if not exists protocol_type text;
alter table public.peptide_protocols add column if not exists stacks int;
alter table public.peptide_protocols add column if not exists bpc_track text; -- 'foundation' | 'performance'

-- peptide_doses: notes column may already exist; ensure present
alter table public.peptide_doses add column if not exists protocol_id uuid references public.peptide_protocols(id) on delete set null;

-- Helpful index for calendar queries
create index if not exists peptide_doses_user_month_idx
  on public.peptide_doses (user_id, scheduled_for);

-- Replace-only insert helper: clear future doses for a user when re-saving a protocol.
-- (Called from app code, not as a DB trigger; included here for reference.)
