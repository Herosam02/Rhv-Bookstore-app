import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Heart, LayoutDashboard, LayoutGrid, LineChart, LogOut, Menu, Moon, Plus, ShoppingCart, Sun, X } from 'lucide-react';
import SearchBar from './SearchBar';
import AddBookModal from './AddBookModal';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import { useBooks } from '../context/BooksContext';
import { genres as seedGenres } from '../data/books';
import { classNames } from '../utils/format';

const NAV = [
  { label: 'Home', to: '/home' },
  { label: 'Explore', to: '/explore' },
  { label: 'Categories', to: '/categories' },
  { label: 'Tracker', to: '/tracker' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const { dark, toggleTheme, cartCount, wishlist } = useStore();
  const { isAdmin, isUser, signOut } = useAdmin();
  const { genres: liveGenres } = useBooks();
  const genres = liveGenres.length ? liveGenres : seedGenres;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        initial={false}
        animate={{
          backgroundColor: dark ? '#0f0a1e' : '#ffffff',
        }}
        className={classNames(
          'border-b transition-all',
          dark
            ? 'border-neon-purple/40 shadow-[0_0_25px_rgba(139,92,246,0.2)]'
            : 'border-black/10 shadow-sm'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <Link to="/home" className="flex items-center gap-2 shrink-0">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
                <BookOpen size={18} />
              </div>
              <span className="hidden sm:block font-display text-xl font-bold">
                Book<span className="gradient-text">Verse</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-2">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-500/15'
                        : 'text-ink-600 dark:text-ink-200 hover:bg-black/5 dark:hover:bg-white/10'
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                  <LayoutGrid size={15} /> More
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full pt-1 w-56 z-50"
                    >
                      <div className="glass-strong rounded-xl shadow-xl border border-black/5 dark:border-white/10 p-2 grid grid-cols-2 gap-1">
                        {[...genres.slice(0, 8).map((g) => `/explore?genre=${encodeURIComponent(g)}`), '/contact', '/faq', '/profile', '/settings'].slice(0, 10).map((href, i) => (
                          <Link
                            key={i}
                            to={href}
                            className="rounded-lg px-2 py-1.5 text-xs hover:bg-brand-50 dark:hover:bg-brand-500/15 hover:text-brand-600 dark:hover:text-brand-300"
                          >
                            {href.startsWith('/explore') ? decodeURIComponent(href.split('genre=')[1]) : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="hidden md:block flex-1 max-w-md mx-auto">
              <SearchBar />
            </div>

            <div className="ml-auto md:ml-2 flex items-center gap-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  aria-label="Admin dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-ink-900 dark:bg-white/10 text-white px-3 h-9 text-sm font-semibold hover:bg-ink-950 dark:hover:bg-white/20"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              {isAdmin && (
                <button
                  onClick={() => setAddBookOpen(true)}
                  aria-label="Add a book"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-500 text-white px-3 h-9 text-sm font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-600"
                >
                  <Plus size={16} /> Add book
                </button>
              )}
              {(isAdmin || isUser) && (
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white px-3 h-9 text-sm font-semibold"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              )}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="relative inline-flex h-9 w-16 items-center rounded-full bg-black/10 dark:bg-brand-500/40 px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:focus:ring-offset-ink-950 border border-black/10 dark:border-brand-400/30"
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={classNames(
                    'inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out',
                    dark ? 'translate-x-8' : 'translate-x-0'
                  )}
                >
                  {dark ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-brand-600" />}
                </span>
              </button>
              <Link
                to="/wishlist"
                className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass-strong border-b border-black/5 dark:border-white/10"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-2 gap-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                  {n.label}
                </Link>
              ))}
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                Wishlist
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                Cart
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                Profile
              </Link>
              <Link to="/settings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                Settings
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                Contact
              </Link>
              <Link to="/faq" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                FAQ
              </Link>
              <Link to="/tracker" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1">
                <LineChart size={14} /> Tracker
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm flex items-center gap-1 bg-ink-900 text-white">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              )}
              {isAdmin && (
                <button onClick={() => { setMobileOpen(false); setAddBookOpen(true); }} className="rounded-lg px-3 py-2 text-sm flex items-center gap-1 bg-brand-500 text-white">
                  <Plus size={14} /> Add book
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <AddBookModal open={addBookOpen} onClose={() => setAddBookOpen(false)} />
    </header>
  );
}
