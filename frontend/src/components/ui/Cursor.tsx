import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Curseur custom discret : un point central + un ring qui suit avec inertie.
 * Détecte hover sur [data-cursor="..."] pour changer d'état (link / view).
 * Désactivé sur écrans tactiles.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState('default'); // default | link | view | text
  const [hidden, setHidden] = useState(true);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 220, damping: 22, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 22, mass: 0.4 });

  const variantRef = useRef('default');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setHidden(false);
    };
    const onLeave = () => setHidden(true);

    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      const v = t?.getAttribute('data-cursor');
      if (v && v !== variantRef.current) {
        variantRef.current = v;
        setVariant(v);
      } else if (!v && variantRef.current !== 'default') {
        const interactive = e.target.closest('a, button, [role="button"], input, textarea, select, label');
        const next = interactive ? 'link' : 'default';
        if (next !== variantRef.current) {
          variantRef.current = next;
          setVariant(next);
        }
      } else if (!v && variantRef.current === 'default') {
        const interactive = e.target.closest('a, button, [role="button"], input, textarea, select, label');
        if (interactive) {
          variantRef.current = 'link';
          setVariant('link');
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  const ringSize = variant === 'view' ? 64 : variant === 'link' ? 44 : 28;
  const ringBg =
    variant === 'view'
      ? 'rgba(88,101,245,0.9)'
      : variant === 'link'
      ? 'rgba(88,101,245,0.15)'
      : 'transparent';
  const ringBorder =
    variant === 'view' ? '0px' : '1px solid rgba(88,101,245,0.55)';

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: hidden ? 0 : 1, scale: variant === 'view' ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none fixed top-0 left-0 z-[100]"
      >
        <div
          style={{ transform: 'translate(-50%, -50%)' }}
          className="w-1.5 h-1.5 rounded-full bg-primary-400"
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        style={{ x: ringX, y: ringY, width: ringSize, height: ringSize }}
        animate={{
          opacity: hidden ? 0 : 1,
          backgroundColor: ringBg,
        }}
        transition={{
          width: { type: 'spring', stiffness: 380, damping: 28 },
          height: { type: 'spring', stiffness: 380, damping: 28 },
          backgroundColor: { duration: 0.25 },
          opacity: { duration: 0.2 },
        }}
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-white"
      >
        <div
          style={{
            transform: 'translate(-50%, -50%)',
            width: ringSize,
            height: ringSize,
            border: ringBorder,
            background: ringBg,
            borderRadius: '9999px',
          }}
          className="flex items-center justify-center"
        >
          {variant === 'view' && <span>View</span>}
        </div>
      </motion.div>
    </>
  );
}
