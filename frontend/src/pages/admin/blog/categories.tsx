import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const defaultCategories = [
  { id: 1, name: 'Frontend', slug: 'frontend', count: 5 },
  { id: 2, name: 'Backend', slug: 'backend', count: 3 },
  { id: 3, name: 'DevOps', slug: 'devops', count: 2 },
  { id: 4, name: 'Design', slug: 'design', count: 1 },
];

export default function BlogCategories() {
  const [categories] = useState(defaultCategories);

  return (
    <AdminLayout title="Catégories blog">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">{categories.length} catégories</p>
          <button className="btn-primary text-sm px-4 py-2">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
              <div>
                <div className="text-white font-medium text-sm">{cat.name}</div>
                <div className="text-white/40 text-xs">/{cat.slug} — {cat.count} articles</div>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
