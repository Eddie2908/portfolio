import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Code2, Heart, ArrowUp } from 'lucide-react';

const socials = [
  { icon: Github,   href: 'https://github.com/Eddie2908',   label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/eddie-franck-kemta-9a0474395',  label: 'LinkedIn' },
  { icon: Twitter,  href: 'https://twitter.com',   label: 'Twitter' },
  { icon: Mail,     href: 'mailto:kemtaeddie@gmail.com', label: 'Email' },
];

const footerLinks = [
  { group: 'Navigation', links: [
    { label: 'Accueil',  href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Projets',  href: '/projects' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Contact',  href: '/contact' },
  ]},
  { group: 'Ressources', links: [
    { label: 'CV / Resume', href: '/assets/cv.pdf', external: true },
    { label: 'Admin',       href: '/admin' },
  ]},
];

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTop = () => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative dark:bg-dark-950 bg-gray-50 border-t dark:border-white/5 border-gray-200 overflow-hidden">
      {/* Animated top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #5865f5, #c344f0, transparent)' }}
      />
      {/* Soft glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #5865f5, transparent 70%)' }} />

      <div className="section-container py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary"
              >
                <Code2 size={18} className="text-white" />
              </motion.div>
              <span className="font-display font-bold dark:text-white text-gray-900 text-lg">
                Dev<span className="gradient-text">Portfolio</span>
              </span>
            </Link>
            <p className="dark:text-white/50 text-gray-500 text-sm leading-relaxed max-w-xs">
              Développeur passionné par la création d&apos;interfaces modernes et d&apos;expériences utilisateur exceptionnelles.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl dark:bg-white/5 dark:border-white/8 bg-white/60 border border-gray-200 backdrop-blur-md flex items-center justify-center dark:text-white/55 dark:hover:text-white text-gray-500 hover:text-white hover:border-transparent hover:shadow-glow-primary hover:-translate-y-0.5 transition-all duration-300 hover:bg-gradient-to-br hover:from-primary-500 hover:to-accent-500"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(({ group, links }) => (
            <div key={group}>
              <h4 className="dark:text-white text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wider">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href, external }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="link-underline dark:text-white/55 dark:hover:text-white text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-14 pt-8 border-t dark:border-white/5 border-gray-200 gap-4">
          <p className="dark:text-white/35 text-gray-400 text-sm flex items-center gap-1.5">
            &copy; {year} DevPortfolio.
          </p>

          <button
            onClick={scrollTop}
            aria-label="Retour en haut"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-white/5 bg-white/60 border dark:border-white/8 border-gray-200 dark:text-white/55 dark:hover:text-white text-gray-500 hover:text-gray-900 backdrop-blur-md hover:border-primary-500/40 hover:bg-primary-500/10 transition-all duration-300 text-xs font-medium"
          >
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            Retour en haut
          </button>
        </div>
      </div>
    </footer>
  );
}
