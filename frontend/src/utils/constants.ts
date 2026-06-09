export const SITE_NAME = 'DevPortfolio';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const NAV_LINKS = [
  { href: '/',         label: 'Accueil' },
  { href: '/about',    label: 'À propos' },
  { href: '/projects', label: 'Projets' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contact',  label: 'Contact' },
];

export const SOCIAL_LINKS = {
  github:   'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter:  'https://twitter.com',
  email:    'mailto:contact@devportfolio.fr',
};

export const PROJECT_CATEGORIES = [
  { key: 'all',       label: 'Tous' },
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'frontend',  label: 'Frontend' },
  { key: 'backend',   label: 'Backend' },
  { key: 'mobile',    label: 'Mobile' },
];

export const ADMIN_NAV = [
  { href: '/admin',              label: 'Dashboard',    icon: 'LayoutDashboard' },
  { href: '/admin/projects',     label: 'Projets',      icon: 'FolderOpen' },
  { href: '/admin/messages',     label: 'Messages',     icon: 'MessageSquare' },
  { href: '/admin/testimonials', label: 'Témoignages',  icon: 'Quote' },
  { href: '/admin/blog',         label: 'Blog',         icon: 'FileText' },
  { href: '/admin/users',        label: 'Utilisateurs', icon: 'Users' },
  { href: '/admin/settings',     label: 'Paramètres',   icon: 'Settings' },
];
