-- ============================================================
-- Storage policies for the `media` bucket.
--
-- Marking a Storage bucket "Public" in the dashboard only makes
-- downloads public by default — it does NOT grant upload/delete
-- permission. Supabase Storage has its own RLS on `storage.objects`,
-- separate from the table policies in rls.sql. Run this AFTER
-- creating the `media` bucket (Storage → New bucket → name: media).
--
-- Reuses the is_admin() helper defined in rls.sql.
-- ============================================================

create policy "Public read access for media bucket"
on storage.objects for select
using (bucket_id = 'media');

create policy "Admins can upload to media bucket"
on storage.objects for insert
with check (bucket_id = 'media' and is_admin());

create policy "Admins can update media bucket objects"
on storage.objects for update
using (bucket_id = 'media' and is_admin())
with check (bucket_id = 'media' and is_admin());

create policy "Admins can delete media bucket objects"
on storage.objects for delete
using (bucket_id = 'media' and is_admin());
