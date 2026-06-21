-- Peak State Labs — schema v8 (Terms & Privacy acceptance). Safe to re-run.

alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
