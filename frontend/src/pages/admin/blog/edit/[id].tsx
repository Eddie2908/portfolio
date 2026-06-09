import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save, ImagePlus, X } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [coverFile, setCoverFile]     = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [removedCover, setRemovedCover] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => {
    if (!router.isReady || !id) return;
    adminService.getBlogPost(id)
      .then((post) => {
        reset({
          ...post,
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        });
        if (post.image_url) setCoverPreview(post.image_url);
      })
      .catch((e) => toast.error(e?.response?.data?.detail || 'Impossible de charger l\'article'))
      .finally(() => setLoading(false));
  }, [router.isReady, id, reset]);

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Fichier image requis'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop grande (max 5 Mo)'); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setRemovedCover(false);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview('');
    setRemovedCover(true);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let image_url = removedCover ? null : undefined;
      if (coverFile) {
        const uploaded = await adminService.uploadFile(coverFile, 'blog');
        image_url = uploaded.url;
      }
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        ...(image_url !== undefined ? { image_url } : {}),
      };
      await adminService.updateBlogPost(id, payload);
      toast.success('Article mis à jour');
      router.push('/admin/blog');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Modifier article">
        <p className="text-white/30 text-sm">Chargement...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Modifier article">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="glass-card p-6 space-y-5">

          {/* Cover image */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Image de couverture</label>
            {coverPreview ? (
              <div className="relative rounded-xl overflow-hidden h-48 group">
                <Image src={coverPreview} alt="cover" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/80 text-white text-sm font-medium hover:bg-primary-500 transition-colors">
                    <ImagePlus size={14} /> Changer
                  </button>
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
            <input {...register('title', { required: true })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Slug</label>
            <input {...register('slug')} className="input-field" placeholder="url-de-larticle" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Extrait</label>
            <textarea {...register('excerpt')} rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Contenu (Markdown) *</label>
            <textarea {...register('content', { required: true })} rows={12} className="input-field resize-none font-mono text-sm" />
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
          <Button type="submit" icon={<Save size={16} />} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        </div>
      </form>
    </AdminLayout>
  );
}
