import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Flame, Sparkles, Star, TrendingUp } from 'lucide-react';
import { collections, quotes, testimonials } from '../data/books';
import { useStore } from '../context/StoreContext';
import { useBooks } from '../context/BooksContext';
import { useAdmin } from '../context/AdminContext';
import BookCard from '../components/BookCard';
import BookRow from '../components/BookRow';
import SectionHeader from '../components/SectionHeader';
import AnimatedCounter from '../components/AnimatedCounter';
import StarRating from '../components/StarRating';
import { EditableImage, EditableText } from '../components/Editable';
import { formatPrice } from '../utils/format';

function Countdown() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, end.getTime() - now);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2 text-sm font-mono font-semibold">
      {[pad(h), pad(m), pad(s)].map((v, i) => (
        <span key={i} className="grid place-items-center">
          <span className="rounded-lg bg-black/20 dark:bg-white/15 backdrop-blur px-2.5 py-1.5 text-white">{v}</span>
          {i < 2 && <span className="px-0.5 text-white/60">:</span>}
        </span>
      ))}
    </div>
  );
}

function Hero() {
  const { books } = useBooks();
  const { currency } = useAdmin();
  const heroBooks = useMemo(() => books.filter((b) => b.bestseller).slice(0, 5), [books]);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!heroBooks.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % heroBooks.length), 5500);
    return () => clearInterval(t);
  }, [heroBooks.length]);
  const book = heroBooks[idx] || books[0];
  const { addToCart } = useStore();
  if (!book) return null;
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="glow-blob top-0 left-10 w-72 h-72 bg-brand-400" />
        <div className="glow-blob top-20 right-10 w-80 h-80 bg-accent-400" />
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-3 py-1 text-xs font-semibold"
            >
              <Sparkles size={13} /> Next-Generation Bookstore
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]"
            >
              <EditableText k="hero.title" fallback="Stories that move you, worlds that stay with you." as="span" className="block" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-lg text-ink-500/90 dark:text-ink-100/70 max-w-md"
            >
              <EditableText
                k="hero.subtitle"
                fallback={`Explore ${books.length.toLocaleString()}+ curated titles, track your reading, and discover your next favorite book with our AI assistant.`}
                as="span"
                className="block"
              />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-7 flex items-center gap-3"
            >
              <Link to="/explore" className="inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 font-semibold shadow-lg shadow-brand-500/40 neon-glow">
                <BookOpen size={18} /> Start exploring
              </Link>
              <Link to="/tracker" className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 font-semibold hover:scale-[1.02] transition-transform">
                Reading tracker <ArrowRight size={16} />
              </Link>
            </motion.div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Titles', value: books.length, suffix: '+' },
                { label: 'Genres', value: 13, suffix: '' },
                { label: 'Avg rating', value: 4.5, suffix: '', decimals: 1 },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">
                    <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                  </p>
                  <p className="text-xs text-ink-500/70 dark:text-ink-100/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={book.id}
                initial={{ opacity: 0, rotateY: 20, x: 60 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -20, x: -60 }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto max-w-sm"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/30 to-accent-500/30 blur-2xl rounded-full" />
                  <EditableImage
                    k={`hero.cover.${book.id}`}
                    fallback={book.cover}
                    alt={book.title}
                    className="relative w-full aspect-2/3 rounded-xl overflow-hidden"
                    imgClassName="book-cover relative w-full h-full object-cover"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-4 -left-4 right-4 glass-strong rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">Featured</span>
                      <StarRating rating={book.rating} size={14} count={book.reviewCount} />
                    </div>
                    <h3 className="font-display text-lg font-bold leading-tight">{book.title}</h3>
                    <p className="text-xs text-ink-500/70 dark:text-ink-100/60 mb-2">{book.author}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-lg font-bold">{formatPrice(book.price, currency)}</span>
                      <button onClick={() => addToCart(book.id)} className="rounded-full bg-ink-900 dark:bg-brand-500 text-white px-4 py-1.5 text-sm font-semibold hover:bg-brand-500 dark:hover:bg-brand-400">
                        Add to cart
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-1.5 mt-12">
              {heroBooks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-brand-500' : 'w-1.5 bg-ink-300/50 dark:bg-white/20'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, []);
  const q = quotes[idx];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink-900 to-brand-800 dark:from-ink-950 dark:to-ink-900 text-white p-10 text-center">
        <div className="glow-blob top-0 right-0 w-60 h-60 bg-brand-400" />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="relative mx-auto max-w-3xl"
          >
            <p className="font-display text-xl sm:text-3xl italic leading-relaxed">“{q.text}”</p>
            <footer className="mt-4 text-sm uppercase tracking-widest text-brand-300">— {q.author}</footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  );
}

