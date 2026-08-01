import { motion } from 'framer-motion';
import { BookHeart, Globe2, Sparkles, Users } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import AnimatedCounter from '../components/AnimatedCounter';

const VALUES = [
  { icon: <Sparkles />, title: 'Curated, never cluttered', text: 'Every title is selected to spark something — joy, wonder, or thought.' },
  { icon: <Globe2 />, title: 'A world of voices', text: 'Diverse authors across cultures, genres, and ideas.' },
  { icon: <Users />, title: 'Built for readers', text: 'From the casual browser to the committed tracker — we see you.' },
  { icon: <BookHeart />, title: 'Books as experiences', text: 'Beautiful reading tools, recommendations, and rituals.' },
];

export default function About() {
  const { books } = useBooks();
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="glow-blob top-0 left-1/3 w-72 h-72 bg-brand-400" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl sm:text-5xl font-bold">
            We believe a good book changes <span className="gradient-text">everything</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-lg text-ink-500/90 dark:text-ink-100/70 max-w-2xl mx-auto">
            BookVerse is a next-generation bookstore designed for people who love stories. Discover, track, and share your reading life in one beautifully crafted place.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-4 text-center -mt-6 mb-12">
        {[
          { label: 'Titles', value: books.length, suffix: '+' },
          { label: 'Readers', value: 48000, suffix: '+' },
          { label: 'Avg rating', value: 4.5, suffix: '', decimals: 1 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-5">
            <p className="font-display text-3xl font-bold text-brand-600">
              <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
            </p>
            <p className="text-xs text-ink-500/70 dark:text-ink-100/60">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="font-display text-2xl font-bold mb-6 text-center">What we stand for</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl glass p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400">{v.icon}</div>
              <h3 className="mt-3 font-semibold">{v.title}</h3>
              <p className="text-sm text-ink-500/80 dark:text-ink-100/70 mt-1">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
