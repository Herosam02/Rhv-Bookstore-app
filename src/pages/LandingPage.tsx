import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, Lock, Mail, User, KeyRound, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export default function LandingPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signOut, isAdmin, isUser, forgotPassword, resetPassword } = useAdmin();

  useEffect(() => {
    if (isAdmin || isUser) {
      navigate('/home', { replace: true });
    }
  }, [isAdmin, isUser, navigate]);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setBusy(false);
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken('');
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    setBusy(true);
    const { error } = await signIn(email.trim(), password, 'user');
    setBusy(false);
    if (!error) {
      navigate('/home');
    } else {
      setError(error);
    }
  };

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    setBusy(true);
    const { error } = await signUp(email.trim(), password);
    setBusy(false);
    if (!error) {
      navigate('/home');
    } else {
      setError(error);
    }
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    setBusy(true);
    const { error } = await forgotPassword(email.trim());
    setBusy(false);
    if (error) {
      setError(error);
    } else {
      setSuccessMsg('If an account exists, a reset link has been sent.');
      setMode('reset');
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const { error } = await resetPassword(resetToken, newPassword);
    setBusy(false);
    if (error) {
      setError(error);
    } else {
      setSuccessMsg('Password reset successful. You can now sign in.');
      setMode('login');
      setPassword(newPassword);
    }
  };

  if (isAdmin || isUser) {
    return (
      <div className="grid place-items-center min-h-screen px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-500 text-white mb-4">
            <BookOpen size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-500/70 dark:text-ink-100/60">
            You are signed in as <span className="font-semibold">{email || 'user'}</span>
          </p>
          <button
            onClick={() => {
              signOut();
              resetForm();
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 dark:bg-white/10 text-white px-6 py-3 text-sm font-semibold hover:bg-ink-950"
          >
            Sign out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid place-items-center min-h-screen px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
            <BookOpen size={28} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold">BookVerse</h1>
          <p className="mt-1 text-sm text-ink-500/70 dark:text-ink-100/60">Sign in to access the library</p>
        </div>

        <div className="rounded-3xl glass-strong shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="p-6 pb-4 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <h2 className="font-display text-xl font-bold">
              {mode === 'login' && 'Sign in'}
              {mode === 'signup' && 'Create account'}
              {mode === 'forgot' && 'Reset password'}
              {mode === 'reset' && 'New password'}
            </h2>
            <p className="text-white/85 text-sm mt-1">
              {mode === 'login' && 'Welcome back! Sign in to continue.'}
              {mode === 'signup' && 'Join BookVerse today.'}
              {mode === 'forgot' && "Enter your email and we'll send a reset link."}
              {mode === 'reset' && 'Enter the reset token and your new password.'}
            </p>
          </div>

          <form onSubmit={mode === 'login' ? submitLogin : mode === 'signup' ? submitSignup : mode === 'forgot' ? submitForgot : submitReset} className="p-6 space-y-4">
            {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
              <label className="block">
                <span className="text-xs text-ink-500/70 dark:text-ink-100/60">Email</span>
                <div className="mt-1 relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-black/5 dark:bg-white/10 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </label>
            )}

            {(mode === 'login' || mode === 'signup') && (
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
                    placeholder="Min 6 characters"
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
              <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <User size={16} />}
                Sign in
              </button>
            )}
            {mode === 'signup' && (
              <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Create account
              </button>
            )}
            {mode === 'forgot' && (
              <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                Send reset link
              </button>
            )}
            {mode === 'reset' && (
              <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-brand-500/30">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                Reset password
              </button>
            )}

            <div className="flex flex-col gap-2">
              {mode === 'login' && (
                <>
                  <button type="button" onClick={() => { setMode('forgot'); resetForm(); }} className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline">
                    Forgot password?
                  </button>
                  <button type="button" onClick={() => { setMode('signup'); resetForm(); }} className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline">
                    Don't have an account? Sign up
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <button type="button" onClick={() => { setMode('login'); resetForm(); }} className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Already have an account? Sign in
                </button>
              )}
              {(mode === 'forgot' || mode === 'reset') && (
                <button type="button" onClick={() => { setMode('login'); resetForm(); }} className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500/60 dark:text-ink-100/50">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
