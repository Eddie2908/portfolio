import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function NewTestimonial() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      toast.success('Témoignage créé');
      router.push('/admin/testimonials');
    } catch {
      toast.error('Erreur');
    }
  };

  return (
    <AdminLayout title="Nouveau témoignage">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Nom *</label>
              <input {...register('name', { required: true })} className="input-field" placeholder="Nom complet" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Rôle *</label>
              <input {...register('role', { required: true })} className="input-field" placeholder="CEO, Company" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Témoignage *</label>
            <textarea {...register('text', { required: true })} rows={4} className="input-field resize-none" placeholder="Le témoignage..." />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Statut</label>
            <select {...register('status')} className="input-field">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
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
