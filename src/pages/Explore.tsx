import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Star, X } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/Skeleton';
import { classNames } from '../utils/format';

type SortKey = 'newest' | 'bestselling' | 'rating' | 'priceLow' | 'priceHigh';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'bestselling', label: 'Bestselling' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'priceLow', label: 'Price: Low to High' },
  { key: 'priceHigh', label: 'Price: High to Low' },
];

const PER_PAGE = 20;

export default function Explore() {
  const { books, genres, authors } = useBooks();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedGenres = params.getAll('genre');
  const selectedAuthors = params.getAll('author');
  const sortKey = (params.get('sort') as SortKey) || 'newest';
  const minRating = Number(params.get('rating') || 0);
  const priceMin = Number(params.get('min') || 0);
  const priceMax = Number(params.get('max') || 100);
  const q = params.get('q') || '';

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [sortKey, selectedGenres.join(','), selectedAuthors.join(','), minRating, priceMin, priceMax, q]);

  const filtered = useMemo(() => {
    let list = [...books];
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter((b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower) ||
        b.tags.some((t) => t.includes(lower))
      );
    }
    if (selectedGenres.length) list = list.filter((b) => selectedGenres.includes(b.genre));
    if (selectedAuthors.length) list = list.filter((b) => selectedAuthors.includes(b.author));
    if (minRating) list = list.filter((b) => b.rating >= minRating);
    list = list.filter((b) => b.price >= priceMin && b.price <= priceMax);

    switch (sortKey) {
      case 'newest':
        list.sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate));
        break;
      case 'bestselling':
        list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceLow':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price);
        break;
    }
    return list;
  }, [q, selectedGenres, selectedAuthors, minRating, priceMin, priceMax, sortKey]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const list = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const setParam = (key: string, value: string | null, multi = false) => {
    const next = new URLSearchParams(params);
    if (multi) {
      const all = next.getAll(key);
      if (value && all.includes(value)) {
        next.delete(key);
        all.filter((v) => v !== value).forEach((v) => next.append(key, v));
      } else if (value) {
        next.append(key, value);
      } else {
        next.delete(key);
      }
    } else if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  const Filters = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Genres</h3>
        <div className="flex flex-wrap gap-1.5">
          {genres.map((g) => {
            const active = selectedGenres.includes(g);
            return (
              <button
                key={g}
                onClick={() => setParam('genre', g, true)}
                className={classNames(
                  'rounded-full px-3 py-1 text-xs transition-colors',
                  active ? 'bg-brand-500 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-brand-100 dark:hover:bg-brand-500/20'
                )}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Rating</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setParam('rating', r === 0 ? null : String(r))}
              className={classNames(
                'rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 transition-colors',
                minRating === r ? 'bg-brand-500 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-brand-100'
              )}
            >
              <Star size={12} className="fill-current" /> {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={priceMax}
            value={priceMin}
            onChange={(e) => setParam('min', e.target.value || null)}
            className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="Min"
          />
          <span>—</span>
          <input
            type="number"
            min={priceMin}
            max={100}
            value={priceMax}
            onChange={(e) => setParam('max', e.target.value || null)}
            className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="Max"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Authors</h3>
        <select
          multiple
          value={selectedAuthors}
          onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
            const next = new URLSearchParams(params);
            next.delete('author');
            opts.forEach((o) => next.append('author', o));
            setParams(next);
          }}
          className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-2 py-2 text-sm h-32 outline-none"
        >
          {authors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <p className="text-[11px] text-ink-500/60 mt-1">Cmd/Ctrl-click to select multiple</p>
      </div>
      <button onClick={clearAll} className="w-full rounded-lg border border-black/10 dark:border-white/15 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Explore Books</h1>
          <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">{filtered.length} books found</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/10 px-4 py-2 text-sm"
          >
            <Filter size={15} /> Filters
          </button>
          <div className="relative inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/10 px-3 py-2 text-sm">
            <SlidersHorizontal size={15} />
            <select
              value={sortKey}
              onChange={(e) => setParam('sort', e.target.value)}
              className="bg-transparent outline-none cursor-pointer pr-1"
            >
              {SORTS.map((s) => <option key={s.key} value={s.key} className="bg-white dark:bg-ink-900">{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block sticky top-20 h-fit rounded-2xl glass p-5">{Filters}</aside>
        <div>
          {loading ? (
            <BookGridSkeleton count={12} />
          ) : list.length === 0 ? (
            <div className="rounded-2xl glass p-10 text-center">
              <p className="font-display text-xl font-semibold">No books match your filters</p>
              <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">Try clearing some filters and search again.</p>
              <button onClick={clearAll} className="mt-4 rounded-full bg-brand-500 text-white px-5 py-2 text-sm font-semibold">Clear filters</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {list.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
            </motion.div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={classNames(
                      'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                      p === page ? 'bg-brand-500 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-brand-100'
                    )}
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 7 && (
                <>
                  <span className="px-1">…</span>
                  <button onClick={() => { setPage(totalPages); window.scrollTo({ top: 0 }); }} className="h-9 w-9 rounded-lg bg-black/5 dark:bg-white/10 text-sm">{totalPages}</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-80 max-w-[88vw] bg-white dark:bg-ink-950 p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold">Filters</h3>
              <button onClick={() => setDrawerOpen(false)}><X /></button>
            </div>
            {Filters}
          </motion.div>
        </div>
      )}
    </div>
  );
}
