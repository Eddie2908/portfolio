import { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { adminService } from '@/services/admin';
import Link from 'next/link';

export default function AdminHeader({ title, onMenuClick }: { title: any; onMenuClick?: () => void }) {
  const { admin } = useAdmin();
  const initials = admin?.name
    ? admin.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    adminService.getDashboardStats()
      .then((s) => setUnread((s?.unread_messages ?? 0) + (s?.pending_testimonials ?? 0)))
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-white/5 bg-dark-950/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} title="Ouvrir le menu" className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="font-display font-semibold text-white text-lg">{title || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
          <Search size={14} className="text-white/40" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-40"
          />
        </div>

        {/* Notifications */}
        <Link
          href="/admin/messages"
          title={unread > 0 ? `${unread} message(s) non lu(s)` : 'Aucune notification'}
          className={`relative p-2 rounded-xl transition-all duration-200 group border ${unread > 0 ? 'bg-gradient-to-br from-[rgba(88,101,245,0.15)] to-[rgba(195,68,240,0.10)] border-[rgba(88,101,245,0.25)] shadow-[0_0_12px_rgba(88,101,245,0.15)]' : 'bg-white/[0.04] border-white/[0.06]'}`}
        >
          {/* Pulse ring when unread */}
          {unread > 0 && (
            <span className="absolute inset-0 rounded-xl animate-ping bg-[rgba(88,101,245,0.2)] duration-[2s]"
            />
          )}

          <Bell
            size={17}
            className={`relative z-10 transition-all duration-200 ${unread > 0 ? 'text-[#818cf8] drop-shadow-[0_0_4px_rgba(88,101,245,0.7)]' : 'text-white/45'}`}
          />

          {/* Badge */}
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-white font-bold text-[9px] bg-gradient-to-br from-[#5865f5] to-[#c344f0] shadow-[0_0_8px_rgba(88,101,245,0.6)]"
            >
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold"
          title={admin?.name || ''}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
