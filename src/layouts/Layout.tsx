import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Layout() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950">
      <Navbar />
      <motion.main
        key={loc.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1"
      >
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
    </div>
  );
}
