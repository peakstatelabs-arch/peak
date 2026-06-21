-- Peak State Labs — schema v10 (Body fat tracking). Safe to re-run.
-- Goal BF + per-user toggle for the Body Tracker's BF card. Defaults
-- to off so existing clients aren't shown a section they didn't ask
-- for; the onboarding wizard flips it on automatically when the
-- client enters a current or goal BF during setup.

alter table public.profiles
  add column if not exists goal_bf_pct numeric,
  add column if not exists bf_tracking_enabled boolean not null default false;
