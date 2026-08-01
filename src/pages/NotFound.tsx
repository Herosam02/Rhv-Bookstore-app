import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-2xl shadow-brand-500/40"
        >
          <BookOpen size={36} />
        </motion.div>
        <h1 className="mt-6 font-display text-7xl font-bold gradient-text">404</h1>
        <p className="font-display text-xl font-semibold mt-2">This page is off the shelf.</p>
        <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-2">The page you were looking for doesn't exist or has moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold">
          <Home size={16} /> Back home
        </Link>
      </div>
    </div>
  );
}
