import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ExternalLink, Github, ArrowRight, Star } from 'lucide-react';

/**
 * Lightbox de prévisualisation rapide d'un projet.
 * S'ouvre en overlay plein écran avec backdrop blur, image héros, description,
 * tags et liens. Échap + clic backdrop pour fermer. Locke le scroll body.
 */
export default function Lightbox({ project, onClose }) {
  const open = !!project;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl dark:bg-dark-900 bg-white border dark:border-white/10 border-gray-200 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl dark:bg-white/10 bg-black/10 backdrop-blur-md border dark:border-white/10 border-gray-200 dark:text-white/80 dark:hover:text-white text-gray-700 hover:text-gray-900 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <X size={18} />
            </button>

            {/* Hero image */}
            <div
              className="relative h-64 sm:h-80 lg:h-96 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${
                  project.category === 'backend' ? '#1e1540' : '#1a1f2e'
                }, #0d0f18)`,
              }}
            >
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="w-40 h-40 rounded-full animate-pulse-slow"
                    style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)', filter: 'blur(60px)' }} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)' }}>
                    <Star size={10} className="fill-white" /> Featured
                  </span>
                )}
                {project.category && (
                  <span className="tag text-[10px] uppercase tracking-wider backdrop-blur-md">{project.category}</span>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-1">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <p className="text-white/70 text-sm">{project.subtitle}</p>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="dark:text-white/75 text-gray-700 leading-relaxed text-[15px]">
                {project.long_description || project.description}
              </p>

              {(project.tags || []).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider dark:text-white/40 text-gray-500 mb-2.5">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t dark:border-white/8 border-gray-200">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm px-5 py-2.5 group"
                  >
                    <ExternalLink size={15} className="group-hover:rotate-12 transition-transform" />
                    Voir la démo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm px-5 py-2.5 group"
                  >
                    <Github size={15} className="group-hover:scale-110 transition-transform" />
                    Code source
                  </a>
                )}
                <Link
                  href={`/projects/${project.id}`}
                  onClick={onClose}
                  className="ml-auto inline-flex items-center gap-1.5 text-primary-400 hover:text-accent-400 text-sm font-medium transition-colors group/link self-center"
                >
                  Page détaillée
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
