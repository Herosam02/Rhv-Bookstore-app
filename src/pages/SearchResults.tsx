import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchX, X } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import { searchBooks, popularSearches } from '../services/search';
import { useStore } from '../context/StoreContext';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/Skeleton';
import { relativeTime } from '../utils/format';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { books } = useBooks();
  const { recentSearches, addRecentSearch } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) addRecentSearch(q);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => searchBooks(q, books), [q, books]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {q ? (
        <>
          <h1 className="font-display text-3xl font-bold">
            {results.length > 0 ? `Results for “${q}”` : `No results for “${q}”`}
          </h1>
          <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">{results.length} books found</p>

          {loading ? (
            <div className="mt-6"><BookGridSkeleton count={8} /></div>
          ) : results.length === 0 ? (
            <div className="mt-10 rounded-2xl glass p-10 text-center">
              <SearchX className="mx-auto text-ink-400" size={42} />
              <p className="font-display text-xl font-semibold mt-3">Nothing matched your search</p>
              <p className="text-sm text-ink-500/70 mt-1">Try a different keyword, or browse popular searches below.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {popularSearches.map((p) => (
                  <button key={p} onClick={() => setParams(`?q=${encodeURIComponent(p)}`)} className="rounded-full bg-black/5 dark:bg-white/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 px-3 py-1.5 text-xs">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div layout className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {results.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
            </motion.div>
          )}
        </>
      ) : (
        <>
          <h1 className="font-display text-3xl font-bold">Search</h1>
          <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">Find your next read across {books.length} titles.</p>

          {recentSearches.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-3">Recent searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((r) => (
                  <Link key={r.q + r.at} to={`/search?q=${encodeURIComponent(r.q)}`} className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1.5 text-xs hover:bg-brand-100 dark:hover:bg-brand-500/20">
                    <X size={12} className="opacity-50" /> {r.q}
                    <span className="opacity-50">{relativeTime(new Date(r.at).toISOString())}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-semibold text-sm mb-3">Popular searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((p) => (
                <Link key={p} to={`/search?q=${encodeURIComponent(p)}`} className="rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-4 py-2 text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-500/20">
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
