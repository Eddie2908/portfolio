import { useRef } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Renvoie un ref à attacher au container + une motion-value `y` lissée
 * qui se déplace selon la progression de la section dans la viewport.
 *
 * @param {number} strength  amplitude max en pixels (ex: 80)
 * @returns { ref, y }
 */
export function useParallax(strength = 80) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  const y = useSpring(raw, { stiffness: 80, damping: 24, mass: 0.4 });
  return { ref, y, scrollYProgress };
}
