import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save, Upload, X, ImageIcon } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function EditProject() {
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    adminService.getProject(id)
      .then((p) => {
        reset({
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'fullstack',
          status: p.status || 'draft',
          demo_url: p.demo_url || '',
          github_url: p.github_url || '',
          tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
          featured: p.featured || false,
        });
        if (p.image_url) { setPreview(p.image_url); setImageUrl(p.image_url); }
      })
      .catch(() => toast.error('Impossible de charger le projet'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await adminService.uploadFile(file, 'projects');
      setImageUrl(result.url);
      toast.success('Image uploadée');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Erreur upload image');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      await adminService.updateProject(id, {
        ...data,
        tags,
        image_url: imageUrl || null,
        featured: data.featured === true || data.featured === 'true',
      });
      toast.success('Projet mis à jour');
      router.push('/admin/projects');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Erreur lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLayout title="Modifier projet"><p className="text-white/30 text-sm">Chargement...</p></AdminLayout>;
  }

  return (
    <AdminLayout title="Modifier le projet">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">

        {/* Image du projet */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Image du projet</h3>
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              {preview ? (
                <img src={preview} alt="preview" className="w-32 h-24 rounded-xl object-cover border border-white/10" />
              ) : (
                <div className="w-32 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ImageIcon size={28} className="text-white/20" />
                </div>
              )}
              {preview && (
                <button type="button" onClick={clearImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600">
                  <X size={10} className="text-white" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-white/40 text-xs">JPG, PNG, WebP recommandé — max 5 Mo</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-xs transition-colors disabled:opacity-50">
                <Upload size={13} />
                {uploading ? 'Upload en cours…' : 'Changer l\'image'}
              </button>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Informations</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Titre *</label>
            <input {...register('title', { required: 'Titre requis' })} className="input-field" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Description *</label>
            <textarea {...register('description', { required: 'Description requise' })} rows={4} className="input-field resize-none" />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Catégorie</label>
              <select {...register('category')} className="input-field">
                <option value="fullstack">Full-Stack</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Statut</label>
              <select {...register('status')} className="input-field">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Lien démo</label>
              <input {...register('demo_url')} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Lien GitHub</label>
              <input {...register('github_url')} className="input-field" placeholder="https://github.com/..." />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Tags (séparés par des virgules)</label>
            <input {...register('tags')} className="input-field" placeholder="React, Next.js, Tailwind" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('featured')} type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-white/60">Projet mis en avant (featured)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting} icon={<Save size={16} />}>Enregistrer</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        </div>
      </form>
    </AdminLayout>
  );
}
