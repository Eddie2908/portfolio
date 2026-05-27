import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    try {
      const data = await adminService.getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load messages:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await adminService.deleteMessage(id);
      loadMessages();
    } catch (e) {
      alert('Erreur lors de la suppression');
    }
  }

  useEffect(() => { loadMessages(); }, []);

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'subject', label: 'Sujet' },
    {
      key: 'status', label: 'Statut',
      render: (v) => (
        <span className={`badge ${v === 'unread' ? 'badge-warning' : 'badge-success'}`}>
          {v === 'unread' ? 'Non lu' : 'Lu'}
        </span>
      ),
    },
    {
      key: 'created_at', label: 'Date',
      render: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : '-',
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Link href={`/admin/messages/${row.id}`} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <Eye size={14} />
          </Link>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        <p className="text-white/50 text-sm">{loading ? '…' : `${messages.length} messages reçus`}</p>
        {loading ? (
          <p className="text-white/30 text-sm text-center py-8">Chargement...</p>
        ) : (
          <DataTable columns={columns} data={messages} />
        )}
      </div>
    </AdminLayout>
  );
}
