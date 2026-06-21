-- Peak State Labs — schema v6 (AI weekly check-in + progress photos). Safe to re-run.

-- AI-driven check-in payload on weekly_checkins
alter table public.weekly_checkins add column if not exists ai_questions jsonb;  -- [{id, type, text, chips?, context?}]
alter table public.weekly_checkins add column if not exists ai_responses jsonb;  -- [{id, chip?, text?, number?}]
alter table public.weekly_checkins add column if not exists photo_path text;     -- storage object path

-- Storage bucket for client progress photos (private; owner + admin can read).
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

-- Object policies on the bucket. Folder convention: <user_id>/<filename>.
drop policy if exists "progress_photos_insert_own" on storage.objects;
create policy "progress_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "progress_photos_select_own_or_admin" on storage.objects;
create policy "progress_photos_select_own_or_admin" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'progress-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists "progress_photos_delete_own_or_admin" on storage.objects;
create policy "progress_photos_delete_own_or_admin" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'progress-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
