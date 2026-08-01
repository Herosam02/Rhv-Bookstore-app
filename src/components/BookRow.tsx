import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import type { Book } from '../types';

interface Props {
  books: Book[];
}

export default function BookRow({ books: items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="hidden lg:grid absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center rounded-full glass-strong shadow-lg hover:scale-110 transition-transform"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>
      <div ref={ref} className="flex gap-5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        {items.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            className="w-36 sm:w-40 md:w-44 lg:w-48 shrink-0"
          >
            <BookCard book={b} index={i} />
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="hidden lg:grid absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center rounded-full glass-strong shadow-lg hover:scale-110 transition-transform"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
