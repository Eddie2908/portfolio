import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function DeleteProject() {
  const router = useRouter();
  const { id } = router.query;

  const handleDelete = async () => {
    try {
      toast.success('Projet supprimé');
      router.push('/admin/projects');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <AdminLayout title="Supprimer un projet">
      <div className="max-w-md mx-auto text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <Trash2 size={28} className="text-red-400" />
          </div>
          <h2 className="font-display font-bold text-white text-xl mb-3">Confirmer la suppression</h2>
          <p className="text-white/50 mb-8">
            Êtes-vous sûr de vouloir supprimer le projet #{id} ? Cette action est irréversible.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="danger" onClick={handleDelete} icon={<Trash2 size={16} />}>
              Supprimer
            </Button>
            <Button variant="outline" onClick={() => router.back()} icon={<ArrowLeft size={16} />}>
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
