import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-gradient-to-br from-ink-50 to-white dark:from-ink-950 dark:to-ink-900"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="book-loader scale-150">
          <div className="page" />
          <div className="page" />
          <div className="page" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl font-bold"
        >
          Book<span className="gradient-text">Verse</span>
        </motion.h1>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm text-ink-500/70 dark:text-ink-100/60"
        >
          Preparing your shelves…
        </motion.p>
      </div>
    </motion.div>
  );
}
