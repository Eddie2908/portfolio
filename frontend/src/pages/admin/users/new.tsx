import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function NewUser() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<any>();

  const onSubmit = async (data) => {
    try {
      await adminService.createUser(data);
      toast.success('Utilisateur créé avec succès');
      router.push('/admin/users');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  return (
    <AdminLayout title="Nouvel utilisateur">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Nom *</label>
            <input {...register('name', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email *</label>
            <input {...register('email', { required: true })} type="email" className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Mot de passe *</label>
            <input {...register('password', { required: true })} type="password" className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Rôle</label>
            <select {...register('role')} className="input-field">
              <option value="editor">Éditeur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" icon={<Save size={16} />}>Créer</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        </div>
      </form>
    </AdminLayout>
  );
}
