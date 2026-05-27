import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      toast.success('Utilisateur mis à jour');
      router.push('/admin/users');
    } catch {
      toast.error('Erreur');
    }
  };

  return (
    <AdminLayout title={`Modifier utilisateur #${id}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Nom</label>
            <input {...register('name')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email</label>
            <input {...register('email')} type="email" className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Rôle</label>
            <select {...register('role')} className="input-field">
              <option value="editor">Éditeur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Statut</label>
            <select {...register('status')} className="input-field">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" icon={<Save size={16} />}>Enregistrer</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        </div>
      </form>
    </AdminLayout>
  );
}
