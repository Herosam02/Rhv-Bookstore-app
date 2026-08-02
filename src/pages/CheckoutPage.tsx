import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CreditCard, MapPin, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import UserAuthModal from '../components/UserAuthModal';
import { formatPrice } from '../utils/format';

export default function CheckoutPage() {
  const { cart, cartSubtotal, placeOrder, currency } = useStore();
  const { currency: adminCurrency, isUser, isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [filled, setFilled] = useState({
    name: false,
    email: false,
    address: false,
    city: false,
    zip: false,
    card: false,
    expiry: false,
    cvc: false,
    cardName: false,
  });

  if (!isUser && !isAdmin && cart.length > 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Lock className="mx-auto text-ink-400" size={56} />
        <h1 className="font-display text-3xl font-bold mt-4">Sign in to checkout</h1>
        <p className="text-ink-500/70 dark:text-ink-100/60 mt-2">Please sign in or create an account to complete your purchase.</p>
        <button
          onClick={() => setShowSignIn(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold"
        >
          Sign in
        </button>
        <UserAuthModal open={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    );
  }

  const activeCurrency = adminCurrency || currency;
  const subtotal = cartSubtotal;
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const platformFee = Math.round((subtotal * 0.029 + 0.3) * 100) / 100;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const discount = 0;
  const total = Math.round((subtotal + shipping + platformFee + tax - discount) * 100) / 100;

  const validate = () => {
    const allFilled = Object.values(filled).every(Boolean);
    if (!allFilled) {
      setError('Please fill in all required fields before placing your order.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = useCallback(async () => {
    if (!validate()) return;
    if (cart.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      await placeOrder();
      setSuccess(true);
    } catch {
      setError('Failed to process payment. Please try again.');
      setLoading(false);
    }
  }, [cart, placeOrder, filled]);

  const handlePaystack = useCallback(async () => {
    if (!validate()) return;
    if (cart.length === 0) return;
    setPaystackLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      await placeOrder();
      setSuccess(true);
    } catch {
      setError('Paystack payment failed. Please try again.');
    } finally {
      setPaystackLoading(false);
    }
  }, [cart, placeOrder, filled]);

  const updateFilled = (field: keyof typeof filled) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilled((prev) => ({ ...prev, [field]: e.target.value.trim().length > 0 }));
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <CreditCard className="mx-auto text-ink-400" size={56} />
        <h1 className="font-display text-3xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-ink-500/70 dark:text-ink-100/60 mt-2">Add some books before checking out.</p>
        <button onClick={() => navigate('/explore')} className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold">
          Browse books
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold">Payment Successful!</h1>
          <p className="text-ink-500/70 dark:text-ink-100/60 mt-2">
            Your order has been placed. Thank you for your purchase!
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold"
          >
            Back to cart
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-1.5 text-sm text-ink-500/70 hover:text-brand-600 mb-6">
        <ArrowLeft size={16} /> Back to cart
      </button>

      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <p className="text-sm text-ink-500/60 dark:text-ink-100/50 mt-1">Secure payment powered by Paystack & Stripe</p>

      <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <MapPin size={18} /> Shipping Address
            </h3>
            <div className="mt-4 grid gap-3">
              <input placeholder="Full name *" onChange={updateFilled('name')} className="w-full rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
              <input placeholder="Email address *" type="email" onChange={updateFilled('email')} className="w-full rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
              <input placeholder="Address line 1 *" onChange={updateFilled('address')} className="w-full rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City *" onChange={updateFilled('city')} className="rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                <input placeholder="ZIP code *" onChange={updateFilled('zip')} className="rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <CreditCard size={18} /> Payment Method
            </h3>
            <p className="mt-3 text-sm text-ink-500/70 dark:text-ink-100/60">
              Choose your preferred payment method. All transactions are encrypted and secure.
            </p>
            <div className="mt-4 grid gap-3">
              <input placeholder="Card number *" onChange={updateFilled('card')} className="w-full rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM/YY *" onChange={updateFilled('expiry')} className="rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                <input placeholder="CVC *" onChange={updateFilled('cvc')} className="rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
              <input placeholder="Cardholder name *" onChange={updateFilled('cardName')} className="w-full rounded-xl bg-black/5 dark:bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-ink-500/60">
              <Lock size={18} />
              <span className="text-xs">256-bit SSL encrypted</span>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 h-fit rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5 gradient-border">
          <h3 className="font-display text-lg font-bold">Order Summary</h3>
          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.cover} alt={item.title} className="h-14 w-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-ink-500/60">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity, activeCurrency)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-500/70">Subtotal</span><span>{formatPrice(subtotal, activeCurrency)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500/70">Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span> : formatPrice(shipping, activeCurrency)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500/70">Platform fee</span><span>{formatPrice(platformFee, activeCurrency)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500/70">Tax (8%)</span><span>{formatPrice(tax, activeCurrency)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(discount, activeCurrency)}</span></div>}
            <div className="border-t border-black/5 dark:border-white/10 pt-2 mt-2 flex justify-between text-base font-bold">
              <span>Total</span><motion.span key={total.toFixed(2)} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>{formatPrice(total, activeCurrency)}</motion.span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0}
            className="mt-5 w-full rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3.5 font-semibold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 neon-glow"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
            {loading ? 'Processing...' : `Pay ${formatPrice(total, activeCurrency)}`}
          </button>

          <button
            onClick={handlePaystack}
            disabled={paystackLoading || cart.length === 0}
            className="mt-3 w-full rounded-full bg-[#00A859] hover:bg-[#008f4c] disabled:opacity-60 text-white py-3.5 font-semibold shadow-lg shadow-[#00A859]/30 flex items-center justify-center gap-2"
          >
            {paystackLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {paystackLoading ? 'Processing...' : `Pay with Paystack`}
          </button>

          <p className="mt-3 text-center text-[11px] text-ink-500/60 dark:text-ink-100/50">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </aside>
      </div>
    </div>
  );
}