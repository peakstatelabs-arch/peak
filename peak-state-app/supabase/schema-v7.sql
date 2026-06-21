-- Peak State Labs — schema v7 (Community upgrades: posts, comments, photos, streak idempotency). Safe to re-run.

-- Extend milestones for manual posts (text body + photo)
alter table public.community_milestones add column if not exists body text;
alter table public.community_milestones add column if not exists photo_path text;
alter table public.community_milestones add column if not exists source text not null default 'auto';

-- A user only gets each streak tier once.
create unique index if not exists community_milestones_unique_streak
  on public.community_milestones (user_id, kind)
  where kind like 'streak_%';

-- Comments on a milestone/post
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.community_milestones(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) > 0 and length(body) <= 280),
  created_at timestamptz not null default now()
);
create index if not exists community_comments_milestone_idx
  on public.community_comments (milestone_id, created_at);

alter table public.community_comments enable row level security;

drop policy if exists "community_comments_read" on public.community_comments;
create policy "community_comments_read" on public.community_comments
  for select to authenticated using (true);

drop policy if exists "community_comments_insert" on public.community_comments;
create policy "community_comments_insert" on public.community_comments
  for insert with check (auth.uid() = user_id);

drop policy if exists "community_comments_delete" on public.community_comments;
create policy "community_comments_delete" on public.community_comments
  for delete using (auth.uid() = user_id or public.is_admin());

-- Public bucket for community post photos. Paths include the user's
-- uuid + a random suffix, so they're not enumerable by guessing.
insert into storage.buckets (id, name, public)
values ('community-posts', 'community-posts', true)
on conflict (id) do nothing;

drop policy if exists "community_posts_insert_own" on storage.objects;
create policy "community_posts_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'community-posts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "community_posts_select_all" on storage.objects;
create policy "community_posts_select_all" on storage.objects
  for select to authenticated
  using (bucket_id = 'community-posts');

drop policy if exists "community_posts_delete_own_or_admin" on storage.objects;
create policy "community_posts_delete_own_or_admin" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'community-posts'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
