import { useRef } from 'react';
import Image from 'next/image';
import type { MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Download, Github, Linkedin, ChevronDown } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { useProfile } from '@/hooks/usePortfolio';
import Magnetic from '@/components/ui/Magnetic';

export default function Hero() {
  const { profile } = useProfile();
  const initials = (profile.full_name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'FK';

  // Mouse parallax (subtle)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.4 });
  const orb1X = useTransform(sx, (v) => v * 30);
  const orb1Y = useTransform(sy, (v) => v * 30);
  const orb2X = useTransform(sx, (v) => v * -25);
  const orb2Y = useTransform(sy, (v) => v * -25);
  const avatarRX = useTransform(sy, (v) => v * -6);
  const avatarRY = useTransform(sx, (v) => v * 6);

  const sectionRef = useRef<HTMLElement | null>(null);
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      className="relative min-h-screen flex items-center overflow-hidden dark:bg-hero-gradient bg-[linear-gradient(135deg,#f8faff_0%,#eef2ff_40%,#f5f3ff_100%)] bg-grid noise"
    >
      {/* Mesh blobs */}
      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute top-[15%] left-[15%] w-[480px] h-[480px] rounded-full opacity-25 blur-3xl animate-blob pointer-events-none"
      >
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, #5865f5, transparent 70%)' }} />
      </motion.div>
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute bottom-[15%] right-[10%] w-[420px] h-[420px] rounded-full opacity-20 blur-3xl animate-blob pointer-events-none"
      >
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, #c344f0, transparent 70%)', animationDelay: '4s' }} />
      </motion.div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7a91fa, transparent 70%)' }}
      />

      <div className="section-container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-md"
              style={{
                background: 'rgba(88,101,245,0.10)',
                border: '1px solid rgba(88,101,245,0.25)',
                color: '#a4b9fd',
                boxShadow: '0 4px 16px -8px rgba(88,101,245,0.3)',
              }}
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-green-400" />
              </span>
              Disponible pour des missions
            </motion.span>

            <h1 className="section-title leading-[1.1] mb-4 text-balance">
              Bonjour, je suis{' '}
              <span className="gradient-text-animate">{profile.full_name}</span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-display font-semibold dark:text-white/70 text-gray-600 mb-6 h-10">
              <TypeAnimation
                sequence={[
                  'Développeur Full-Stack', 2000,
                  'UI/UX Enthusiast', 2000,
                  'React & Next.js Dev', 2000,
                  // 'Problem Solver', 2000,
                ]}
                wrapper="span"
                cursor
                repeat={Infinity}
              />
            </h2>

            {profile.bio_1 && (
              <p className="dark:text-white/60 text-gray-600 text-lg leading-relaxed max-w-lg mb-8">
                {profile.bio_1}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Magnetic strength={0.3}>
                <Link href="/projects" className="btn-primary group">
                  Voir mes projets
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="/assets/cv.pdf"
                  download
                  className="btn-outline group"
                >
                  <Download size={18} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Télécharger CV
                </a>
              </Magnetic>
            </div>

            {/* Socials */}
            {(profile.github_url || profile.linkedin_url) && (
            <div className="flex items-center gap-3 mt-8">
              <span className="dark:text-white/30 text-gray-400 text-sm">Me retrouver :</span>
              {[
                { icon: Github,   href: profile.github_url,   label: 'GitHub' },
                { icon: Linkedin, href: profile.linkedin_url, label: 'LinkedIn' },
              ].filter(s => s.href).map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-white/60 backdrop-blur-md flex items-center justify-center dark:text-white/60 dark:hover:text-white text-gray-500 hover:text-gray-900 hover:border-primary-500/50 hover:bg-primary-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            )}
          </motion.div>

          {/* Avatar card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-center perspective-1000"
          >
            <motion.div
              style={{ rotateX: avatarRX, rotateY: avatarRY, transformStyle: 'preserve-3d' }}
              className="relative"
            >
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, #5865f5 25%, transparent 50%, #c344f0 75%, transparent 100%)',
                  filter: 'blur(2px)',
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-6 rounded-full opacity-40"
                style={{
                  background: 'conic-gradient(from 90deg, transparent 60%, rgba(195,68,240,0.4) 80%, transparent 100%)',
                  filter: 'blur(8px)',
                }}
              />
              <div
                className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1a1f2e, #2a2050)',
                  border: '3px solid transparent',
                  boxShadow: '0 0 80px rgba(88,101,245,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                {/* Avatar */}
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mx-auto mb-3 flex items-center justify-center text-4xl font-bold text-white">
                      {initials}
                    </div>
                    <p className="dark:text-white/60 text-gray-500 text-sm">{profile.full_name}</p>
                    <p className="dark:text-white/30 text-gray-400 text-xs">{profile.job_title?.split('·')[0]?.trim()}</p>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              {profile.hero_badge_exp && (
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass-card px-3 py-2 text-xs font-semibold dark:text-white text-gray-900 shadow-card"
              >
                {profile.hero_badge_exp}
              </motion.div>
              )}
              {profile.hero_badge_projects && (
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 glass-card px-3 py-2 text-xs font-semibold dark:text-white text-gray-900 shadow-card"
              >
                {profile.hero_badge_projects}
              </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden sm:flex absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 dark:text-white/40 text-gray-400 hover:text-primary-400 transition-colors group"
        aria-label="Défiler vers le bas"
      >
        <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border dark:border-white/15 border-gray-300 flex justify-center pt-1.5"
        >
          <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
        </motion.div>
      </motion.a>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z"
            fill="var(--color-bg)"
          />
        </svg>
      </div>
    </section>
  );
}
