import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Transitions de page fluides entre routes Next.js.
 * Fade + léger slide up, easing fluide. Désactivé sur les routes admin.
 */
export default function PageTransition({ children }) {
  const router = useRouter();
  const isAdmin = router.asPath.startsWith('/admin');

  if (isAdmin) return children;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.asPath}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
