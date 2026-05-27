import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, Star, Eye } from 'lucide-react';
import { useProjects } from '@/hooks/usePortfolio';
import Lightbox from '@/components/ui/Lightbox';

const CATEGORIES = [
  { key: 'all',       label: 'Tous' },
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'frontend',  label: 'Frontend' },
  { key: 'backend',   label: 'Backend' },
];

function ProjectCard({ project, i, onOpen }) {
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      whileHover={{ y: -8 }}
      className="glass-card-hover spotlight group overflow-hidden"
    >
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => onOpen?.(project)}
        data-cursor="view"
        aria-label={`Aperçu de ${project.title}`}
        className="block w-full h-52 relative overflow-hidden text-left"
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
            className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-24 h-24 rounded-full animate-pulse-slow"
              style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)', filter: 'blur(30px)' }} />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Hover label */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
            <Eye size={14} /> Aperçu
          </span>
        </div>
        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)' }}>
            <Star size={10} className="fill-white" /> Featured
          </span>
        )}
        {project.category && (
          <span className="absolute top-3 right-3 tag text-[10px] uppercase tracking-wider backdrop-blur-md">{project.category}</span>
        )}
      </button>

      {/* Content */}
      <div className="p-6 relative">
        <h3 className="font-display font-semibold dark:text-white text-gray-900 text-lg mb-2 group-hover:text-primary-400 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="dark:text-white/55 text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.tags || []).slice(0, 5).map((t) => (
            <span key={t} className="tag text-xs">{t}</span>
          ))}
        </div>

        {(project.demo_url || project.github_url) && (
          <div className="flex gap-2 pt-4 border-t dark:border-white/8 border-gray-200">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500/20 hover:border-primary-500/40 hover:text-primary-300 transition-all text-xs font-medium group/btn"
              >
                <ExternalLink size={12} className="group-hover/btn:rotate-12 transition-transform" /> Démo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg dark:bg-white/5 bg-black/5 border dark:border-white/10 border-gray-200 dark:text-white/65 dark:hover:text-white text-gray-600 hover:text-gray-900 dark:hover:bg-white/10 hover:bg-black/8 transition-all text-xs font-medium"
              >
                <Github size={12} /> GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects({ preview = false }) {
  const [active, setActive] = useState('all');
  const [openProject, setOpenProject] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { projects: allProjects } = useProjects();

  const filtered = preview
    ? allProjects.filter((p) => p.featured)
    : active === 'all'
    ? allProjects
    : allProjects.filter((p) => p.category === active);

  return (
    <section ref={ref} className="relative py-24 dark:bg-dark-950 bg-gray-50 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="tag mb-4 inline-block">Portfolio</span>
          <h2 className="section-title">
            Mes <span className="gradient-text">projets</span>
          </h2>
          <p className="dark:text-white/50 text-gray-500 max-w-xl mx-auto mt-4">
            Quelques réalisations récentes dont je suis particulièrement fier.
          </p>
        </motion.div>

        {/* Filter tabs */}
        {!preview && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 rounded-2xl dark:bg-white/5 bg-black/5 border dark:border-white/8 border-gray-200/80 max-w-fit mx-auto backdrop-blur-md">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
                  active === key
                    ? 'text-white'
                    : 'dark:text-white/55 dark:hover:text-white text-gray-500 hover:text-gray-900'
                }`}
              >
                {active === key && (
                  <motion.span
                    layoutId="project-filter-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #5865f5, #c344f0)',
                      boxShadow: '0 8px 24px -10px rgba(88,101,245,0.6)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} i={i} onOpen={setOpenProject} />
            ))}
          </AnimatePresence>
        </motion.div>

        {preview && (
          <div className="text-center mt-14">
            <Link href="/projects" className="btn-outline group">
              Voir tous les projets
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      <Lightbox project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}
