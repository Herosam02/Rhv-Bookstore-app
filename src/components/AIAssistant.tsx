import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { respond, type AIMessage } from '../services/ai';
import { useBooks } from '../context/BooksContext';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../utils/format';

const SUGGESTIONS = [
  'Recommend mystery books',
  'Show books similar to Harry Potter',
  'Suggest books for beginners',
  'Best rated books',
];

export default function AIAssistant() {
  const { books } = useBooks();
  const { currency } = useAdmin();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      content: "Hi, I'm Verse — your AI reading companion. Ask me for book recommendations by genre, mood, or similarity to a favorite.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), role: 'user', content: q }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, respond(q, books)]);
    }, 700 + Math.random() * 500);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 left-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-2xl shadow-brand-500/40"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed bottom-24 left-5 z-[70] w-[min(380px,92vw)] h-[min(560px,72vh)] flex flex-col rounded-3xl glass-strong shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
          >
            <header className="flex items-center gap-3 border-b border-black/5 dark:border-white/10 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Bot size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm leading-tight">Verse Assistant</p>
                <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                </p>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-brand-500 text-white px-3 py-2 text-sm'
                        : 'max-w-[88%] rounded-2xl rounded-bl-sm bg-black/5 dark:bg-white/10 px-3 py-2 text-sm'
                    }
                  >
                    <p>{m.content}</p>
                    {m.books && (
                      <div className="mt-3 space-y-2">
                        {m.books.map((b) => (
                          <Link
                            key={b.id}
                            to={`/book/${b.id}`}
                            onClick={() => setOpen(false)}
                            className="flex gap-2 rounded-lg bg-white/80 dark:bg-ink-900/60 p-2 hover:ring-2 hover:ring-brand-400 transition"
                          >
                             <img src={b.cover} alt={b.title} className="h-14 w-10 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="line-clamp-1 text-xs font-semibold">{b.title}</p>
                              <p className="text-[10px] text-ink-500/70 dark:text-ink-100/60">{b.author}</p>
                               <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400">{formatPrice(b.price, currency)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-black/5 dark:bg-white/10 px-3 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-ink-500/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-brand-300/40 bg-brand-50/60 dark:bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-black/5 dark:border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for a recommendation…"
                className="flex-1 rounded-full bg-black/5 dark:bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-white hover:bg-brand-600"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
