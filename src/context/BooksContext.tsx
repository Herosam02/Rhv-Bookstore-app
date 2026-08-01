import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { books as seedBooks, genres as seedGenres, authors as seedAuthors } from '../data/books';
import type { Book } from '../types';

interface BookRow {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  genre: string;
  tags: string[] | null;
  description: string;
  publisher: string;
  published_year: number;
  pages: number;
  language: string;
  availability: string;
  release_date: string;
  user_id: string;
  created_at: string;
}

function rowToBook(r: BookRow): Book {
  return {
    id: r.id,
    title: r.title,
    author: r.author,
    cover: r.cover || `https://picsum.photos/seed/${encodeURIComponent(r.title)}/400/600`,
    price: Number(r.price),
    originalPrice: r.original_price != null ? Number(r.original_price) : undefined,
    rating: Number(r.rating),
    reviewCount: Number(r.review_count),
    genre: r.genre,
    tags: r.tags || [],
    description: r.description,
    publisher: r.publisher,
    publishedYear: r.published_year,
    pages: r.pages,
    language: r.language,
    isbn: 'N/A',
    availability: r.availability as Book['availability'],
    isNewArrival: true,
    releaseDate: r.release_date,
    reviews: [],
    chapters: [],
    similar: [],
  };
}

interface NewBookInput {
  title: string;
  author: string;
  cover?: string;
  price: number;
  originalPrice?: number;
  genre: string;
  tags: string[];
  description: string;
  publisher?: string;
  pages?: number;
  availability?: string;
}

interface UpdateBookInput {
  title?: string;
  author?: string;
  cover?: string;
  price?: number;
  original_price?: number | null;
  genre?: string;
  tags?: string[];
  description?: string;
  publisher?: string;
  pages?: number;
  availability?: string;
}

interface BooksContextValue {
  books: Book[];
  genres: string[];
  authors: string[];
  loading: boolean;
  error: string | null;
  addBook: (input: NewBookInput) => Promise<{ error: string | null }>;
  updateBook: (id: string, patch: UpdateBookInput) => Promise<{ error: string | null }>;
  deleteBook: (id: string) => Promise<{ error: string | null }>;
  isUserBook: (id: string) => boolean;
  canDelete: (id: string, userId: string | null) => boolean;
  refresh: () => Promise<void>;
}

const BooksContext = createContext<BooksContextValue | null>(null);

const STORAGE_KEY = 'bv-books';

function loadLocalBooks(): BookRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookRow[]) : [];
  } catch {
    return [];
  }
}

function saveLocalBooks(books: BookRow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const rows = loadLocalBooks();
    setUserBooks(rows.map(rowToBook));
    setError(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const addBook = useCallback(
    async (input: NewBookInput): Promise<{ error: string | null }> => {
      const rows = loadLocalBooks();
      const now = new Date().toISOString();
      const newRow: BookRow = {
        id: Math.random().toString(36).slice(2),
        title: input.title,
        author: input.author,
        cover: input.cover || null,
        price: input.price,
        original_price: input.originalPrice ?? null,
        rating: 0,
        review_count: 0,
        genre: input.genre,
        tags: input.tags,
        description: input.description,
        publisher: input.publisher || 'Self-published',
        pages: input.pages || 300,
        availability: input.availability || 'in-stock',
        published_year: Number(new Date().getFullYear()),
        language: 'English',
        release_date: now,
        user_id: 'local',
        created_at: now,
      };
      rows.unshift(newRow);
      saveLocalBooks(rows);
      await refresh();
      return { error: null };
    },
    [refresh]
  );

  const updateBook = useCallback(
    async (id: string, patch: UpdateBookInput): Promise<{ error: string | null }> => {
      const rows = loadLocalBooks();
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return { error: 'Book not found' };
      const updated = { ...rows[idx], ...patch };
      rows[idx] = updated;
      saveLocalBooks(rows);
      await refresh();
      return { error: null };
    },
    [refresh]
  );

  const deleteBook = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const rows = loadLocalBooks().filter((r) => r.id !== id);
      saveLocalBooks(rows);
      setUserBooks((prev) => prev.filter((b) => b.id !== id));
      return { error: null };
    },
    []
  );

  const isUserBook = useCallback((id: string) => userBooks.some((b) => b.id === id), [userBooks]);

  const canDelete = useCallback(
    (id: string, _userId: string | null) => userBooks.some((b) => b.id === id),
    [userBooks]
  );

  const allBooks = useMemo(() => [...userBooks, ...seedBooks], [userBooks]);

  const allGenres = useMemo(
    () => Array.from(new Set([...allBooks.map((b) => b.genre), ...seedGenres])).sort(),
    [allBooks]
  );
  const allAuthors = useMemo(
    () => Array.from(new Set([...allBooks.map((b) => b.author), ...seedAuthors])).sort(),
    [allBooks]
  );

  const value: BooksContextValue = {
    books: allBooks,
    genres: allGenres,
    authors: allAuthors,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    isUserBook,
    canDelete,
    refresh,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooks must be used within BooksProvider');
  return ctx;
}
