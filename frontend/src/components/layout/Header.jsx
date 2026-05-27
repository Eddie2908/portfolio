import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Code2, Sun, Moon } from 'lucide-react';
import Navigation from './Navigation';
import { useTheme } from '@/context/ThemeContext';
import Magnetic from '@/components/ui/Magnetic';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? 'dark:bg-dark-950/70 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b dark:border-white/8 border-gray-200/80 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary"
            >
              <Code2 size={18} className="text-white relative z-10" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            <span className="font-display font-bold dark:text-white text-gray-900 text-lg tracking-tight">
              Dev<span className="gradient-text">Portfolio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <Navigation className="hidden lg:flex" />

          <div className="flex items-center gap-2">
            {/* CTA */}
            <Magnetic strength={0.25} className="hidden lg:inline-flex">
              <Link
                href="/contact"
                className="btn-primary text-sm px-5 py-2.5"
              >
                Me contacter
              </Link>
            </Magnetic>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl border dark:border-white/10 border-gray-200 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/8 text-gray-600 hover:text-gray-900 hover:bg-black/5 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden p-2.5 rounded-xl border dark:border-white/10 border-gray-200 dark:text-white/70 dark:hover:text-white text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'x' : 'm'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden dark:bg-dark-950/95 bg-white/95 backdrop-blur-xl border-b dark:border-white/8 border-gray-200"
          >
            <div className="section-container py-5">
              <Navigation mobile onNavigate={() => setMobileOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Link
                  href="/contact"
                  className="btn-primary w-full justify-center mt-4 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Me contacter
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
