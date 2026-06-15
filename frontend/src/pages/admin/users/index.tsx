import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Plus, Trash2 } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Supprimer l'utilisateur "${name}" ?`)) return;
    try {
      await adminService.deleteUser(id);
      loadUsers();
    } catch (e) {
      alert(e.response?.data?.detail || 'Erreur lors de la suppression');
    }
  }

  useEffect(() => { loadUsers(); }, []);

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle', render: (v) => <span className="tag text-xs">{v}</span> },
    {
      key: 'status', label: 'Statut',
      render: (v) => <span className={`badge ${v === 'active' ? 'badge-success' : 'badge-danger'}`}>{v === 'active' ? 'Actif' : 'Inactif'}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => handleDelete(row.id, row.name)} aria-label="Supprimer" className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Utilisateurs">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">{loading ? '…' : `${users.length} utilisateurs`}</p>
          <Link href="/admin/users/new" className="btn-primary text-sm px-4 py-2">
            <Plus size={16} /> Ajouter
          </Link>
        </div>
        {loading ? (
          <p className="text-white/30 text-sm text-center py-8">Chargement...</p>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>
    </AdminLayout>
  );
}
