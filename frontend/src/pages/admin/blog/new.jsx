import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save, ImagePlus, X } from 'lucide-react';
import { adminService } from '@/services/admin';

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NewBlogPost() {
  const router = useRouter();
  const [saving, setSaving]         = useState(false);
  const [coverFile, setCoverFile]   = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const fileRef = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { status: 'draft', category: 'frontend' },
  });

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Fichier image requis'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop grande (max 5 Mo)'); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => { setCoverFile(null); setCoverPreview(''); if (fileRef.current) fileRef.current.value = ''; };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let image_url = null;
      if (coverFile) {
        const uploaded = await adminService.uploadFile(coverFile, 'blog');
        image_url = uploaded.url;
      }
      const payload = {
        ...data,
        slug: data.slug?.trim() || generateSlug(data.title),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        image_url,
      };
      await adminService.createBlogPost(payload);
      toast.success('Article créé avec succès');
      router.push('/admin/blog');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Nouvel article">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="glass-card p-6 space-y-5">

          {/* Cover image */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Image de couverture</label>
            {coverPreview ? (
              <div className="relative rounded-xl overflow-hidden h-48 group">
                <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={removeCover}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 transition-colors">
                    <X size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-white/15 hover:border-primary-500/50 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 transition-colors">
                <ImagePlus size={28} />
                <span className="text-sm">Cliquer pour ajouter une image de couverture</span>
                <span className="text-xs text-white/20">JPG, PNG, WebP · max 5 Mo</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Titre *</label>
            <input {...register('title', { required: true })} className="input-field" placeholder="Titre de l'article" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Slug</label>
            <input {...register('slug')} className="input-field" placeholder="url-de-larticle" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Extrait</label>
            <textarea {...register('excerpt')} rows={2} className="input-field resize-none" placeholder="Résumé court..." />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Contenu (Markdown) *</label>
            <textarea {...register('content', { required: true })} rows={12} className="input-field resize-none font-mono text-sm" placeholder="# Mon article..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Catégorie</label>
              <select {...register('category')} className="input-field">
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
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
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Tags (séparés par virgules)</label>
            <input {...register('tags')} className="input-field" placeholder="React, Next.js, Tutorial" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" icon={<Save size={16} />} disabled={saving}>{saving ? 'Création...' : 'Publier'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        </div>
      </form>
    </AdminLayout>
  );
}
