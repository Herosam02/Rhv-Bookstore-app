import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './layouts/Layout';
import { StoreProvider } from './context/StoreContext';
import { BooksProvider } from './context/BooksContext';
import { AdminProvider } from './context/AdminContext';
import ScrollProgress from './components/ScrollProgress';
import Toaster from './components/Toaster';
import AIAssistant from './components/AIAssistant';
import LoadingScreen from './components/LoadingScreen';
import BookLoader from './components/BookLoader';
import { AdminModeBadge } from './components/Editable';
import WhatsAppButton from './components/WhatsAppButton';

const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Categories = lazy(() => import('./pages/Categories'));
const BookDetails = lazy(() => import('./pages/BookDetails'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/CheckoutPage'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ReadingTracker = lazy(() => import('./pages/ReadingTracker'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));

const PageFallback = (
  <div className="grid place-items-center min-h-[60vh]">
    <BookLoader />
  </div>
);

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <BooksProvider>
      <StoreProvider>
        <AdminProvider>
          <BrowserRouter>
            <AnimatePresence>{!loaded && <LoadingScreen />}</AnimatePresence>
            <ScrollProgress />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Suspense fallback={PageFallback}><Home /></Suspense>} />
                <Route path="/home" element={<Suspense fallback={PageFallback}><Home /></Suspense>} />
                <Route path="/explore" element={<Suspense fallback={PageFallback}><Explore /></Suspense>} />
                <Route path="/categories" element={<Suspense fallback={PageFallback}><Categories /></Suspense>} />
                <Route path="/book/:id" element={<Suspense fallback={PageFallback}><BookDetails /></Suspense>} />
                <Route path="/search" element={<Suspense fallback={PageFallback}><SearchResults /></Suspense>} />
                <Route path="/cart" element={<Suspense fallback={PageFallback}><Cart /></Suspense>} />
                <Route path="/checkout" element={<Suspense fallback={PageFallback}><Checkout /></Suspense>} />
                <Route path="/wishlist" element={<Suspense fallback={PageFallback}><Wishlist /></Suspense>} />
                <Route path="/tracker" element={<Suspense fallback={PageFallback}><ReadingTracker /></Suspense>} />
                <Route path="/profile" element={<Suspense fallback={PageFallback}><Profile /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={PageFallback}><Settings /></Suspense>} />
                <Route path="/about" element={<Suspense fallback={PageFallback}><About /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={PageFallback}><Contact /></Suspense>} />
                <Route path="/faq" element={<Suspense fallback={PageFallback}><FAQ /></Suspense>} />
                <Route path="/admin" element={<Suspense fallback={PageFallback}><Admin /></Suspense>} />
                <Route path="*" element={<Suspense fallback={PageFallback}><NotFound /></Suspense>} />
              </Route>
            </Routes>
            {loaded && <AIAssistant />}
            <AdminModeBadge />
            <WhatsAppButton />
            <Toaster />
          </BrowserRouter>
        </AdminProvider>
      </StoreProvider>
    </BooksProvider>
  );
}
