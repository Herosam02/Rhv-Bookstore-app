import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 max-w-[92vw]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass-strong flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl min-w-[260px]"
          >
            {t.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : t.type === 'error' ? (
              <XCircle size={18} className="text-rose-500" />
            ) : (
              <Info size={18} className="text-accent-500" />
            )}
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="text-ink-500/60 hover:text-ink-900 dark:hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
