import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { classNames } from '../utils/format';

const FAQS = [
  { q: 'How do I add books to my wishlist?', a: 'Tap the heart icon on any book card or book details page. Your wishlist is saved to your browser — it will be there when you return.' },
  { q: 'How does the reading tracker work?', a: 'Open any book page and use the Reading / Want / Done buttons to add it to your tracker. Adjust the progress slider on currently-reading books to log how far you have come.' },
  { q: 'Is there a cart and checkout?', a: 'Yes — add books to your cart, apply coupon code READ20 for 20% off, and proceed to checkout (demo only; no payment is processed).' },
  { q: 'How do I use the AI assistant?', a: 'Click the floating verse icon at the bottom left of any page. Ask for recommendations by genre, mood, or similarity, e.g. “recommend mystery books”.' },
  { q: 'Can I switch between light and dark mode?', a: 'Use the sun/moon toggle in the navbar. Your choice is remembered across visits. You can also pick an accent color and reading font in Settings.' },
  { q: 'Are the prices real?', a: 'No — BookVerse is a demo experience. All books, prices, and reviews are for illustration only.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-center">Frequently Asked Questions</h1>
      <p className="text-center text-sm text-ink-500/70 dark:text-ink-100/60 mt-2">Everything you need to know about using BookVerse.</p>

      <div className="mt-8 space-y-2">
        {FAQS.map((f, i) => (
          <div key={i} className="rounded-2xl glass overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
              <span className="font-semibold text-sm">{f.q}</span>
              <ChevronDown size={16} className={classNames('transition-transform shrink-0', open === i && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-ink-500/80 dark:text-ink-100/70">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
