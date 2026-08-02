import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, CreditCard, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import UserAuthModal from '../components/UserAuthModal';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, cartSubtotal, currency } = useStore();
  const navigate = useNavigate();
  const { isUser, isAdmin } = useAdmin();
  const [showSignIn, setShowSignIn] = useState(false);

  const tax = cartSubtotal * 0.08;
  const shipping = cartSubtotal >= 50 ? 0 : 4.99;
  const platformFee = Math.round((cartSubtotal * 0.029 + 0.3) * 100) / 100;
  const total = cartSubtotal + shipping + platformFee + tax;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (!isUser && !isAdmin) {
      setShowSignIn(true);
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto text-ink-400" size={56} />
        <h1 className="font-display text-3xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-ink-500/70 dark:text-ink-100/60 mt-2">Browse our shelves and find your next great read.</p>
        <Link to="/explore" className="inline-flex items-center gap-2 mt-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 font-semibold">
          Start exploring <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
      <p className="text-sm text-ink-500/70 dark:text-ink-100/60 mt-1">{cart.length} items in your cart</p>

      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="flex gap-4 rounded-2xl glass p-4"
              >
                <Link to={`/book/${item.id}`}>
                  <img src={item.cover} alt={item.title} className="h-24 w-16 rounded object-cover" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link to={`/book/${item.id}`} className="font-display font-semibold hover:text-brand-600">{item.title}</Link>
                  <p className="text-xs text-ink-500/70 dark:text-ink-100/60">by {item.author}</p>
                  <p className="text-sm font-bold mt-1">{formatPrice(item.price, currency)}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/10 px-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center"><Minus size={13} /></button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center"><Plus size={13} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-ink-500/60 hover:text-rose-500 inline-flex items-center gap-1 text-xs">
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button onClick={clearCart} className="text-sm text-ink-500/70 hover:text-rose-500 inline-flex items-center gap-1">
            <Trash2 size={14} /> Clear cart
          </button>
        </div>

        <aside className="lg:sticky lg:top-20 h-fit rounded-2xl glass p-5 gradient-border">
          <h3 className="font-display text-lg font-bold">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-500/70 dark:text-ink-100/60">Subtotal</span><span>{formatPrice(cartSubtotal, currency)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500/70 dark:text-ink-100/60">Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span> : formatPrice(shipping, currency)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500/70 dark:text-ink-100/60">Platform fee</span><span>{formatPrice(platformFee, currency)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500/70 dark:text-ink-100/60">Tax (8%)</span><span>{formatPrice(tax, currency)}</span></div>
            <div className="border-t border-black/5 dark:border-white/10 pt-2 mt-2 flex justify-between text-base font-bold">
              <span>Total</span><motion.span key={total.toFixed(2)} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>{formatPrice(total, currency)}</motion.span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className="mt-5 w-full rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-3 font-semibold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 neon-glow"
          >
            {(isUser || isAdmin) ? <CreditCard size={18} /> : <Lock size={18} />}
            {(isUser || isAdmin) ? 'Place Order' : 'Sign in to Order'}
          </button>
        </aside>

        <UserAuthModal open={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    </div>
  );
}
