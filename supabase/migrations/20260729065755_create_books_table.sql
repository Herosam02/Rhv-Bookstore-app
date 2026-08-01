/*
# Create books table for user-added books

1. Purpose
Allows signed-in users (sellers, admins) to add new books to the BookVerse
catalog and delete books they added. The static seed catalog shipped in the
frontend (src/data/books.ts) remains as a permanent base; this table holds
user-contributed books that are merged into the live catalog on load.

2. New Tables
- `books`
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `author` (text, not null)
  - `cover` (text, nullable) — image URL
  - `price` (numeric, default 0)
  - `original_price` (numeric, nullable)
  - `rating` (numeric, default 0)
  - `review_count` (integer, default 0)
  - `genre` (text, default 'Fiction')
  - `tags` (text[], default '{}')
  - `description` (text, default '')
  - `publisher` (text, default 'Self-published')
  - `published_year` (integer, default 2024)
  - `pages` (integer, default 300)
  - `language` (text, default 'English')
  - `availability` (text, default 'in-stock')
  - `release_date` (date, default current_date)
  - `user_id` (uuid, not null, default auth.uid(), references auth.users ON DELETE CASCADE)
  - `created_at` (timestamptz, default now())

3. Security
- Enable RLS on `books`.
- Public read: anyone (anon + authenticated) can SELECT — the catalog is
  visible to all visitors.
- Insert: authenticated users only (must be signed in to add a book). The
  user_id defaults to auth.uid() so the row is owned by the creator.
- Update: the owner can update their own books.
- Delete: the owner can delete their own books. (Admin deletion of any book
  is handled via the service role key path in the frontend admin flow.)

4. Notes
- Idempotent: safe to re-run. Policies dropped before re-creation.
- Index on user_id for fast "my books" queries.
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  cover text,
  price numeric NOT NULL DEFAULT 0,
  original_price numeric,
  rating numeric NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  genre text NOT NULL DEFAULT 'Fiction',
  tags text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  publisher text NOT NULL DEFAULT 'Self-published',
  published_year integer NOT NULL DEFAULT 2024,
  pages integer NOT NULL DEFAULT 300,
  language text NOT NULL DEFAULT 'English',
  availability text NOT NULL DEFAULT 'in-stock',
  release_date date NOT NULL DEFAULT current_date,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can see the catalog
DROP POLICY IF EXISTS "public_read_books" ON books;
CREATE POLICY "public_read_books"
ON books FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users can add books (owned by them via default)
DROP POLICY IF EXISTS "insert_own_books" ON books;
CREATE POLICY "insert_own_books"
ON books FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Owner can update their books
DROP POLICY IF EXISTS "update_own_books" ON books;
CREATE POLICY "update_own_books"
ON books FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Owner can delete their books
DROP POLICY IF EXISTS "delete_own_books" ON books;
CREATE POLICY "delete_own_books"
ON books FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS books_user_id_idx ON books (user_id);
CREATE INDEX IF NOT EXISTS books_genre_idx ON books (genre);
