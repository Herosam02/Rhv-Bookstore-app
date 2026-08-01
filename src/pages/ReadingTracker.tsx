import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, BookCheck, BookOpen, Bookmark, Library, Trophy } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useBooks } from '../context/BooksContext';
import AnimatedCounter from '../components/AnimatedCounter';
import StarRating from '../components/StarRating';
import { formatDate } from '../utils/format';
import type { ReadingStatus } from '../types';

const STATUS_META: Record<NonNullable<ReadingStatus>, { label: string; color: string; icon: React.ReactNode }> = {
  reading: { label: 'Currently Reading', color: 'bg-accent-500', icon: <BookOpen size={16} /> },
  want: { label: 'Want to Read', color: 'bg-brand-500', icon: <Bookmark size={16} /> },
  completed: { label: 'Completed', color: 'bg-emerald-500', icon: <BookCheck size={16} /> },
};

export default function ReadingTracker() {
  const { books } = useBooks();
  const { reading, setProgress, setStatus } = useStore();
  const entries = Object.values(reading).map((r) => ({ ...r, book: books.find((b) => b.id === r.bookId)! })).filter((e) => e.book);

  const counts = useMemo(() => {
    const c: Record<NonNullable<ReadingStatus>, number> = { reading: 0, want: 0, completed: 0 };
    entries.forEach((e) => { if (e.status && e.status !== null) c[e.status]++; });
    return c;
  }, [entries]);

  const totalPages = entries.filter((e) => e.status === 'completed').reduce((s, e) => s + e.book.pages, 0);

  const genreStats = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => map.set(e.book.genre, (map.get(e.book.genre) || 0) + 1));
    const max = Math.max(1, ...Array.from(map.values()));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([g, n]) => ({ g, n, pct: (n / max) * 100 }));
  }, [entries]);

  const monthly = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);
    entries.forEach((e) => {
      if (e.finishedAt) {
        const m = new Date(e.finishedAt).getMonth();
        counts[m]++;
      } else if (e.addedAt) {
        const m = new Date(e.addedAt).getMonth();
        counts[m]++;
      }
    });
    const max = Math.max(1, ...counts);
    return months.map((m, i) => ({ m, n: counts[i], pct: (counts[i] / max) * 100 }));
  }, [entries]);

  const shelves: { status: NonNullable<ReadingStatus>; items: typeof entries }[] = [
    { status: 'reading', items: entries.filter((e) => e.status === 'reading') },
    { status: 'want', items: entries.filter((e) => e.status === 'want') },
    { status: 'completed', items: entries.filter((e) => e.status === 'completed') },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold">Reading Tracker</h1>
      <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">Your literary journey, visualized.</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Reading', value: counts.reading, icon: <BookOpen />, color: 'text-accent-600' },
          { label: 'Want to Read', value: counts.want, icon: <Bookmark />, color: 'text-brand-600' },
          { label: 'Completed', value: counts.completed, icon: <BookCheck />, color: 'text-emerald-600' },
          { label: 'Pages Read', value: totalPages, icon: <Library />, color: 'text-ink-500' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-5">
            <div className={`flex items-center justify-between ${s.color}`}>{s.icon}</div>
            <p className="mt-3 font-display text-3xl font-bold">
              <AnimatedCounter value={s.value} />
            </p>
            <p className="text-xs text-ink-500/70 dark:text-ink-100/60">{s.label}</p>
          </div>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="mt-10 rounded-2xl glass p-10 text-center">
          <Trophy className="mx-auto text-ink-400" size={42} />
          <h3 className="font-display text-xl font-semibold mt-3">No books tracked yet</h3>
          <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">Mark books as Reading, Want to Read, or Completed from any book page.</p>
          <Link to="/explore" className="inline-block mt-4 rounded-full bg-brand-500 text-white px-5 py-2.5 text-sm font-semibold">Find books to read</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl glass p-5">
              <h3 className="font-display text-lg font-bold flex items-center gap-2"><BarChart3 size={18} /> Monthly Activity</h3>
              <div className="mt-5 flex items-end gap-1 h-40">
                {monthly.map((m) => (
                  <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${m.pct * 0.9 + 4}%` }}
                      viewport={{ once: true }}
                      className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400 min-h-1"
                      title={`${m.n} books`}
                    />
                    <span className="text-[9px] text-ink-500/60">{m.m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl glass p-5">
              <h3 className="font-display text-lg font-bold">Top Genres</h3>
              <div className="mt-5 space-y-3">
                {genreStats.map(({ g, n, pct }) => (
                  <div key={g}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{g}</span>
                      <span className="text-ink-500/60">{n} books</span>
                    </div>
                    <div className="progress-track h-2.5">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {shelves.map((shelf) => (
              <section key={shelf.status}>
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg text-white ${STATUS_META[shelf.status].color}`}>{STATUS_META[shelf.status].icon}</span>
                  {STATUS_META[shelf.status].label}
                </h3>
                {shelf.items.length === 0 ? (
                  <p className="text-sm text-ink-500/60">Nothing here yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {shelf.items.map((e) => (
                      <div key={e.bookId} className="flex gap-3 rounded-2xl glass p-3">
                        <Link to={`/book/${e.bookId}`}><img src={e.book.cover} alt={e.book.title} className="h-24 w-16 rounded object-cover" /></Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/book/${e.bookId}`} className="font-display font-semibold text-sm hover:text-brand-600 line-clamp-1">{e.book.title}</Link>
                          <p className="text-[11px] text-ink-500/70 line-clamp-1">by {e.book.author}</p>
                          <StarRating rating={e.book.rating} size={11} />
                          {e.status === 'reading' && (
                            <div className="mt-2">
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={e.progress || 0}
                                onChange={(ev) => setProgress(e.bookId, Number(ev.target.value))}
                                className="w-full accent-brand-500"
                              />
                              <div className="flex justify-between text-[10px] mt-1">
                                <span className="text-ink-500/70">{e.progress || 0}% done</span>
                                <button onClick={() => setStatus(e.bookId, 'completed')} className="text-brand-600 font-medium">Mark read</button>
                              </div>
                            </div>
                          )}
                          {e.status === 'completed' && e.finishedAt && (
                            <p className="text-[10px] text-emerald-600 mt-1">Finished {formatDate(e.finishedAt)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
