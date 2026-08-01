import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Contact() {
  const { notify } = useStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    notify("Message sent! We'll be in touch soon.");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Get in touch</h1>
        <p className="text-ink-500/70 dark:text-ink-100/60 mt-2">Questions, feedback, or just want to say hello? We'd love to hear from you.</p>
      </motion.div>

      <div className="mt-10 grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <div className="space-y-3">
          {[
            { icon: <Mail size={18} />, label: 'Email', value: 'hello@bookverse.demo' },
            { icon: <Phone size={18} />, label: 'Phone', value: '+1 (555) 000-0000' },
            { icon: <MapPin size={18} />, label: 'Address', value: '123 Reading Lane, Storyville' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-2xl glass p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600">{c.icon}</div>
              <div>
                <p className="text-xs text-ink-500/70 dark:text-ink-100/60">{c.label}</p>
                <p className="font-semibold text-sm">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-2xl glass p-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" className="rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" placeholder="Your email" className="rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Your message" className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold">
            <Send size={15} /> Send message
          </button>
        </form>
      </div>
    </div>
  );
}
