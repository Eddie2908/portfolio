import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function AdminSEO() {
  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => {
    adminService.getSettings()
      .then((data) => {
        if (data) reset({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          og_image: data.og_image || '',
        });
      })
      .catch(() => toast.error('Impossible de charger les données SEO'));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await adminService.updateSettings(data);
      toast.success('SEO mis à jour');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <AdminLayout title="SEO & Métadonnées">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Métadonnées globales</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Titre meta</label>
            <input {...register('meta_title')} className="input-field" placeholder="DevPortfolio — Développeur Full-Stack" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Description meta</label>
            <textarea {...register('meta_description')} rows={3} className="input-field resize-none" placeholder="Description affichée dans les résultats de recherche..." />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Image OG (URL)</label>
            <input {...register('og_image')} className="input-field" placeholder="https://..." />
          </div>
        </div>
        <Button type="submit" icon={<Save size={16} />}>Sauvegarder SEO</Button>
      </form>
    </AdminLayout>
  );
}
