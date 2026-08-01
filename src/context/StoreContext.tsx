import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Order, ReadingStat, ReadingStatus } from '../types';
import { useBooks } from './BooksContext';
import { useLocalStorage } from '../utils/format';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface RecentSearch {
  q: string;
  at: number;
}

interface StoreContextValue {
  dark: boolean;
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (bookId: string, qty?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQty: (bookId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  checkout: () => void;
  placeOrder: () => Promise<void>;
  orders: Order[];
  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  inWishlist: (bookId: string) => boolean;
  moveWishlistToCart: (bookId: string) => void;
  reading: Record<string, ReadingStat>;
  setStatus: (bookId: string, status: ReadingStatus) => void;
  setProgress: (bookId: string, progress: number) => void;
  toasts: Toast[];
  notify: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  recentSearches: RecentSearch[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  currency: string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { books } = useBooks();
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('bv-theme');
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('bv-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = useCallback(() => setDark((d) => !d), []);

  const [cart, setCart] = useLocalStorage<CartItem[]>('bv-cart', []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>('bv-wishlist', []);
  const [reading, setReading] = useLocalStorage<Record<string, ReadingStat>>('bv-reading', {});
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>('bv-recent', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('bv-orders', []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const currency = useMemo(() => localStorage.getItem('bv-currency') || 'USD', []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3200);
    },
    []
  );

  const addToCart = useCallback(
    (bookId: string, qty = 1) => {
      const book = books.find((b) => b.id === bookId);
      if (!book) {
        notify(`Book not found in catalog`, 'error');
        return;
      }
      setCart((prev) => {
        const found = prev.find((c) => c.id === bookId);
        if (found) {
          return prev.map((c) => (c.id === bookId ? { ...c, quantity: c.quantity + qty } : c));
        }
        return [
          ...prev,
          {
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            price: book.price,
            quantity: qty,
          },
        ];
      });
      notify(`Added "${book.title}" to cart`);
    },
    [notify, setCart, books]
  );

  const removeFromCart = useCallback(
    (bookId: string) => setCart((prev) => prev.filter((c) => c.id !== bookId)),
    [setCart]
  );

  const updateQty = useCallback(
    (bookId: string, qty: number) => {
      if (qty < 1) {
        setCart((prev) => prev.filter((c) => c.id !== bookId));
        return;
      }
      setCart((prev) => prev.map((c) => (c.id === bookId ? { ...c, quantity: qty } : c)));
    },
    [setCart]
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const checkout = useCallback(() => {
    if (cart.length === 0) return;
    window.location.href = '/checkout';
  }, [cart]);

  const placeOrder = useCallback(async () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 4.99;
    const platformFee = Math.round((subtotal * 0.029 + 0.3) * 100) / 100;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + platformFee + tax) * 100) / 100;
    const order: Order = {
      id: Math.random().toString(36).slice(2),
      user_id: '',
      items: [...cart],
      subtotal,
      discount: 0,
      shipping,
      platformFee,
      tax,
      total,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    notify('Order placed successfully!');
  }, [cart, setCart, setOrders, notify]);

  const toggleWishlist = useCallback(
    (bookId: string) => {
      const book = books.find((b) => b.id === bookId);
      setWishlist((prev) => {
        if (prev.includes(bookId)) {
          notify(`Removed "${book?.title}" from wishlist`, 'info');
          return prev.filter((id) => id !== bookId);
        }
        notify(`Added "${book?.title}" to wishlist`);
        return [...prev, bookId];
      });
    },
    [notify, setWishlist]
  );

  const inWishlist = useCallback((bookId: string) => wishlist.includes(bookId), [wishlist]);

  const moveWishlistToCart = useCallback(
    (bookId: string) => {
      addToCart(bookId, 1);
      setWishlist((prev) => prev.filter((id) => id !== bookId));
    },
    [addToCart, setWishlist]
  );

  const setStatus = useCallback(
    (bookId: string, status: ReadingStatus) => {
      setReading((prev) => {
        const next = { ...prev };
        if (status === null) {
          delete next[bookId];
        } else {
          const cur = next[bookId] || { bookId, status, progress: 0, addedAt: new Date().toISOString() };
          next[bookId] = {
            ...cur,
            status,
            finishedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return next;
      });
    },
    [setReading]
  );

  const setProgress = useCallback(
    (bookId: string, progress: number) => {
      setReading((prev) => {
        const cur = prev[bookId] || {
          bookId,
          status: 'reading' as ReadingStatus,
          progress: 0,
          addedAt: new Date().toISOString(),
        };
        return { ...prev, [bookId]: { ...cur, progress: Math.min(100, Math.max(0, progress)) } };
      });
    },
    [setReading]
  );

  const addRecentSearch = useCallback(
    (q: string) => {
      const query = q.trim();
      if (!query) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.q.toLowerCase() !== query.toLowerCase());
        return [{ q: query, at: Date.now() }, ...filtered].slice(0, 8);
      });
    },
    [setRecentSearches]
  );

  const clearRecentSearches = useCallback(() => setRecentSearches([]), [setRecentSearches]);

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((s, c) => s + c.price * c.quantity, 0), [cart]);

  const value: StoreContextValue = useMemo(
    () => ({
      dark,
      toggleTheme,
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      checkout,
      placeOrder,
      orders,
      cartCount,
      cartSubtotal,
      wishlist,
      toggleWishlist,
      inWishlist,
      moveWishlistToCart,
      reading,
      setStatus,
      setProgress,
      toasts,
      notify,
      dismissToast,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      currency,
    }),
    [dark, toggleTheme, cart, addToCart, removeFromCart, updateQty, clearCart, checkout, placeOrder, orders, cartCount, cartSubtotal, wishlist, toggleWishlist, inWishlist, moveWishlistToCart, reading, setStatus, setProgress, toasts, notify, dismissToast, recentSearches, addRecentSearch, clearRecentSearches, currency]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