function BookOfTheDay() {
  const { books } = useBooks();
  const day = Math.floor(Date.now() / 86400000);
  const book = books[day % books.length] || books[0];
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const { currency } = useAdmin();
  if (!book) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
      <SectionHeader title="Book of the Day" icon={<Star size={22} className="text-brand-500" />} />
      <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8 rounded-3xl glass">
        <div className="relative">
          <EditableImage
            k={`botd.cover.${book.id}`}
            fallback={book.cover}
            alt={book.title}
            className="relative w-full aspect-2/3 rounded-xl overflow-hidden"
            imgClassName="book-cover w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent-500/15 text-accent-600 dark:text-accent-400 px-3 py-1 text-xs font-semibold">
            <Flame size={13} /> Picked for {new Date().toLocaleDateString(undefined, { weekday: 'long' })}
          </span>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold">{book.title}</h3>
          <p className="text-ink-500/70 dark:text-ink-100/60">by {book.author}</p>
          <StarRating rating={book.rating} count={book.reviewCount} className="mt-2" />
          <EditableText
            k={`botd.description.${book.id}`}
            fallback={book.description}
            as="p"
            multiline
            className="mt-4 text-sm text-ink-500/80 dark:text-ink-100/70 leading-relaxed"
          />
          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-bold">{formatPrice(book.price, currency)}</span>
            {book.originalPrice && <span className="text-sm line-through text-ink-500/60">{formatPrice(book.originalPrice, currency)}</span>}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => addToCart(book.id)} className="rounded-full bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold">
              Add to cart
            </button>
            <button
              onClick={() => toggleWishlist(book.id)}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold ${inWishlist(book.id) ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/10 dark:border-white/15'}`}
            >
              {inWishlist(book.id) ? 'In wishlist' : 'Add to wishlist'}
            </button>
            <div className="ml-auto flex items-center gap-1 text-sm">
              <span className="hidden sm:inline text-ink-500/70 dark:text-ink-100/60">Today's deal ends in</span>
              <Countdown />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
      <SectionHeader title="Curated Collections" icon={<BookOpen size={22} className="text-brand-500" />} subtitle="Themed reading lists handpicked by our editors." />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {collections.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/explore?genre=${encodeURIComponent(c.genre)}`} className="group relative block aspect-3/4 rounded-2xl overflow-hidden">
              <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
              <div className="absolute bottom-0 p-3 text-white">
                <p className="font-display font-semibold text-sm leading-tight">{c.name}</p>
                <p className="text-[10px] opacity-80">{c.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
      <SectionHeader title="Loved by readers" icon={<TrendingUp size={22} className="text-brand-500" />} />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl glass p-6"
          >
            <StarRating rating={t.rating} />
            <p className="mt-3 text-sm leading-relaxed">“{t.text}”</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-ink-500/70 dark:text-ink-100/60">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const { notify } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-10 text-center">
        <div className="glow-blob bottom-0 left-1/4 w-60 h-60 bg-accent-400" />
        <h2 className="relative font-display text-2xl sm:text-3xl font-bold">Join the BookVerse newsletter</h2>
        <p className="relative mt-2 text-white/85 max-w-md mx-auto text-sm">
          Get weekly book picks, deals, and literary discoveries in your inbox.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            notify("You're subscribed! Welcome aboard.");
            (e.target as HTMLFormElement).reset();
          }}
          className="relative mt-6 flex flex-col sm:flex-row max-w-md mx-auto gap-2"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="rounded-full px-5 py-3 text-sm text-ink-900 outline-none bg-white/95"
          />
          <button type="submit" className="rounded-full bg-ink-900 hover:bg-ink-950 px-6 py-3 text-sm font-semibold text-white">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  const { books } = useBooks();
  const featured = useMemo(() => books.filter((b) => b.rating >= 4.6).slice(0, 10), [books]);
  const newA = useMemo(() => books.filter((b) => b.isNewArrival).slice(0, 10), [books]);
  const editors = useMemo(() => books.filter((b) => b.editorsPick).slice(0, 10), [books]);
  const trending = useMemo(() => books.filter((b) => b.trending).slice(0, 10), [books]);
  const bestsellers = useMemo(() => books.filter((b) => b.bestseller).slice(0, 10), [books]);

  return (
    <div>
      <Hero />
      <QuoteBanner />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
        <SectionHeader title="Bestsellers" to="/explore?sort=bestselling" icon={<Flame size={22} className="text-brand-500" />} />
        <BookRow books={bestsellers} />
      </section>
      <BookOfTheDay />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
        <SectionHeader title="New Arrivals" to="/explore?sort=newest" icon={<Sparkles size={22} className="text-brand-500" />} />
        <BookRow books={newA} />
      </section>
      <Collections />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
        <SectionHeader title="Editor's Picks" to="/explore" icon={<Star size={22} className="text-brand-500" />} />
        <BookRow books={editors} />
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
        <SectionHeader title="Trending Now" to="/explore?sort=trending" icon={<TrendingUp size={22} className="text-brand-500" />} />
        <BookRow books={trending} />
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
        <SectionHeader title="Featured" to="/explore" icon={<BookOpen size={22} className="text-brand-500" />} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {featured.slice(0, 10).map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
        </div>
      </section>
      <Testimonials />
      <Newsletter />
    </div>
  );
}
