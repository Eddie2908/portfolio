import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReveal } from '@/hooks/useReveal';
import { Quote, Send, CheckCircle, MessageSquarePlus, X, Camera, User } from 'lucide-react';
import { useTestimonials } from '@/hooks/usePortfolio';
import api from '@/services/api';

const INPUT = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none focus:border-primary-500/50 transition-colors";

export default function Testimonials() {
  const { ref, inView } = useReveal({ threshold: 0.1 });
  const { testimonials: TESTIMONIALS } = useTestimonials();

  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState({ name: '', role: '', text: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openModal  = () => { setSent(false); setError(''); setForm({ name:'', role:'', text:'' }); setAvatarFile(null); setAvatarPreview(''); setOpen(true); };
  const closeModal = () => setOpen(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Fichier image requis (JPG, PNG, WebP).'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Image trop grande (max 2 Mo).'); return; }
    setError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.text.trim()) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setSending(true);
    setError('');
    try {
      let avatar_url = null;
      if (avatarFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', avatarFile);
        const { data } = await api.post('/testimonials/upload-avatar', fd, {
          headers: { 'Content-Type': undefined },
        });
        avatar_url = data.url;
        setUploading(false);
      }
      await api.post('/testimonials', { ...form, avatar_url });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  return (
    <section ref={ref} className="relative py-24 dark:bg-dark-900 bg-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #5865f5, transparent 70%)' }} />

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Ce qu&apos;ils disent</span>
          <h2 className="section-title">
            <span className="gradient-text">Témoignages</span>
          </h2>
        </motion.div>

        {/* Grid */}
        {!TESTIMONIALS.length && (
          <p className="text-center dark:text-white/30 text-gray-400 text-sm mb-12">Aucun témoignage disponible pour le moment.</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ id, name, role, avatar_url, text }, i) => {
            const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="glass-card-hover p-7 flex flex-col gap-4 relative group"
              >
                <div
                  className="absolute -top-4 -right-2 w-16 h-16 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
                  style={{ background: 'radial-gradient(circle, #5865f5, transparent 70%)' }}
                />
                <Quote size={32} className="text-primary-400/50 -mb-1" />
                <p className="dark:text-white/70 text-gray-600 leading-relaxed flex-1 text-[15px]">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t dark:border-white/8 border-gray-200">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ring-primary-500/20">
                    {avatar_url
                      ? <Image src={avatar_url} alt={name} width={44} height={44} className="w-full h-full object-cover" />
                      : initials}
                  </div>
                  <div>
                    <div className="dark:text-white text-gray-900 font-semibold text-sm">{name}</div>
                    <div className="dark:text-white/45 text-gray-500 text-xs">{role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trigger button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-14"
        >
          <button
            onClick={openModal}
            className="btn-primary group"
          >
            <MessageSquarePlus size={18} className="group-hover:rotate-12 transition-transform" />
            Laisser un témoignage
          </button>
        </motion.div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C360,0 1080,80 1440,20 L1440,80 L0,80 Z" fill="var(--color-bg)" />
        </svg>
      </div>

      {/* ─── Modal ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.25, type: 'spring', damping: 22, stiffness: 260 }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl"
              style={{ background: 'linear-gradient(145deg, #12141f, #0d0f18)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="p-8">
                {sent ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <CheckCircle size={52} className="text-green-400" />
                    <div>
                      <p className="text-white font-display font-semibold text-lg">Merci pour votre témoignage !</p>
                      <p className="text-white/50 text-sm mt-1">Il sera visible après validation par l&apos;administrateur.</p>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => { setSent(false); setForm({ name:'', role:'', text:'' }); setAvatarFile(null); setAvatarPreview(''); }}
                        className="px-5 py-2 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:text-white text-sm transition-colors"
                      >
                        Nouveau témoignage
                      </button>
                      <button onClick={closeModal}
                        className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-colors"
                        style={{ background: 'linear-gradient(135deg,#5865f5,#c344f0)' }}
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-white font-display font-semibold text-xl">Laisser un témoignage</h3>
                      <p className="text-white/40 text-sm mt-1">Votre avis sera publié après validation.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Avatar upload */}
                      <div className="flex items-center gap-5">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-primary-500/60 flex items-center justify-center transition-colors group flex-shrink-0"
                          style={avatarPreview ? { borderStyle: 'solid', borderColor: '#5865f5' } : {}}
                        >
                          {avatarPreview
                            ? <Image src={avatarPreview} alt="preview" fill unoptimized className="object-cover" />
                            : <User size={28} className="text-white/20 group-hover:text-white/40 transition-colors" />}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={18} className="text-white" />
                          </div>
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <div>
                          <p className="text-white/70 text-sm font-medium">Photo de profil</p>
                          <p className="text-white/30 text-xs mt-0.5">Optionnel · JPG, PNG, WebP · max 2 Mo</p>
                          {avatarPreview && (
                            <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(''); }}
                              className="mt-1.5 text-red-400/70 hover:text-red-400 text-xs transition-colors">
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Name + role */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-1.5">Nom complet *</label>
                          <input name="name" value={form.name} onChange={handleChange}
                            placeholder="Jean Dupont" className={INPUT} />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-1.5">Poste / Entreprise *</label>
                          <input name="role" value={form.role} onChange={handleChange}
                            placeholder="CEO, Acme Inc." className={INPUT} />
                        </div>
                      </div>

                      {/* Text */}
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Votre témoignage *</label>
                        <textarea name="text" value={form.text} onChange={handleChange}
                          rows={4} placeholder="Décrivez votre expérience de travail…"
                          className={`${INPUT} resize-none`} />
                      </div>

                      {error && <p className="text-red-400 text-sm">{error}</p>}

                      <div className="flex gap-3 pt-1">
                        <button type="button" onClick={closeModal}
                          className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition-colors">
                          Annuler
                        </button>
                        <button type="submit" disabled={sending || uploading}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-60"
                          style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)' }}
                        >
                          <Send size={15} />
                          {uploading ? 'Upload photo…' : sending ? 'Envoi en cours…' : 'Soumettre le témoignage'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
