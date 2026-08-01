import { Moon, Palette, Sun, Type } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLocalStorage, classNames } from '../utils/format';

const ACCENTS = [
  { name: 'Ember', value: '#f97316' },
  { name: 'Ocean', value: '#06b6d4' },
  { name: 'Forest', value: '#10b981' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#f59e0b' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Mono', value: 'ui-monospace, monospace' },
];

export default function Settings() {
  const { dark, toggleTheme, notify } = useStore();
  const [font, setFont] = useLocalStorage<string>('bv-font', FONTS[0].value);
  const [accent, setAccent] = useLocalStorage<string>('bv-accent', ACCENTS[0].value);
  const [density, setDensity] = useLocalStorage<'comfortable' | 'compact'>('bv-density', 'comfortable');

  const applyAccent = (value: string) => {
    setAccent(value);
    const root = document.documentElement;
    root.style.setProperty('--accent-pick', value);
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);
    root.style.setProperty('--user-accent', `${r} ${g} ${b}`);
    notify('Accent updated');
  };

  const applyFont = (value: string) => {
    setFont(value);
    const root = document.documentElement;
    root.style.setProperty('--user-font', `"${value.split(',')[0]}"`);
    notify('Font updated');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">Personalize your BookVerse experience.</p>

      <section className="mt-6 rounded-2xl glass p-5">
        <h3 className="font-semibold flex items-center gap-2"><Palette size={16} /> Theme</h3>
        <div className="mt-4 flex gap-3">
          <button onClick={() => dark && toggleTheme()} className={classNames('flex-1 rounded-xl border p-4 text-center transition', !dark ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10' : 'border-black/10 dark:border-white/15')}>
            <Sun className="mx-auto" /> Light
          </button>
          <button onClick={() => !dark && toggleTheme()} className={classNames('flex-1 rounded-xl border p-4 text-center transition', dark ? 'border-brand-500 bg-brand-500/10' : 'border-black/10 dark:border-white/15')}>
            <Moon className="mx-auto" /> Dark
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl glass p-5">
        <h3 className="font-semibold flex items-center gap-2"><Palette size={16} /> Accent color</h3>
        <div className="mt-4 flex gap-3 flex-wrap">
          {ACCENTS.map((a) => (
            <button key={a.value} onClick={() => applyAccent(a.value)} className={classNames('h-10 w-10 rounded-full transition', accent === a.value && 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-ink-950')} style={{ backgroundColor: a.value }} aria-label={a.name} />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl glass p-5">
        <h3 className="font-semibold flex items-center gap-2"><Type size={16} /> Reading font</h3>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {FONTS.map((f) => (
            <button key={f.value} onClick={() => applyFont(f.value)} className={classNames('rounded-xl border p-3 text-sm transition', font === f.value ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10' : 'border-black/10 dark:border-white/15')} style={{ fontFamily: f.value }}>
              Aa
              <p className="text-[10px] text-ink-500/70 mt-1">{f.name}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl glass p-5">
        <h3 className="font-semibold">Layout density</h3>
        <div className="mt-3 flex gap-2">
          {(['comfortable', 'compact'] as const).map((d) => (
            <button key={d} onClick={() => setDensity(d)} className={classNames('flex-1 rounded-xl border py-2 text-sm capitalize', density === d ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10' : 'border-black/10 dark:border-white/15')}>{d}</button>
          ))}
        </div>
      </section>
    </div>
  );
}
