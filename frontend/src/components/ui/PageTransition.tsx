import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

/**
 * Transitions de page fluides entre routes Next.js.
 * Fade + léger slide up. Désactivé sur les routes admin.
 *
 * NOTE: on n'utilise PAS `AnimatePresence mode="wait"` ici. Ce mode attend la
 * fin de l'animation de SORTIE de la page précédente avant de monter la
 * nouvelle ; lors d'une navigation client il pouvait rester bloqué et laisser
 * la nouvelle page invisible (page noire jusqu'à un rafraîchissement manuel).
 * À la place, le `motion.div` est keyé par la route : il se remonte et rejoue
 * son animation d'entrée à chaque navigation, sans jamais pouvoir se bloquer.
 */
export default function PageTransition({ children }) {
  const router = useRouter();
  const isAdmin = router.asPath.startsWith('/admin');

  if (isAdmin) return children;

  return (
    <motion.div
      key={router.asPath}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
