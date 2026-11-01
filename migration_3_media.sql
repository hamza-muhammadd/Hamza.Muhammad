-- Photo library: lets the admin list files in the 'site' bucket (run once)
drop policy if exists "admin list files" on storage.objects;
create policy "admin list files" on storage.objects for select using (bucket_id = 'site' and is_admin());
