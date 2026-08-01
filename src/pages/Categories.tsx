import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collections } from '../data/books';
import { useBooks } from '../context/BooksContext';

export default function Categories() {
  const { books, genres } = useBooks();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold">Categories</h1>
      <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">Find books across {genres.length} genres.</p>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold mb-4">Featured Collections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {collections.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/explore?genre=${encodeURIComponent(c.genre)}`} className="group relative block aspect-16/9 rounded-2xl overflow-hidden">
                <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="text-xs opacity-80">{c.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold mb-4">Browse by Genre</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {genres.map((g, i) => {
            const count = books.filter((b) => b.genre === g).length;
            return (
              <motion.div key={g} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link to={`/explore?genre=${encodeURIComponent(g)}`} className="block rounded-2xl glass p-4 hover:ring-2 hover:ring-brand-400 transition">
                  <p className="font-semibold">{g}</p>
                  <p className="text-xs text-ink-500/70 dark:text-ink-100/60 mt-1">{count} books</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
