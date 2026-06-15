import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Calendar, Mail, Trash2 } from 'lucide-react';
import { contactService } from '@/services/contact';
import toast from 'react-hot-toast';

export default function MessageDetail() {
  const router = useRouter();
  const { id } = router.query;
  const msgId = Array.isArray(id) ? id[0] : id;
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !msgId) return;
    setLoading(true);
    setMessage(null);
    contactService.getMessage(msgId)
      .then(async (data) => {
        setMessage(data);
        if (data?.status === 'unread') {
          contactService.markAsRead(msgId).catch(() => {});
        }
      })
      .catch((e) => toast.error(e?.response?.data?.detail || e?.message || 'Impossible de charger le message'))
      .finally(() => setLoading(false));
  }, [router.isReady, msgId]);

  async function handleDelete() {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await contactService.deleteMessage(msgId!);
      toast.success('Message supprimé');
      router.push('/admin/messages');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  }

  const initials = message?.name
    ? message.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <AdminLayout title="Détail du message">
      <div className="max-w-2xl">
        <Link href="/admin/messages" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour aux messages
        </Link>

        {loading ? (
          <p className="text-white/30 text-sm">Chargement...</p>
        ) : !message ? (
          <p className="text-white/40 text-sm">Message introuvable.</p>
        ) : (
          <div className="glass-card p-8 space-y-6">
            {/* En-tête expéditeur */}
            <div className="flex items-center justify-between pb-6 border-b border-white/8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
                <div>
                  <h2 className="font-semibold text-white">{message.name}</h2>
                  <p className="text-white/40 text-sm flex items-center gap-1">
                    <Mail size={12} />{message.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Corps */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Calendar size={13} />
                {message.created_at
                  ? new Date(message.created_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
                  : '-'}
              </div>
              <h3 className="text-white font-semibold text-lg">{message.subject}</h3>
              <p className="text-white/65 leading-relaxed whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
