import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookCopy, BookPlus, CheckCircle2, DollarSign, LayoutDashboard,
  Loader2, LogOut, Pencil, Save, Search, Settings2, ShoppingCart, Trash2, TrendingUp, Upload, ShieldCheck,
} from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import { useAdmin } from '../context/AdminContext';
import { useStore } from '../context/StoreContext';
import type { Book } from '../types';
import AddBookModal from '../components/AddBookModal';
import AdminAuthModal from '../components/AdminAuthModal';
import { classNames, formatPrice } from '../utils/format';

type Tab = 'overview' | 'books' | 'orders' | 'settings';

export default function Admin() {
  const { isAdmin, ready, signOut, currency, setCurrency } = useAdmin();
  const { books, deleteBook } = useBooks();
  const { notify, orders } = useStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (ready && !isAdmin) {
      setShowAuth(true);
    }
  }, [ready, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setShowAuth(false);
    }
  }, [isAdmin]);

  if (!ready || !isAdmin) {
    return (
      <div className="grid place-items-center min-h-[70vh]">
        <div className="text-center">
          {!ready ? (
            <>
              <Loader2 size={40} className="mx-auto animate-spin text-brand-500" />
              <p className="mt-3 text-sm text-ink-500/70 dark:text-ink-100/60">Loading admin panel...</p>
            </>
          ) : (
            <>
              <ShieldCheck size={48} className="mx-auto text-brand-500 mb-4" />
              <h1 className="font-display text-2xl font-bold">Admin Access Required</h1>
              <p className="mt-2 text-sm text-ink-500/70 dark:text-ink-100/60">Please sign in with admin credentials to access this page.</p>
            </>
          )}
        </div>
        <AdminAuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  const onDelete = async (book: Book) => {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    setBusyId(book.id);
    const { error } = await deleteBook(book.id);
    setBusyId(null);
    if (error) notify(error, 'error');
    else notify(`Deleted "${book.title}"`);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
    );
  }, [books, query]);

  const stats = useMemo(() => {
    const totalValue = books.reduce((sum, b) => sum + b.price, 0);
    const inStock = books.filter((b) => b.availability === 'in-stock').length;
    const limited = books.filter((b) => b.availability === 'limited').length;
    const totalRevenue = orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    return { count: books.length, totalValue, inStock, limited, totalRevenue, orderCount: orders.length };
  }, [books, orders]);

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'books', label: 'Books', icon: BookCopy },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-4">
            <div className="flex items-center gap-2 px-2 pb-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <p className="font-display text-sm font-bold leading-tight">Admin Panel</p>
                <p className="text-[11px] text-ink-500/60 dark:text-ink-100/50">BookVerse</p>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={classNames(
                    'w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    tab === item.id
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                      : 'hover:bg-black/5 dark:hover:bg-white/10 text-ink-600 dark:text-ink-100/70'
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2 px-2 pb-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-500/15 text-brand-500">
                  <ShieldCheck size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">Admin</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Admin mode active</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="font-display text-2xl font-bold capitalize">{tab}</h1>
              <p className="text-sm text-ink-500/60 dark:text-ink-100/50">
                {tab === 'overview' && 'Quick stats and recent activity.'}
                {tab === 'books' && 'Add, edit, and delete books in your catalog.'}
                {tab === 'orders' && 'View and manage customer orders.'}
              </p>
            </div>
            {tab === 'books' && (
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-brand-500/30"
              >
                <BookPlus size={16} /> Add book
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={BookCopy} label="Total Books" value={String(stats.count)} color="brand" />
                  <StatCard icon={DollarSign} label="Catalog Value" value={formatPrice(stats.totalValue, currency)} color="emerald" />
                  <StatCard icon={CheckCircle2} label="In Stock" value={String(stats.inStock)} color="blue" />
                  <StatCard icon={TrendingUp} label="Limited" value={String(stats.limited)} color="amber" />
                  <StatCard icon={ShoppingCart} label="Total Orders" value={String(stats.orderCount)} color="brand" />
                  <StatCard icon={DollarSign} label="Revenue" value={formatPrice(stats.totalRevenue, currency)} color="emerald" />
                </div>

                <div className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/10">
                    <h2 className="font-semibold text-sm">Recent books</h2>
                    <button onClick={() => setTab('books')} className="text-xs text-brand-500 font-medium hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-black/5 dark:divide-white/10">
                    {books.slice(0, 5).map((book) => (
                      <div key={book.id} className="flex items-center gap-3 px-4 py-3">
                        <img src={book.cover} alt={book.title} className="h-10 w-7 rounded object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{book.title}</p>
                          <p className="text-xs text-ink-500/60 dark:text-ink-100/50 truncate">{book.author}</p>
                        </div>
                         <span className="text-sm font-semibold">{formatPrice(book.price, currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>

               </motion.div>
             )}

             {tab === 'books' && (
              <motion.div
                key="books"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title or author…"
                    className="w-full rounded-xl bg-black/5 dark:bg-white/10 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-black/5 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-ink-500/70 dark:text-ink-100/60">
                        <tr>
                          <th className="px-4 py-3 font-medium">Book</th>
                          <th className="px-4 py-3 font-medium hidden sm:table-cell">Genre</th>
                          <th className="px-4 py-3 font-medium">Price</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/10">
                        {filtered.map((book) => (
                          <AdminBookRow
                            key={book.id}
                            book={book}
                            editing={editingId === book.id}
                            busy={busyId === book.id}
                            onEditToggle={() => setEditingId(editingId === book.id ? null : book.id)}
                            onDelete={() => onDelete(book)}
                            onClose={() => setEditingId(null)}
                            currency={currency}
                          />
                        ))}
                        {filtered.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-4 py-12 text-center text-ink-500/60 dark:text-ink-100/50">
                              No books found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ink-500/60 dark:text-ink-100/50">
                  {books.length} book{books.length !== 1 ? 's' : ''} in the catalog.
                </p>
                </motion.div>
             )}

             {tab === 'orders' && (
               <motion.div
                 key="orders"
                 initial={{ opacity: 0, y: 8 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -8 }}
               >
                 <div className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-black/5 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-ink-500/70 dark:text-ink-100/60">
                         <tr>
                           <th className="px-4 py-3 font-medium">Order</th>
                           <th className="px-4 py-3 font-medium hidden sm:table-cell">Items</th>
                           <th className="px-4 py-3 font-medium">Total</th>
                           <th className="px-4 py-3 font-medium">Status</th>
                           <th className="px-4 py-3 font-medium">Date</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-black/5 dark:divide-white/10">
                         {orders.map((order) => (
                           <tr key={order.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                             <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                             <td className="px-4 py-3 hidden sm:table-cell text-ink-500/70 dark:text-ink-100/60">{order.items.length} item(s)</td>
                              <td className="px-4 py-3 font-semibold">{formatPrice(order.total, currency)}</td>
                             <td className="px-4 py-3">
                               <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                 <CheckCircle2 size={10} /> {order.status}
                               </span>
                             </td>
                             <td className="px-4 py-3 text-xs text-ink-500/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                           </tr>
                         ))}
                         {orders.length === 0 && (
                           <tr>
                             <td colSpan={5} className="px-4 py-12 text-center text-ink-500/60 dark:text-ink-100/50">
                               No orders yet.
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </motion.div>
             )}

               {tab === 'settings' && (
               <motion.div
                 key="settings"
                 initial={{ opacity: 0, y: 8 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -8 }}
                 className="space-y-5"
               >
                 <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5">
                   <h2 className="font-display text-lg font-bold mb-4">Currency Settings</h2>
                   <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mb-4">
                     Select the currency that users will see across the store. This affects all prices, carts, and checkout.
                   </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { code: 'USD', symbol: '$', name: 'US Dollar' },
                        { code: 'EUR', symbol: '€', name: 'Euro' },
                        { code: 'GBP', symbol: '£', name: 'British Pound' },
                        { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
                        { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
                        { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
                        { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
                        { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
                        { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' },
                        { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
                        { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
                        { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
                        { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
                        { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
                        { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
                        { code: 'MUR', symbol: 'Rs', name: 'Mauritian Rupee' },
                        { code: 'SCR', symbol: 'SR', name: 'Seychellois Rupee' },
                        { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
                        { code: 'BBD', symbol: 'Bds$', name: 'Barbadian Dollar' },
                        { code: 'TTD', symbol: 'TT$', name: 'Trinidad & Tobago Dollar' },
                        { code: 'GYD', symbol: 'G$', name: 'Guyanese Dollar' },
                        { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' },
                        { code: 'SZL', symbol: 'E', name: 'Swazi Lilangeni' },
                        { code: 'LSL', symbol: 'L', name: 'Lesotho Loti' },
                        { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar' },
                        { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
                        { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
                        { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
                        { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
                        { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
                        { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
                        { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
                        { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
                        { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
                        { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
                        { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
                        { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
                        { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
                        { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
                        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
                        { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
                        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
                        { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
                        { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
                        { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
                        { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee' },
                        { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat' },
                        { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
                        { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
                        { code: 'THB', symbol: '฿', name: 'Thai Baht' },
                        { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
                        { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
                        { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
                        { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
                        { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
                        { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
                        { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal' },
                        { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar' },
                        { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar' },
                        { code: 'OMR', symbol: 'OMR', name: 'Omani Rial' },
                        { code: 'JOD', symbol: 'JD', name: 'Jordanian Dinar' },
                        { code: 'LBP', symbol: 'LL', name: 'Lebanese Pound' },
                        { code: 'IQD', symbol: 'IQD', name: 'Iraqi Dinar' },
                        { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
                        { code: 'DZD', symbol: 'DA', name: 'Algerian Dinar' },
                        { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar' },
                        { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
                      ].map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setCurrency(c.code)}
                          className={classNames(
                            'rounded-xl border p-3 text-center transition',
                            currency === c.code
                              ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10 shadow-lg'
                              : 'border-black/10 dark:border-white/15 hover:border-brand-300'
                          )}
                        >
                          <p className="text-lg font-bold">{c.symbol}</p>
                          <p className="text-[10px] font-medium mt-0.5">{c.code}</p>
                        </button>
                      ))}
                    </div>
                 </div>

                  <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5">
                    <h2 className="font-display text-lg font-bold mb-2">Admin Controls</h2>
                    <p className="text-sm text-ink-500/70 dark:text-ink-100/60">
                      As an admin, you can manage books, view orders, and change the store currency. All changes apply instantly.
                    </p>
                  </div>
               </motion.div>
              )}

          </AnimatePresence>
        </div>
      </div>

      <AddBookModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

/* ---------- Admin book row with inline edit ---------- */

function AdminBookRow({
  book,
  editing,
  busy,
  onEditToggle,
  onDelete,
  onClose,
  currency,
}: {
  book: Book;
  editing: boolean;
  busy: boolean;
  onEditToggle: () => void;
  onDelete: () => void;
  onClose: () => void;
  currency: string;
}) {
  const { updateBook, updateBookCover, isUserBook } = useBooks();
  const { uploadImage } = useAdmin();
  const { notify } = useStore();
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    price: String(book.price),
    genre: book.genre,
    description: book.description,
    availability: book.availability,
  });
  const [cover, setCover] = useState(book.cover);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const isSeed = !isUserBook(book.id);
    if (isSeed) {
      updateBookCover(book.id, cover);
    }
    const { error } = await updateBook(book.id, {
      title: form.title.trim(),
      author: form.author.trim(),
      price: Number(form.price),
      genre: form.genre,
      description: form.description.trim(),
      availability: form.availability,
      cover: isSeed ? undefined : cover,
    });
    setSaving(false);
    if (error) notify(error, 'error');
    else {
      notify('Book updated');
      onClose();
    }
  };

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setSaving(true);
    const url = await uploadImage(file, `book-cover-${book.id}-${Date.now()}`);
    if (url) {
      setCover(url);
      if (!isUserBook(book.id)) {
        updateBookCover(book.id, url);
      }
    }
    setSaving(false);
  };

  if (!editing) {
    return (
      <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
             <img src={book.cover} alt={book.title} className="h-14 w-10 rounded object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{book.title}</p>
              <p className="text-xs text-ink-500/70 dark:text-ink-100/60 truncate">{book.author}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell text-ink-500/70 dark:text-ink-100/60">{book.genre}</td>
        <td className="px-4 py-3">{formatPrice(book.price, currency)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
            <button onClick={onEditToggle} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10" aria-label="Edit">
              <Pencil size={15} />
            </button>
            <button
              onClick={onDelete}
              disabled={busy}
              className="grid h-8 w-8 place-items-center rounded-lg hover:bg-rose-500/10 text-rose-500 disabled:opacity-50"
              aria-label="Delete"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-brand-50/40 dark:bg-brand-500/5">
      <td colSpan={4} className="px-4 py-4">
        <div className="grid sm:grid-cols-[auto_1fr] gap-4">
          <label className="relative block h-28 w-20 rounded-lg overflow-hidden border-2 border-dashed border-black/15 dark:border-white/15 cursor-pointer shrink-0">
            {cover ? (
              <img src={cover} alt="cover" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center text-ink-500/50">
                <Upload size={18} />
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => onUpload(e.target.files?.[0])}
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="rounded-lg bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Author"
              className="rounded-lg bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              type="number"
              placeholder="Price"
              className="rounded-lg bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
            <input
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              placeholder="Genre"
              className="rounded-lg bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="sm:col-span-2 rounded-lg bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
            <select
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value as Book['availability'] })}
              className="rounded-lg bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            >
              {['in-stock', 'limited', 'preorder'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-2 text-sm font-semibold"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof BookCopy;
  label: string;
  value: string;
  color: 'brand' | 'emerald' | 'blue' | 'amber' | 'rose';
}) {
  const colors: Record<string, string> = {
    brand: 'from-brand-500 to-brand-700 shadow-brand-500/30',
    emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-500/30',
    blue: 'from-blue-500 to-blue-700 shadow-blue-500/30',
    amber: 'from-amber-500 to-amber-700 shadow-amber-500/30',
    rose: 'from-rose-500 to-rose-700 shadow-rose-500/30',
  };
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-4">
      <div className={classNames('grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg', colors[color])}>
        <Icon size={18} />
      </div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-ink-500/60 dark:text-ink-100/50">{label}</p>
    </div>
  );
}