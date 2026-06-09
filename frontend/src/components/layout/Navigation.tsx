import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/',           label: 'Accueil' },
  { href: '/about',      label: 'À propos' },
  { href: '/projects',   label: 'Projets' },
  { href: '/blog',       label: 'Blog' },
  { href: '/contact',    label: 'Contact' },
];

type NavigationProps = {
  className?: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function Navigation({ className, mobile = false, onNavigate }: NavigationProps) {
  const { pathname } = useRouter();

  return (
    <nav
      className={clsx(
        mobile ? 'flex flex-col gap-1' : 'flex items-center gap-1',
        className
      )}
    >
      {navLinks.map(({ href, label }, i) => {
        const active = pathname === href;
        return (
          <motion.div
            key={href}
            initial={mobile ? { opacity: 0, x: -16 } : false}
            animate={mobile ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={mobile ? 'w-full' : ''}
          >
            <Link
              href={href}
              onClick={onNavigate}
              className={clsx(
                'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 inline-flex items-center',
                active
                  ? 'dark:text-white text-gray-900'
                  : 'dark:text-white/60 dark:hover:text-white text-gray-500 hover:text-gray-900',
                mobile && 'w-full'
              )}
            >
              {active && (
                <motion.span
                  layoutId={mobile ? 'nav-active-mobile' : 'nav-active-desktop'}
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(88,101,245,0.18), rgba(195,68,240,0.12))',
                    border: '1px solid rgba(88,101,245,0.28)',
                    boxShadow: '0 4px 16px -8px rgba(88,101,245,0.4)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
