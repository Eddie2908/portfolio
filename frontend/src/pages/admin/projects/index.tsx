import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    try {
      const data = await adminService.getProjects();
      setProjects(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      console.error('Failed to load projects:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await adminService.deleteProject(id);
      loadProjects();
    } catch (e) {
      alert('Erreur lors de la suppression');
    }
  }

  useEffect(() => { loadProjects(); }, []);

  const columns = [
    { key: 'title', label: 'Titre' },
    { key: 'category', label: 'Catégorie', render: (v) => <span className="tag text-xs">{v}</span> },
    {
      key: 'status', label: 'Statut',
      render: (v) => (
        <span className={`badge ${v === 'published' ? 'badge-success' : 'badge-warning'}`}>
          {v === 'published' ? 'Publié' : 'Brouillon'}
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
          <Link href={`/admin/projects/edit/${row.id}`} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <Edit size={14} />
          </Link>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Projets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">{loading ? '…' : `${projects.length} projets au total`}</p>
          <Link href="/admin/projects/new" className="btn-primary text-sm px-4 py-2">
            <Plus size={16} /> Nouveau projet
          </Link>
        </div>
        {loading ? (
          <p className="text-white/30 text-sm text-center py-8">Chargement...</p>
        ) : (
          <DataTable columns={columns} data={projects} />
        )}
      </div>
    </AdminLayout>
  );
}
