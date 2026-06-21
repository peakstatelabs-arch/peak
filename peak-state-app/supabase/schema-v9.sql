-- Peak State Labs — schema v9 (Opt-in modules). Safe to re-run.
-- Default empty array = minimal experience for everyone, including
-- existing clients. They can re-enable modules from Profile → More features.

alter table public.profiles
  add column if not exists enabled_modules text[] not null default '{}'::text[];
