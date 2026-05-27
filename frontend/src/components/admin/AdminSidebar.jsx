import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, FolderOpen, MessageSquare, Quote, FileText, Users, Settings, LogOut, Code2, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/context/AdminContext';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin',                       label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/admin/projects',              label: 'Projets',          icon: FolderOpen },
  { href: '/admin/messages',              label: 'Messages',         icon: MessageSquare },
  { href: '/admin/testimonials',          label: 'Témoignages',      icon: Quote },
  { href: '/admin/blog',                  label: 'Blog',             icon: FileText },
  { href: '/admin/users',                 label: 'Utilisateurs',     icon: Users },
  { href: '/admin/settings',              label: 'Paramètres',       icon: Settings },
  { href: '/admin/settings/profile',      label: 'Profil Portfolio', icon: UserCircle },
];

export default function AdminSidebar() {
  const { pathname } = useRouter();
  const { handleLogout } = useAuth();
  const { admin } = useAdmin();
  const initials = admin?.name
    ? admin.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    if (href === '/admin/settings') return pathname === '/admin/settings';
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar w-64 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">
            Admin<span className="text-primary-400">Panel</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx('admin-nav-item', isActive(href) && 'active')}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{admin?.name || 'Administrateur'}</div>
            <div className="text-white/40 text-xs capitalize truncate">{admin?.role || 'admin'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
