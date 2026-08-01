import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import LandingPage from './pages/LandingPage';
import { useAdmin } from './context/AdminContext';

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isUser, ready } = useAdmin();
  if (!ready) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <BookLoader />
      </div>
    );
  }
  if (!isAdmin && !isUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

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
              <Route path="/" element={<LandingPage />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<ProtectedRoute><Suspense fallback={PageFallback}><Home /></Suspense></ProtectedRoute>} />
                <Route path="/explore" element={<ProtectedRoute><Suspense fallback={PageFallback}><Explore /></Suspense></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><Suspense fallback={PageFallback}><Categories /></Suspense></ProtectedRoute>} />
                <Route path="/book/:id" element={<ProtectedRoute><Suspense fallback={PageFallback}><BookDetails /></Suspense></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Suspense fallback={PageFallback}><SearchResults /></Suspense></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Suspense fallback={PageFallback}><Cart /></Suspense></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Suspense fallback={PageFallback}><Checkout /></Suspense></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Suspense fallback={PageFallback}><Wishlist /></Suspense></ProtectedRoute>} />
                <Route path="/tracker" element={<ProtectedRoute><Suspense fallback={PageFallback}><ReadingTracker /></Suspense></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Suspense fallback={PageFallback}><Profile /></Suspense></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Suspense fallback={PageFallback}><Settings /></Suspense></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><Suspense fallback={PageFallback}><About /></Suspense></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><Suspense fallback={PageFallback}><Contact /></Suspense></ProtectedRoute>} />
                <Route path="/faq" element={<ProtectedRoute><Suspense fallback={PageFallback}><FAQ /></Suspense></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Suspense fallback={PageFallback}><Admin /></Suspense></ProtectedRoute>} />
                <Route path="*" element={<ProtectedRoute><Suspense fallback={PageFallback}><NotFound /></Suspense></ProtectedRoute>} />
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
