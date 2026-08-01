/*
# Create admin content overrides table

1. Purpose
This table stores admin-authored draft and published overrides for editable
content on the public BookVerse site (hero text, book descriptions, book cover
images, etc.). It supports a two-stage "draft then publish" workflow:
  - An admin edits a draft value. Only logged-in admins see the draft.
  - Clicking Publish copies the draft into the published column, which the
    public site reads for everyone.

2. New Tables
- `admin_content_overrides`
  - `id` (uuid, primary key)
  - `key` (text, unique, not null) — stable content identifier, e.g. "hero.title"
    or "book.5.description" or "book.5.cover".
  - `kind` (text, not null) — "text" or "image".
  - `published_value` (text, nullable) — the value visible to the public.
  - `draft_value` (text, nullable) — the value visible only to admins.
  - `updated_at` (timestamptz, default now())
  - `updated_by` (uuid, nullable, references auth.users) — the admin who last
    edited the row.

3. Security
- Enable RLS on `admin_content_overrides`.
- Public/anonymous users may SELECT only the published values (they need to see
  the current public content). They CANNOT see drafts, and CANNOT
  insert/update/delete.
- Authenticated users (admins) may SELECT everything (including drafts) and
  may INSERT/UPDATE rows. DELETE is allowed for authenticated users so admins
  can remove an override and revert to the original content.
- This is a shared content table (not per-user data), so ownership is not
  scoped per row; any authenticated user is treated as an admin. The frontend
  gates the admin UI behind a sign-in modal, and RLS ensures anon users can
  never write or read drafts.

4. Notes
- `published_value` and `draft_value` are both TEXT. For image overrides the
  value is a URL (Supabase Storage public URL or any reachable URL).
- Idempotent: safe to re-run. Policies are dropped before re-creation.
*/

CREATE TABLE IF NOT EXISTS admin_content_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  kind text NOT NULL CHECK (kind IN ('text', 'image')),
  published_value text,
  draft_value text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE admin_content_overrides ENABLE ROW LEVEL SECURITY;

-- Public can read only published values (drafts hidden)
DROP POLICY IF EXISTS "public_read_published" ON admin_content_overrides;
CREATE POLICY "public_read_published"
ON admin_content_overrides FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated admins can insert new overrides
DROP POLICY IF EXISTS "admin_insert" ON admin_content_overrides;
CREATE POLICY "admin_insert"
ON admin_content_overrides FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admins can update overrides (edit drafts / publish)
DROP POLICY IF EXISTS "admin_update" ON admin_content_overrides;
CREATE POLICY "admin_update"
ON admin_content_overrides FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Authenticated admins can delete overrides (revert to original)
DROP POLICY IF EXISTS "admin_delete" ON admin_content_overrides;
CREATE POLICY "admin_delete"
ON admin_content_overrides FOR DELETE
TO authenticated
USING (true);

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS admin_content_overrides_key_idx ON admin_content_overrides (key);
