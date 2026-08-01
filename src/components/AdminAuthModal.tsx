import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Lock, LogOut, Mail, Shield, User, X, KeyRound } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

type ModalMode = 'login' | 'forgot' | 'reset' | 'loggedin';

export default function AdminAuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isAdmin, signIn, signOut, forgotPassword, resetPassword } = useAdmin();
  const [mode, setMode] = useState<ModalMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccessMsg(null);
      setBusy(false);
      setMode('login');
      setEmail('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setResetToken('');
    }
  }, [open]);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password, 'admin');
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setEmail('');
    setPassword('');
    onClose();
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await forgotPassword(email.trim());
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccessMsg('If an admin account exists, a reset link has been sent.');
    setMode('reset');
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const { error } = await resetPassword(resetToken, newPassword);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccessMsg('Password reset successful. You can now sign in.');
    setMode('login');
    setPassword(newPassword);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-md rounded-3xl glass-strong shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
          >
            <div className="relative p-6 pb-4 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <button onClick={onClose} className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Close">
                <X size={16} />
              </button>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                <Shield size={22} />
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold">Admin Access</h2>
              <p className="text-white/85 text-sm">
                {isAdmin ? 'You are signed in as an admin.' : 'Sign in with admin credentials to manage the store.'}
              </p>
            </div>

            {isAdmin ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-black/5 dark:bg-white/10 p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-white">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">Admin</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Admin mode active
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 dark:bg-white/10 hover:bg-ink-950 text-white px-4 py-3 text-sm font-semibold"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            ) : (
              <form onSubmit={mode === 'login' ? submitLogin : mode === 'forgot' ? submitForgot : submitReset} className="p-6 space-y-4">
                {(mode === 'login' || mode === 'forgot') && (
                  <label className="block">
                    <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Email</span>
                    <div className="mt-1 relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@bookverse.demo"
                        className="w-full rounded-xl bg-black/5 dark:bg-white/10 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                      />
                    </div>
                  </label>
                )}

                {mode === 'login' && (
                  <label className="block">
                    <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Password</span>
                    <div className="mt-1 relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-black/5 dark:bg-white/10 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                      />
                    </div>
                  </label>
                )}

                {mode === 'reset' && (
                  <>
                    <div>
                      <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Reset token</span>
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Enter reset token"
                        className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                      />
                    </div>
                    <label className="block">
                      <span className="text-xs text-ink-500/70 dark:text-ink-100/60">New password</span>
                      <div className="mt-1 relative">
                        <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full rounded-xl bg-black/5 dark:bg-white/10 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Confirm password</span>
                      <div className="mt-1 relative">
                        <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full rounded-xl bg-black/5 dark:bg-white/10 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                        />
                      </div>
                    </label>
                  </>
                )}

                {error && (
                  <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>
                )}
                {successMsg && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg px-3 py-2">{successMsg}</p>
                )}

                {mode === 'login' && (
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                    Admin sign in
                  </button>
                )}
                {mode === 'forgot' && (
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    Send reset link
                  </button>
                )}
                {mode === 'reset' && (
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                    Reset password
                  </button>
                )}

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
                {(mode === 'forgot' || mode === 'reset') && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Back to sign in
                  </button>
                )}
                <p className="text-[11px] text-center text-ink-500/60 dark:text-ink-100/50">
                  Admin only. Use your designated admin credentials.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
