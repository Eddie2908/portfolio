import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Remplaçant robuste de `useInView` pour les animations d'apparition.
 *
 * Problème résolu : lors d'une navigation client à travers `PageTransition`
 * (framer-motion `AnimatePresence` + transform), l'IntersectionObserver ne
 * déclenche pas toujours son callback initial, laissant le contenu bloqué à
 * `opacity: 0` jusqu'à un rafraîchissement manuel.
 *
 * Stratégie :
 *  - Comportement normal : révèle dès que l'observer signale l'intersection
 *    (l'animation au scroll est donc préservée pour le contenu sous la ligne
 *    de flottaison).
 *  - Filet de sécurité : peu après le montage, si l'élément est RÉELLEMENT
 *    dans le viewport mais que l'observer ne s'est pas déclenché, on révèle
 *    quand même → le contenu n'apparaît jamais bloqué après une navigation.
 *
 * API identique à `useInView` : retourne `{ ref, inView }`.
 */
export function useReveal(options: Record<string, any> = {}) {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  });

  const nodeRef = useRef<Element | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Ref combinée : alimente à la fois l'observer et notre noeud local.
  const setRefs = useCallback(
    (node: Element | null) => {
      nodeRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    if (inView) setRevealed(true);
  }, [inView]);

  useEffect(() => {
    if (revealed) return;
    const el = nodeRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setRevealed(true);
        return;
      }
    }
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, [revealed]);

  return { ref: setRefs, inView: revealed };
}
