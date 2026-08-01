import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check, ChevronLeft, FileText, Heart, MessageSquare, Package, Share2,
  ShoppingCart, Star, CreditCard,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useBooks } from '../context/BooksContext';
import StarRating from '../components/StarRating';
import SectionHeader from '../components/SectionHeader';
import BookRow from '../components/BookRow';
import { EditableImage, EditableText } from '../components/Editable';
import { classNames, formatDate, formatPrice, relativeTime } from '../utils/format';

type Tab = 'description' | 'reviews' | 'info';

export default function BookDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { books } = useBooks();
  const book = books.find((b) => b.id === id);
  const { addToCart, toggleWishlist, inWishlist, notify, setStatus, reading, currency } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('description');
  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');

  const buyNow = () => {
    if (!book) return;
    addToCart(book.id);
    navigate('/checkout');
  };
  const [localReviews, setLocalReviews] = useState(book?.reviews || []);

  const similar = useMemo(
    () => (book?.similar || []).map((sid) => books.find((b) => b.id === sid)!).filter(Boolean),
    [book]
  );

  if (!book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Book not found</h1>
        <Link to="/explore" className="mt-4 inline-block text-brand-600 hover:underline">Back to explore</Link>
      </div>
    );
  }

  const stat = reading[book.id];
  const discount = book.originalPrice ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  const ratingStats = [5, 4, 3, 2, 1].map((star) => {
    const count = localReviews.filter((r) => r.rating === star).length;
    const pct = localReviews.length ? (count / localReviews.length) * 100 : 0;
    return { star, count, pct };
  });

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const r = {
      id: Math.random().toString(36).slice(2),
      user: reviewName || 'Anonymous Reader',
      avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(reviewName || 'anon')}`,
      rating: newRating,
      date: new Date().toISOString(),
      comment: reviewText,
      likes: 0,
    };
    setLocalReviews([r, ...localReviews]);
    setReviewText('');
    setReviewName('');
    notify('Review submitted! Thanks for sharing.');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'description', label: 'Description', icon: <FileText size={15} /> },
    { key: 'reviews', label: `Reviews (${localReviews.length})`, icon: <MessageSquare size={15} /> },
    { key: 'info', label: 'Book Info', icon: <Package size={15} /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-1 text-sm text-ink-500/70 dark:text-ink-100/60 hover:text-brand-600 mb-5">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-[420px_1fr] gap-8">
        <div className="lg:sticky lg:top-20 h-fit">
          <motion.div initial={{ opacity: 0, rotateY: -15 }} animate={{ opacity: 1, rotateY: 0 }} className="relative">
            <EditableImage
              k={`book.${book.id}.cover`}
              fallback={book.cover}
              alt={book.title}
              className="relative w-full aspect-2/3 rounded-2xl overflow-hidden"
              imgClassName="book-cover w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">Save {discount}%</span>
            )}
          </motion.div>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {['reading', 'want', 'completed', null].map((s, i) => {
              const labels = ['Reading', 'Want', 'Done', 'Remove'];
              const activeIcon = stat?.status === s && s !== null;
              return (
                <button
                  key={i}
                  onClick={() => setStatus(book.id, s as any)}
                  className={classNames(
                    'rounded-xl py-2 text-[11px] font-medium border transition-colors',
                    activeIcon ? 'bg-brand-500 text-white border-brand-500' : 'border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                >
                  {labels[i]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-3 py-1 text-xs font-semibold">{book.genre}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${book.availability === 'in-stock' ? 'text-emerald-600' : 'text-amber-600'}`}>
              <Check size={13} /> {book.availability === 'in-stock' ? 'In stock' : book.availability === 'limited' ? 'Limited stock' : 'Pre-order'}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">{book.title}</h1>
          <p className="text-ink-500/80 dark:text-ink-100/70 mt-1">by <Link to={`/search?q=${encodeURIComponent(book.author)}`} className="text-brand-600 dark:text-brand-400 hover:underline">{book.author}</Link></p>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={book.rating} count={book.reviewCount} size={18} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(book.price, currency)}</span>
            {book.originalPrice && <span className="text-ink-500/60 line-through">{formatPrice(book.originalPrice, currency)}</span>}
            {discount > 0 && <span className="text-emerald-600 font-semibold text-sm">You save {discount}%</span>}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={buyNow} className="inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold shadow-lg shadow-brand-500/30">
              <CreditCard size={18} /> Buy Now
            </button>
            <button onClick={() => addToCart(book.id)} className="inline-flex items-center gap-2 rounded-full bg-ink-900 hover:bg-ink-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white px-6 py-3 font-semibold shadow-lg shadow-brand-500/30">
              <ShoppingCart size={18} /> Add to cart
            </button>
            <button
              onClick={() => toggleWishlist(book.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-3 font-semibold border ${inWishlist(book.id) ? 'bg-brand-500 text-white border-brand-500' : 'border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <Heart size={18} className={inWishlist(book.id) ? 'fill-current' : ''} /> {inWishlist(book.id) ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: book.title, url: location.href }).catch(() => {});
                else { navigator.clipboard.writeText(location.href); notify('Link copied to clipboard'); }
              }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-semibold border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Share2 size={18} /> Share
            </button>
          </div>

          <EditableText
            k={`book.${book.id}.description`}
            fallback={book.description}
            as="p"
            multiline
            className="mt-6 text-sm text-ink-500/90 dark:text-ink-100/80 leading-relaxed line-clamp-3"
          />

          <div className="mt-6 border-b border-black/5 dark:border-white/10 flex">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 py-3 text-sm font-medium flex items-center gap-1.5 ${tab === t.key ? 'text-brand-600 dark:text-brand-400' : 'text-ink-500/70 dark:text-ink-100/60 hover:text-brand-600'}`}
              >
                {t.icon} {t.label}
                {tab === t.key && (
                  <motion.span layoutId="tabline" className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-500" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <EditableText
                  k={`book.${book.id}.fullDescription`}
                  fallback={book.description}
                  as="p"
                  multiline
                  className="text-sm leading-relaxed"
                />
                <h4 className="font-semibold mt-6 mb-3">Table of Contents</h4>
                <ol className="space-y-1.5 text-sm text-ink-500/80 dark:text-ink-100/70 list-decimal ml-5">
                  {book.chapters.map((c) => <li key={c}>{c}</li>)}
                </ol>
              </motion.div>
            )}
            {tab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl glass p-5 text-center">
                    <p className="font-display text-4xl font-bold text-brand-600">{book.rating.toFixed(1)}</p>
                    <StarRating rating={book.rating} className="justify-center my-2" />
                    <p className="text-xs text-ink-500/70">{book.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  <div className="space-y-1.5">
                    {ratingStats.map((s) => (
                      <div key={s.star} className="flex items-center gap-2 text-xs">
                        <span className="w-6 flex items-center gap-0.5"><Star size={10} className="fill-brand-400 text-brand-400" /> {s.star}</span>
                        <div className="flex-1 progress-track h-2">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }} className="h-full bg-brand-500 rounded-full" />
                        </div>
                        <span className="w-10 text-right text-ink-500/70">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={submitReview} className="rounded-2xl glass p-5 space-y-3">
                  <h4 className="font-semibold">Write a review</h4>
                  <StarRating rating={newRating} onChange={setNewRating} />
                  <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name (optional)" className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2 text-sm outline-none" />
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your thoughts…" rows={3} className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2 text-sm outline-none" />
                  <button type="submit" className="rounded-full bg-brand-500 text-white px-4 py-2 text-sm font-semibold">Submit review</button>
                </form>

                <div className="space-y-4">
                  {localReviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-black/5 dark:border-white/10 p-4">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} alt={r.user} className="h-9 w-9 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{r.user}</p>
                          <p className="text-[11px] text-ink-500/60">{relativeTime(r.date)}</p>
                        </div>
                        <StarRating rating={r.rating} size={13} />
                      </div>
                      <p className="mt-3 text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {tab === 'info' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  ['Publisher', book.publisher],
                  ['Published', String(book.publishedYear)],
                  ['Released', formatDate(book.releaseDate)],
                  ['Pages', String(book.pages)],
                  ['Language', book.language],
                  ['ISBN', book.isbn],
                  ['Genre', book.genre],
                  ['Tags', book.tags.join(', ')],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-black/5 dark:border-white/10 py-2">
                    <span className="text-ink-500/70 dark:text-ink-100/60">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <SectionHeader title="You might also like" icon={<Heart size={20} className="text-brand-500" />} />
          <BookRow books={similar} />
        </section>
      )}
    </div>
  );
}
