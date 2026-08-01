import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Github, Instagram, Twitter, Youtube } from 'lucide-react';
import { genres as seedGenres } from '../data/books';
import { useBooks } from '../context/BooksContext';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { notify } = useStore();
  const { genres } = useBooks();
  const list = genres.length ? genres : seedGenres;
  return (
    <footer className="mt-24 border-t border-black/5 dark:border-white/10 bg-white/60 dark:bg-ink-950/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <BookOpen size={18} />
              </div>
              <span className="font-display text-xl font-bold">
                Book<span className="gradient-text">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-ink-500/70 dark:text-ink-100/60 max-w-xs">
              Your next great read is one click away. Discover, track, and fall in love with books — all in one beautifully designed place.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Browse</h4>
            <ul className="space-y-2 text-sm text-ink-500/80 dark:text-ink-100/70">
              <li><Link to="/explore" className="hover:text-brand-600">Explore Books</Link></li>
              <li><Link to="/categories" className="hover:text-brand-600">All Categories</Link></li>
              <li><Link to="/tracker" className="hover:text-brand-600">Reading Tracker</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-600">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Genres</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-ink-500/80 dark:text-ink-100/70">
              {list.slice(0, 8).map((g) => (
                <li key={g}><Link to={`/explore?genre=${encodeURIComponent(g)}`} className="hover:text-brand-600">{g}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-ink-500/80 dark:text-ink-100/70">
              <li><Link to="/about" className="hover:text-brand-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-brand-600">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-black/5 dark:border-white/10 pt-6">
          <p className="text-xs text-ink-500/60 dark:text-ink-100/50">
            © {new Date().getFullYear()} BookVerse. Crafted for readers everywhere.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Instagram, Facebook, Youtube, Github].map((Icon, i) => (
              <button
                key={i}
                onClick={() => notify('Social link is a demo placeholder', 'info')}
                className="grid h-8 w-8 place-items-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-brand-500 hover:text-white transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
