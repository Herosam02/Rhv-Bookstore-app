import { motion } from 'framer-motion';

export default function BookLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="book-loader">
        <div className="page" />
        <div className="page" />
        <div className="page" />
      </div>
      <motion.p
        className="text-sm text-ink-500/70 dark:text-ink-100/60 font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Opening the shelves…
      </motion.p>
    </div>
  );
}
