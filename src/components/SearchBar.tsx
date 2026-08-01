import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Search as SearchIcon, TrendingUp, X } from 'lucide-react';
import { popularSearches, suggest } from '../services/search';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import { formatPrice, relativeTime } from '../utils/format';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useStore();
  const { currency } = useAdmin();

  const results = useMemo(() => suggest(q, 6), [q]);

  const submit = (value: string) => {
    const v = value.trim();
    if (!v) return;
    addRecentSearch(v);
    setOpen(false);
    nav(`/search?q=${encodeURIComponent(v)}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) setActive(-1);
  }, [open]);

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="relative"
      >
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50 dark:text-ink-100/40" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            } else if (e.key === 'Enter' && active >= 0 && results[active]) {
              e.preventDefault();
              submit(results[active].book.title);
            }
          }}
          placeholder="Search by title, author, genre…"
          className="w-full rounded-full bg-black/5 dark:bg-white/10 border border-transparent focus:bg-white dark:focus:bg-ink-900/70 focus:border-brand-300 focus:ring-2 focus:ring-brand-400/40 pl-9 pr-9 py-2 text-sm outline-none transition-all"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500/50 hover:text-ink-900 dark:hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && (q || recentSearches.length || popularSearches.length) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl glass-strong shadow-2xl border border-black/5 dark:border-white/10 p-2 z-50 max-h-[70vh] overflow-y-auto no-scrollbar"
          >
            {q && results.length > 0 && (
              <div className="space-y-0.5">
                <p className="px-3 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500/60 dark:text-ink-100/50">
                  Suggestions
                </p>
                {results.map((r, i) => (
                  <Link
                    key={r.book.id + r.field}
                    to={`/book/${r.book.id}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      setOpen(false);
                      setQ('');
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      active === i ? 'bg-brand-50 dark:bg-brand-500/15' : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                     <img src={r.book.cover} alt="" className="h-12 w-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {renderHighlight(r.book.title, q)}
                      </p>
                      <p className="text-[11px] text-ink-500/70 dark:text-ink-100/60">
                        {r.field === 'author' ? 'Author: ' : r.field === 'genre' ? 'Genre: ' : ''}
                        {renderHighlight(r.book.author, q)} · {r.book.genre}
                      </p>
                    </div>
                     <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{formatPrice(r.book.price, currency)}</span>
                  </Link>
                ))}
              </div>
            )}

            {q && results.length === 0 && (
              <p className="px-3 py-4 text-sm text-ink-500/70 dark:text-ink-100/60">
                No matches for “{q}”. Try another term.
              </p>
            )}

            {!q && recentSearches.length > 0 && (
              <div className="p-1">
                <div className="flex items-center justify-between px-2 pb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500/60 dark:text-ink-100/50">
                    Recent searches
                  </p>
                  <button onClick={clearRecentSearches} className="text-[11px] text-brand-600 hover:underline">
                    Clear
                  </button>
                </div>
                {recentSearches.map((r) => (
                  <button
                    key={r.q + r.at}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      submit(r.q);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Clock size={13} className="text-ink-500/60" />
                    <span className="flex-1 text-left">{r.q}</span>
                    <span className="text-[10px] text-ink-500/50">{relativeTime(new Date(r.at).toISOString())}</span>
                  </button>
                ))}
              </div>
            )}

            {!q && (
              <div className="p-1">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500/60 dark:text-ink-100/50">
                  Popular
                </p>
                <div className="flex flex-wrap gap-1.5 px-2 py-2">
                  {popularSearches.map((s) => (
                    <button
                      key={s}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        submit(s);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs hover:bg-brand-100 dark:hover:bg-brand-500/20"
                    >
                      <TrendingUp size={11} /> {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function renderHighlight(text: string, query: string) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-brand-200/70 dark:bg-brand-500/30 text-inherit rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
