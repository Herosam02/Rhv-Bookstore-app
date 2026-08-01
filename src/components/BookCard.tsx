import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, Heart, PackageOpen, ShoppingCart, Star, Trash2, CreditCard } from 'lucide-react';
import type { Book } from '../types';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import { useBooks } from '../context/BooksContext';
import { classNames, formatPrice } from '../utils/format';

interface Props {
  book: Book;
  index?: number;
}

const availabilityLabel: Record<Book['availability'], string> = {
  'in-stock': 'In Stock',
  limited: 'Limited Stock',
  preorder: 'Pre-order',
};

export default function BookCard({ book, index = 0 }: Props) {
  const { addToCart, toggleWishlist, inWishlist, notify, dark, currency } = useStore();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const { canDelete, deleteBook } = useBooks();
  const wished = inWishlist(book.id);
  const deletable = canDelete(book.id, user?.email ?? null);

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  const buyNow = () => {
    addToCart(book.id);
    navigate('/checkout');
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${book.title}" from the catalog?`)) return;
    const { error } = await deleteBook(book.id);
    if (error) notify(error, 'error');
    else notify(`Deleted "${book.title}"`, 'info');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -6 }}
      className={classNames(
        'group relative flex flex-col w-36 sm:w-40 md:w-44 lg:w-48 rounded-2xl overflow-hidden bg-white/70 dark:bg-ink-900/50 backdrop-blur-sm transition-shadow hover:shadow-2xl hover:shadow-black/10',
        dark ? 'border-neon-purple/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border border-black/5 dark:border-white/5'
      )}
    >
      <Link to={`/book/${book.id}`} className="relative block">
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-ink-100/30">
          <img
            src={book.cover}
            alt={book.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                -{discount}%
              </span>
            )}
            {book.bestseller && (
              <span className="rounded-full bg-ink-900/85 dark:bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                Bestseller
              </span>
            )}
            {book.isNewArrival && (
              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                New
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(book.id);
            }}
            aria-label="Toggle wishlist"
            className={classNames(
              'absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all',
              wished
                ? 'bg-brand-500/90 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
            )}
          >
            <Heart size={16} className={wished ? 'fill-current' : ''} />
          </button>
          {deletable && (
            <button
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              aria-label="Delete book"
              className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-rose-500/90 text-white hover:bg-rose-600 backdrop-blur transition-all"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 px-2 py-0.5 font-medium">
            {book.genre}
          </span>
          <span
            className={classNames(
              'inline-flex items-center gap-1 font-medium',
              book.availability === 'in-stock'
                ? 'text-emerald-600 dark:text-emerald-400'
                : book.availability === 'limited'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-accent-600 dark:text-accent-400'
            )}
          >
            {book.availability === 'in-stock' ? <Check size={12} /> : book.availability === 'limited' ? <Clock size={12} /> : <PackageOpen size={12} />}
            {availabilityLabel[book.availability]}
          </span>
        </div>

        <Link to={`/book/${book.id}`} className="line-clamp-2 font-display text-base font-semibold leading-snug hover:text-brand-600 dark:hover:text-brand-400">
          {book.title}
        </Link>
        <p className="text-xs text-ink-500/80 dark:text-ink-100/60">by {book.author}</p>

        <div className="flex items-center gap-1 text-xs">
          <Star size={13} className="fill-brand-400 text-brand-400" />
          <span className="font-medium">{book.rating.toFixed(1)}</span>
          <span className="text-ink-500/60 dark:text-ink-100/40">({book.reviewCount.toLocaleString()})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold">{formatPrice(book.price, currency)}</span>
            {book.originalPrice && (
              <span className="text-xs text-ink-500/60 line-through">{formatPrice(book.originalPrice, currency)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={buyNow}
              className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors neon-glow"
              aria-label={`Buy ${book.title} now`}
            >
              <CreditCard size={16} />
            </button>
            <button
              onClick={() => addToCart(book.id)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-ink-900 text-white dark:bg-brand-500 hover:bg-brand-500 dark:hover:bg-brand-400 transition-colors neon-glow"
              aria-label={`Add ${book.title} to cart`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
