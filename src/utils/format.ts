import { useCallback, useEffect, useState } from 'react';

export function formatPrice(value: number, currency = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', NGN: '₦', KES: 'KSh', GHS: 'GH₵', ZAR: 'R',
    XOF: 'CFA', XAF: 'FCFA', EGP: 'E£', MAD: 'MAD', TZS: 'TSh', UGX: 'USh',
    ZMW: 'ZK', BWP: 'P', MUR: 'Rs', SCR: 'SR', JMD: 'J$', BBD: 'Bds$',
    TTD: 'TT$', GYD: 'G$', FJD: 'FJ$', SZL: 'E', LSL: 'L', NAD: 'N$',
    CZK: 'Kč', HUF: 'Ft', PLN: 'zł', RON: 'lei', BGN: 'лв', SEK: 'kr',
    NOK: 'kr', DKK: 'kr', CHF: 'Fr', TRY: '₺', RUB: '₽', UAH: '₴',
    KZT: '₸', CNY: '¥', JPY: '¥', KRW: '₩', INR: '₹', PKR: 'Rs',
    BDT: '৳', LKR: 'Rs', NPR: 'Rs', MMK: 'K', KHR: '៛', VND: '₫',
    THB: '฿', MYR: 'RM', SGD: 'S$', IDR: 'Rp', PHP: '₱', AED: 'د.إ',
    SAR: 'SR', QAR: 'QR', KWD: 'KD', BHD: 'BD', OMR: 'OMR', JOD: 'JD',
    LBP: 'LL', IQD: 'IQD', ILS: '₪', DZD: 'DA', TND: 'DT', ETB: 'Br',
  };
  const symbol = symbols[currency] || '$';
  if (currency === 'XOF' || currency === 'XAF' || currency === 'ETB') {
    return `${symbol} ${value.toFixed(0)}`;
  }
  if (currency === 'VND' || currency === 'IDR' || currency === 'KRW' || currency === 'JPY') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  return `${symbol}${value.toFixed(2)}`;
}

export function classNames(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(' ');
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const day = 86400000;
  if (diff < day) return 'today';
  const days = Math.floor(diff / day);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors silently
    }
  }, [key, value]);

  const update = useCallback((v: T | ((p: T) => T)) => {
    setValue((prev) => (typeof v === 'function' ? (v as (p: T) => T)(prev) : v));
  }, []);

  return [value, update];
}
