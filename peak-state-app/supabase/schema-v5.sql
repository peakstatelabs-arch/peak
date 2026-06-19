-- Peak State Labs — schema v5 (Web Push reminders). Safe to re-run.

-- One row per device/browser the user has opted in on.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  unique (user_id, endpoint)
);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;
drop policy if exists "push_subs_owner" on public.push_subscriptions;
create policy "push_subs_owner" on public.push_subscriptions for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- Track which doses we've already sent a reminder for, so the cron never spams.
alter table public.peptide_doses add column if not exists reminder_sent_at timestamptz;
