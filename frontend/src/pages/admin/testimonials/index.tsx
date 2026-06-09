import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { Check, X, Trash2, Clock, Globe } from 'lucide-react';
import { adminService } from '@/services/admin';
import toast from 'react-hot-toast';

const STATUS_LABEL = {
  pending:   { label: 'En attente', cls: 'badge-warning' },
  published: { label: 'Publié',     cls: 'badge-success' },
  rejected:  { label: 'Rejeté',     cls: 'badge-error'   },
  draft:     { label: 'Brouillon',  cls: 'badge-warning' },
};

export default function AdminTestimonials() {
  const [all, setAll]       = useState<any[]>([]);
  const [tab, setTab]       = useState('pending');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminService.getTestimonials();
      setAll(Array.isArray(data?.items) ? data.items : []);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id) {
    try {
      await adminService.approveTestimonial(id);
      toast.success('Témoignage publié');
      load();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
  }

  async function handleReject(id) {
    try {
      await adminService.rejectTestimonial(id);
      toast.success('Témoignage rejeté');
      load();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer définitivement ce témoignage ?')) return;
    try {
      await adminService.deleteTestimonial(id);
      toast.success('Supprimé');
      load();
    } catch { toast.error('Erreur suppression'); }
  }

  const pending   = all.filter(t => t.status === 'pending');
  const displayed = tab === 'pending' ? pending : all;

  return (
    <AdminLayout title="Témoignages">
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 w-fit">
          <button
            onClick={() => setTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'pending' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Clock size={14} /> En attente
            {pending.length > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#5865f5,#c344f0)' }}>
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Globe size={14} /> Tous ({all.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-white/30 text-sm text-center py-8">Chargement...</p>
        ) : displayed.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-12">
            {tab === 'pending' ? 'Aucun témoignage en attente de validation.' : 'Aucun témoignage.'}
          </p>
        ) : (
          <div className="space-y-4">
            {displayed.map((t) => {
              const s = STATUS_LABEL[t.status] || STATUS_LABEL.draft;
              const initials = t.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';
              return (
                <div key={t.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar + info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden ring-2 ring-white/10">
                      {t.avatar_url
                        ? <Image src={t.avatar_url} alt={t.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                        : initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">{t.name}</span>
                        <span className="text-white/40 text-xs">{t.role}</span>
                        <span className={`badge ${s.cls} text-xs`}>{s.label}</span>
                      </div>
                      <p className="dark:text-white/60 text-gray-500 text-sm mt-1 leading-relaxed line-clamp-3">{t.text}</p>
                      {t.created_at && (
                        <p className="text-white/25 text-xs mt-1">
                          {new Date(t.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {t.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(t.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-medium transition-colors">
                          <Check size={13} /> Approuver
                        </button>
                        <button onClick={() => handleReject(t.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-xs font-medium transition-colors">
                          <X size={13} /> Rejeter
                        </button>
                      </>
                    )}
                    {t.status === 'published' && (
                      <button onClick={() => handleReject(t.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-xs font-medium transition-colors">
                        <X size={13} /> Dépublier
                      </button>
                    )}
                    {t.status === 'rejected' && (
                      <button onClick={() => handleApprove(t.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-medium transition-colors">
                        <Check size={13} /> Approuver
                      </button>
                    )}
                    <button onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
