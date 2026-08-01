/*
# Storage policies for admin-images bucket

1. Purpose
Allow authenticated admins to upload/delete images to the public `admin-images`
bucket, and allow anyone (anon) to read them so published images render for all
visitors. Draft images uploaded by admins are also stored here; the draft/published
distinction is enforced at the database row level (admin_content_overrides), not
at the storage level — the URL is what's gated.

2. Security
- SELECT (read/download): public — anyone can read images by URL.
- INSERT (upload): authenticated only.
- UPDATE: authenticated only.
- DELETE: authenticated only.
*/

DROP POLICY IF EXISTS "public_read_admin_images" ON storage.objects;
CREATE POLICY "public_read_admin_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'admin-images');

DROP POLICY IF EXISTS "admin_upload_admin_images" ON storage.objects;
CREATE POLICY "admin_upload_admin_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'admin-images');

DROP POLICY IF EXISTS "admin_update_admin_images" ON storage.objects;
CREATE POLICY "admin_update_admin_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'admin-images') WITH CHECK (bucket_id = 'admin-images');

DROP POLICY IF EXISTS "admin_delete_admin_images" ON storage.objects;
CREATE POLICY "admin_delete_admin_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'admin-images');
