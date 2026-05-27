import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import Chart from '@/components/admin/Chart';
import { FolderOpen, MessageSquare, Eye, Users } from 'lucide-react';
import { adminService } from '@/services/admin';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'hier';
  return `il y a ${days}j`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, msgs] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getMessages(1, 5),
        ]);
        setStats(s);
        const items = Array.isArray(msgs) ? msgs : (msgs?.items || []);
        setRecentMessages(items);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Projets"
            value={loading ? '…' : String(stats?.projects ?? 0)}
            icon={FolderOpen}
            color="#5865f5"
          />
          <StatsCard
            title="Messages"
            value={loading ? '…' : String(stats?.messages ?? 0)}
            icon={MessageSquare}
            color="#c344f0"
            trendValue={stats?.unread_messages > 0 ? `${stats.unread_messages} non lus` : undefined}
          />
          <StatsCard
            title="Témoignages"
            value={loading ? '…' : String(stats?.testimonials ?? 0)}
            icon={Eye}
            color="#22c55e"
          />
          <StatsCard
            title="Utilisateurs"
            value={loading ? '…' : String(stats?.users ?? 0)}
            icon={Users}
            color="#f59e0b"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Chart title="Visites mensuelles" />
          <Chart title="Messages reçus" dataKey="messages" />
        </div>

        {/* Recent activity */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-4">Messages récents</h3>
          {loading ? (
            <p className="text-white/30 text-sm">Chargement…</p>
          ) : recentMessages.length === 0 ? (
            <p className="text-white/30 text-sm">Aucun message reçu</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${msg.status === 'unread' ? 'bg-accent-500' : 'bg-white/20'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-white/70 text-sm">
                      Message de <strong className="text-white/90">{msg.name}</strong>
                      {msg.subject ? ` — ${msg.subject}` : ''}
                    </span>
                  </div>
                  <span className="text-white/30 text-xs shrink-0">{timeAgo(msg.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
