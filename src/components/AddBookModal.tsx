import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookPlus, ImageUp, Loader2, X } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import { useAdmin } from '../context/AdminContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AVAIL = ['in-stock', 'limited', 'preorder'];

export default function AddBookModal({ open, onClose }: Props) {
  const { genres, addBook } = useBooks();
  const { uploadImage } = useAdmin();
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    originalPrice: '',
    genre: 'Fiction',
    tags: '',
    description: '',
    publisher: '',
    pages: '',
    availability: 'in-stock',
  });
  const [cover, setCover] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setBusy(false);
    }
  }, [open]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file, `book-cover-${Date.now()}`);
      if (url) setCover(url);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.author.trim()) {
      setError('Title and author are required.');
      return;
    }
    const price = Number(form.price);
    if (!price || price <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    setBusy(true);
    const { error } = await addBook({
      title: form.title.trim(),
      author: form.author.trim(),
      cover: cover || undefined,
      price,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      genre: form.genre,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      description: form.description.trim(),
      publisher: form.publisher.trim() || undefined,
      pages: form.pages ? Number(form.pages) : undefined,
      availability: form.availability,
    });
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setForm({
      title: '', author: '', price: '', originalPrice: '', genre: 'Fiction',
      tags: '', description: '', publisher: '', pages: '', availability: 'in-stock',
    });
    setCover('');
    onClose();
  };

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <label className="block">
      <span className="text-xs text-ink-500/70 dark:text-ink-100/60">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
      />
    </label>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-lg rounded-3xl glass-strong shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden my-8"
          >
            <div className="flex items-center justify-between p-5 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
                  <BookPlus size={20} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Add a Book</h2>
                  <p className="text-white/85 text-xs">List a new book in the catalog.</p>
                </div>
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Cover</span>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="mt-1 relative grid h-40 w-28 place-items-center rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 cursor-pointer hover:border-brand-400 overflow-hidden bg-black/5 dark:bg-white/5"
                  >
                    {cover ? (
                      <img src={cover} alt="cover" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center text-ink-500/60 px-2">
                        <ImageUp size={20} className="mx-auto" />
                        <span className="text-[10px] mt-1 block">Upload</span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {field('Title', 'title', 'text', 'The Midnight Garden')}
                  {field('Author', 'author', 'text', 'Jane Author')}
                  <div className="grid grid-cols-2 gap-3">
                    {field('Price ($)', 'price', 'number', '14.99')}
                    {field('Original price', 'originalPrice', 'number', '19.99')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Genre</span>
                  <select
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="mt-1 w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                  >
                    {genres.map((g) => <option key={g} value={g} className="bg-white dark:bg-ink-900">{g}</option>)}
                  </select>
                </label>
                {field('Pages', 'pages', 'number', '320')}
              </div>

              {field('Tags (comma separated)', 'tags', 'text', 'fantasy, adventure')}
              {field('Publisher', 'publisher', 'text', 'Self-published')}

              <label className="block">
                <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="A short description of the book…"
                  className="mt-1 w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                />
              </label>

              <label className="block">
                <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Availability</span>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="mt-1 w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                >
                  {AVAIL.map((a) => <option key={a} value={a} className="bg-white dark:bg-ink-900">{a}</option>)}
                </select>
              </label>

              {error && (
                <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <BookPlus size={16} />}
                Add book to catalog
              </button>
              <p className="text-[11px] text-center text-ink-500/60 dark:text-ink-100/50">
                The book appears live for everyone once added.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
