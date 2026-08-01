import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen, BookCheck, Heart, ShoppingBag, UserCog } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import { useStore } from '../context/StoreContext';

const defaultUser = {
  name: 'Alex Reader',
  email: 'alex@bookverse.demo',
  avatar: 'https://i.pravatar.cc/200?u=bookverse',
  joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 124).toISOString(),
};

export default function Profile() {
  const { books } = useBooks();
  const { reading, wishlist, cart } = useStore();
  const [user] = useState(defaultUser);

  const counts = {
    reading: Object.values(reading).filter((r) => r.status === 'reading').length,
    want: Object.values(reading).filter((r) => r.status === 'want').length,
    completed: Object.values(reading).filter((r) => r.status === 'completed').length,
    wishlist: wishlist.length,
    cart: cart.length,
  };

  const stats = [
    { label: 'Reading', value: counts.reading, icon: <BookOpen />, to: '/tracker' },
    { label: 'Want to Read', value: counts.want, icon: <Bookmark />, to: '/tracker' },
    { label: 'Completed', value: counts.completed, icon: <BookCheck />, to: '/tracker' },
    { label: 'Wishlist', value: counts.wishlist, icon: <Heart />, to: '/wishlist' },
    { label: 'In Cart', value: counts.cart, icon: <ShoppingBag />, to: '/cart' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 text-white p-8">
        <div className="glow-blob bottom-0 right-10 w-60 h-60 bg-accent-400" />
        <div className="relative flex items-center gap-5">
          <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full border-4 border-white/30 object-cover" />
          <div>
            <h1 className="font-display text-3xl font-bold">{user.name}</h1>
            <p className="text-white/80 text-sm">{user.email}</p>
            <p className="text-white/70 text-xs mt-1">Member since {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="ml-auto rounded-full bg-white/15 hover:bg-white/25 p-2" aria-label="Settings">
            <UserCog size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-2xl glass p-4 text-center hover:ring-2 hover:ring-brand-400 transition">
            <div className="mx-auto w-fit text-brand-600">{s.icon}</div>
            <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-ink-500/70 dark:text-ink-100/60">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mt-8 mb-4">Reading highlights</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.values(reading).slice(0, 4).map((r) => {
          const b = books.find((x) => x.id === r.bookId);
          if (!b) return null;
          return (
            <Link key={r.bookId} to={`/book/${r.bookId}`} className="group block max-w-[180px] mx-auto">
              <img src={b.cover} alt={b.title} className="book-cover w-full aspect-[2/3] rounded-xl object-cover" />
              <p className="mt-2 font-semibold text-sm line-clamp-1 group-hover:text-brand-600">{b.title}</p>
              <p className="text-[11px] text-ink-500/70 capitalize">{r.status} · {r.progress || 0}%</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
