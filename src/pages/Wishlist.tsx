import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import { useStore } from '../context/StoreContext';
import BookCard from '../components/BookCard';

export default function Wishlist() {
  const { books } = useBooks();
  const { wishlist, moveWishlistToCart } = useStore();
  const items = wishlist.map((id) => books.find((b) => b.id === id)!).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Heart className="mx-auto text-ink-400" size={56} />
        <h1 className="font-display text-3xl font-bold mt-4">Your wishlist is quiet</h1>
        <p className="text-ink-500/70 dark:text-ink-100/60 mt-2">Tap the heart on any book to save it here.</p>
        <Link to="/explore" className="inline-flex items-center gap-2 mt-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold">
          <ShoppingBag size={16} /> Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
          <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">{items.length} books saved</p>
        </div>
        <button onClick={() => items.forEach((b) => moveWishlistToCart(b.id))} className="rounded-full bg-ink-900 dark:bg-brand-500 text-white px-5 py-2 text-sm font-semibold">
          Move all to cart
        </button>
      </div>
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {items.map((b, i) => (
          <div key={b.id} className="relative">
            <BookCard book={b} index={i} />
            <button
              onClick={() => moveWishlistToCart(b.id)}
              className="absolute bottom-16 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white shadow hover:scale-110 transition"
              aria-label="Move to cart"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
