import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface OverrideMap {
  [key: string]: any;
}

interface AuthUser {
  email: string;
  role: 'user' | 'admin';
}

interface AdminContextValue {
  ready: boolean;
  isAdmin: boolean;
  isUser: boolean;
  user: AuthUser | null;
  signIn: (email: string, password: string, role: 'user' | 'admin') => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ error: string | null }>;
  overrides: OverrideMap;
  resolveValue: (key: string, fallback: string) => string;
  saveDraft: (key: string, kind: 'text' | 'image', value: string) => Promise<void>;
  publish: (key: string) => Promise<void>;
  revert: (key: string) => Promise<void>;
  uploadImage: (file: File, key: string) => Promise<string | null>;
  refresh: () => Promise<void>;
  currency: string;
  setCurrency: (currency: string) => void;
  userCount: number;
}

const ADMIN_EMAIL = 'admin3333878@gmail.com';
const ADMIN_PASSWORD = 'password8967';

const AdminContext = createContext<AdminContextValue | null>(null);

const STORAGE_USERS = 'bv-users';
const STORAGE_SESSION = 'bv-session';
const STORAGE_RESET = 'bv-reset-tokens';

function getUsers(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, string>) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthUser | null>(null);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [currency, setCurrencyState] = useState<string>(() => localStorage.getItem('bv-currency') || 'USD');
  const [userCount, setUserCount] = useState<number>(() => Object.keys(getUsers()).length);

  const isAdmin = session?.role === 'admin';
  const isUser = session?.role === 'user';
  const user = session;

  const refreshUserCount = useCallback(() => {
    setUserCount(Object.keys(getUsers()).length);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_SESSION);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AuthUser;
        if (parsed.role === 'admin' && parsed.email === ADMIN_EMAIL) {
          setSession(parsed);
        } else if (parsed.role === 'user') {
          const users = getUsers();
          if (users[parsed.email]) {
            setSession(parsed);
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_SESSION);
      }
    }
    refreshUserCount();
    setReady(true);
  }, [refreshUserCount]);

  const setCurrency = useCallback((cur: string) => {
    setCurrencyState(cur);
    localStorage.setItem('bv-currency', cur);
  }, []);

  const signIn = useCallback(async (email: string, password: string, role: 'user' | 'admin') => {
    await new Promise((r) => setTimeout(r, 600));
    const trimmed = email.trim().toLowerCase();

    if (role === 'admin') {
      if (trimmed === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const s: AuthUser = { email: trimmed, role: 'admin' };
        setSession(s);
        localStorage.setItem(STORAGE_SESSION, JSON.stringify(s));
        return { error: null };
      }
      return { error: 'Invalid admin credentials.' };
    }

    const users = getUsers();
    if (users[trimmed] && users[trimmed] === password) {
      const s: AuthUser = { email: trimmed, role: 'user' };
      setSession(s);
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(s));
      return { error: null };
    }
    return { error: 'Invalid email or password.' };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const trimmed = email.trim().toLowerCase();
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }
    const users = getUsers();
    if (users[trimmed]) {
      return { error: 'An account with this email already exists.' };
    }
    users[trimmed] = password;
    saveUsers(users);
    refreshUserCount();
    const s: AuthUser = { email: trimmed, role: 'user' };
    setSession(s);
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(s));
    return { error: null };
  }, [refreshUserCount]);

  const signOut = useCallback(() => {
    setSession(null);
    localStorage.removeItem(STORAGE_SESSION);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const trimmed = email.trim().toLowerCase();
    if (trimmed === ADMIN_EMAIL) {
      localStorage.setItem(STORAGE_RESET, trimmed);
      return { error: null };
    }
    const users = getUsers();
    if (users[trimmed]) {
      localStorage.setItem(STORAGE_RESET, trimmed);
      return { error: null };
    }
    return { error: 'No account found with that email.' };
  }, []);

  const resetPassword = useCallback(async (_token: string, newPassword: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const resetEmail = localStorage.getItem(STORAGE_RESET);
    if (!resetEmail) {
      return { error: 'Invalid or expired reset token.' };
    }
    if (newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }
    const users = getUsers();
    if (resetEmail === ADMIN_EMAIL) {
      localStorage.removeItem(STORAGE_RESET);
      return { error: null };
    }
    if (users[resetEmail]) {
      users[resetEmail] = newPassword;
      saveUsers(users);
      localStorage.removeItem(STORAGE_RESET);
      return { error: null };
    }
    return { error: 'Account not found.' };
  }, []);

  const loadOverrides = useCallback(async () => {
    setOverrides({});
  }, []);

  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  const refresh = loadOverrides;

  const resolveValue = useCallback(
    (key: string, fallback: string) => {
      const ov = overrides[key];
      if (!ov) return fallback;
      return ov.draft_value ?? ov.published_value ?? fallback;
    },
    [overrides]
  );

  const upsertOverride = useCallback(
    async (_k: string, _kind: 'text' | 'image', _patch: Partial<any>) => {
      await new Promise((r) => setTimeout(r, 300));
      await refresh();
    },
    [refresh]
  );

  const saveDraft = useCallback(
    async (key: string, kind: 'text' | 'image', value: string) => {
      await upsertOverride(key, kind, { draft_value: value });
    },
    [upsertOverride]
  );

  const publish = useCallback(
    async (key: string) => {
      const ov = overrides[key];
      if (!ov || ov.draft_value == null) return;
      await upsertOverride(key, ov.kind, {
        published_value: ov.draft_value,
        draft_value: ov.draft_value,
      });
    },
    [overrides, upsertOverride]
  );

  const revert = useCallback(
    async (_key: string) => {
      await new Promise((r) => setTimeout(r, 300));
      await refresh();
    },
    [refresh]
  );

  const uploadImage = useCallback(async (file: File, _key: string): Promise<string | null> => {
    const url = URL.createObjectURL(file);
    return url;
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      ready,
      isAdmin,
      isUser,
      user,
      signIn,
      signUp,
      signOut,
      forgotPassword,
      resetPassword,
      overrides,
      resolveValue,
      saveDraft,
      publish,
      revert,
      uploadImage,
      refresh,
      currency,
      setCurrency,
      userCount,
    }),
    [ready, isAdmin, isUser, user, signIn, signUp, signOut, forgotPassword, resetPassword, overrides, resolveValue, saveDraft, publish, revert, uploadImage, refresh, currency, setCurrency, userCount]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
