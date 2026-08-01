CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  cover text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS playlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  added_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_public_playlists" ON playlists;
CREATE POLICY "public_read_public_playlists"
ON playlists FOR SELECT
TO anon, authenticated
USING (is_public = true);

DROP POLICY IF EXISTS "users_read_own_playlists" ON playlists;
CREATE POLICY "users_read_own_playlists"
ON playlists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_playlists" ON playlists;
CREATE POLICY "users_insert_own_playlists"
ON playlists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_playlists" ON playlists;
CREATE POLICY "users_update_own_playlists"
ON playlists FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_playlists" ON playlists;
CREATE POLICY "users_delete_own_playlists"
ON playlists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "playlist_items_read" ON playlist_items;
CREATE POLICY "playlist_items_read"
ON playlist_items FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "playlist_items_insert" ON playlist_items;
CREATE POLICY "playlist_items_insert"
ON playlist_items FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "playlist_items_delete" ON playlist_items;
CREATE POLICY "playlist_items_delete"
ON playlist_items FOR DELETE
TO authenticated
USING (true);

CREATE INDEX IF NOT EXISTS playlists_user_id_idx ON playlists (user_id);
CREATE INDEX IF NOT EXISTS playlist_items_playlist_id_idx ON playlist_items (playlist_id);