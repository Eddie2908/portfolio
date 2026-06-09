import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { Save, Upload, X } from 'lucide-react';
import { adminService } from '@/services/admin';

export default function AdminProfile() {
  const { register, handleSubmit, reset, watch } = useForm<any>();
  const fullName = watch('full_name', '');
  const initials = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'FK';
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, WebP…)');
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await adminService.uploadFile(file, 'portfolio');
      setAvatarUrl(result.url);
      await adminService.updateSettings({ avatar_url: result.url });
      toast.success('Photo de profil sauvegardée');
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Erreur lors de l\'upload';
      toast.error(msg);
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const clearAvatar = () => {
    setPreview('');
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    adminService.getSettings()
      .then((data) => {
        if (data) {
          if (data.avatar_url) { setPreview(data.avatar_url); setAvatarUrl(data.avatar_url); }
          reset({
          full_name: data.full_name || '',
          job_title: data.job_title || '',
          location: data.location || '',
          phone: data.phone || '',
          bio_1: data.bio_1 || '',
          bio_2: data.bio_2 || '',
          bio_3: data.bio_3 || '',
          years_experience: data.years_experience || '',
          projects_count: data.projects_count || '',
          fun_stat: data.fun_stat || '',
          fun_stat_label: data.fun_stat_label || '',
          hero_badge_exp: data.hero_badge_exp || '',
          hero_badge_projects: data.hero_badge_projects || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          tech_tags: Array.isArray(data.tech_tags) ? data.tech_tags.join(', ') : '',
        });}
      })
      .catch(() => toast.error('Impossible de charger le profil'));
  }, [reset]);

  const onSubmit = async (formData) => {
    try {
      const rawTags = formData.tech_tags || '';
      const tech_tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      await adminService.updateSettings({ ...formData, avatar_url: avatarUrl, tech_tags });
      toast.success('Profil portfolio mis à jour');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const field = (
    label: string,
    name: string,
    opts: { textarea?: boolean; rows?: number; placeholder?: string; type?: string } = {}
  ) => (
    <div>
      <label className="block text-sm text-white/60 mb-1.5">{label}</label>
      {opts.textarea
        ? <textarea {...register(name)} rows={opts.rows || 2} className="input-field resize-none" placeholder={opts.placeholder} />
        : <input {...register(name)} type={opts.type || 'text'} className="input-field" placeholder={opts.placeholder} />
      }
    </div>
  );

  return (
    <AdminLayout title="Profil Portfolio">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">

        {/* Identité */}
        <div className="glass-card p-6 space-y-5">
          {/* Avatar upload */}
          <div className="flex items-center gap-5 pb-4 border-b border-white/8">
            <div className="relative shrink-0">
              {preview ? (
                <Image
                  src={preview}
                  alt="avatar"
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 rounded-xl object-cover border-2 border-white/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
              {preview && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={10} className="text-white" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold">{fullName || 'Nom complet'}</div>
              <div className="text-white/40 text-sm">Profil public du portfolio</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-xs transition-colors disabled:opacity-50"
              >
                <Upload size={13} />
                {uploading ? 'Upload en cours…' : 'Choisir une photo'}
              </button>
              {avatarUrl && !preview && (
                <p className="text-white/30 text-xs truncate max-w-[200px]">{avatarUrl}</p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Nom complet', 'full_name', { placeholder: 'Franck Eddie KEMTA' })}
            {field('Titre / Poste', 'job_title', { placeholder: 'Développeur Full-Stack · React · FastAPI' })}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Localisation', 'location', { placeholder: 'Yaoundé, Cameroun' })}
            {field('Téléphone', 'phone', { placeholder: '+237 6 99 99 58 32' })}
          </div>
        </div>

        {/* Biographies */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Biographies</h3>
          {field('Biographie 1', 'bio_1', { textarea: true, placeholder: 'Présentation principale...' })}
          {field('Biographie 2', 'bio_2', { textarea: true, placeholder: 'Spécialités techniques...' })}
          {field('Biographie 3', 'bio_3', { textarea: true, placeholder: 'Veille technologique...' })}
        </div>

        {/* Statistiques & Hero */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Statistiques &amp; Hero</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Années d’expérience', 'years_experience', { placeholder: '3+' })}
            {field('Nombre de projets', 'projects_count', { placeholder: '20+' })}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Stat fun (valeur)', 'fun_stat', { placeholder: '∞' })}
            {field('Stat fun (label)', 'fun_stat_label', { placeholder: 'Cafés bus' })}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Badge Hero — Expérience', 'hero_badge_exp', { placeholder: '3+ ans d’expérience' })}
            {field('Badge Hero — Projets', 'hero_badge_projects', { placeholder: '20+ projets livrés' })}
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Réseaux sociaux</h3>
          {field('GitHub URL', 'github_url', { type: 'url', placeholder: 'https://github.com/username' })}
          {field('LinkedIn URL', 'linkedin_url', { type: 'url', placeholder: 'https://linkedin.com/in/username' })}
          {field('Twitter / X URL', 'twitter_url', { type: 'url', placeholder: 'https://twitter.com/username' })}
        </div>

        {/* Technologies */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-white font-semibold border-b border-white/8 pb-3">Technologies (tags)</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Tags séparés par des virgules</label>
            <input {...register('tech_tags')} className="input-field" placeholder="React, Next.js, TypeScript, Python, FastAPI" />
            <p className="text-white/30 text-xs mt-1">Ex : React, Next.js, TypeScript, Python, FastAPI, PostgreSQL</p>
          </div>
        </div>

        <Button type="submit" icon={<Save size={16} />}>Sauvegarder le profil</Button>
      </form>
    </AdminLayout>
  );
}
