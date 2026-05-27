import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function AdminSettings() {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    adminService.getSettings()
      .then((data) => {
        if (data) reset({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          contact_email: data.contact_email || '',
          analytics_id: data.analytics_id || '',
        });
      })
      .catch(() => toast.error('Impossible de charger les paramètres'));
  }, []);

  const onSubmit = async (data) => {
    try {
      await adminService.updateSettings(data);
      toast.success('Paramètres sauvegardés');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <AdminLayout title="Paramètres">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Général</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Nom du site</label>
            <input {...register('site_name')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Description</label>
            <textarea {...register('site_description')} rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email de contact</label>
            <input {...register('contact_email')} type="email" className="input-field" />
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Intégrations</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Google Analytics ID</label>
            <input {...register('analytics_id')} className="input-field" placeholder="G-XXXXXXXXXX" />
          </div>
        </div>

        <Button type="submit" icon={<Save size={16} />}>Sauvegarder</Button>
      </form>
    </AdminLayout>
  );
}
