import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Magnetic from '@/components/ui/Magnetic';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Folder, FileText } from 'lucide-react';
import { portfolioService } from '@/services/portfolio';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 lg:h-96 rounded-2xl dark:bg-white/5 bg-black/5" />
      <div className="h-8 w-3/4 rounded-xl dark:bg-white/8 bg-black/8" />
      <div className="h-4 w-1/3 rounded-full dark:bg-white/6 bg-black/6" />
      <div className="space-y-3 mt-6">
        {[100, 95, 88, 80, 92].map((w, i) => (
          <div key={i} className="h-3.5 rounded-full dark:bg-white/6 bg-black/6" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-24">
      <FileText size={56} className="mx-auto dark:text-white/20 text-gray-300 mb-4" />
      <h2 className="font-display font-semibold text-2xl dark:text-white text-gray-900 mb-2">Projet introuvable</h2>
      <p className="dark:text-white/40 text-gray-500 text-sm mb-8">Ce projet n&apos;existe pas ou a été supprimé.</p>
      <Link href="/projects" className="btn-primary text-sm px-5 py-2.5">
        <ArrowLeft size={16} /> Retour aux projets
      </Link>
    </div>
  );
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!router.isReady || !id) return;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    portfolioService.getProject(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setProject(data);
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, id]);

  const images = (() => {
    if (!project) return [];
    if (Array.isArray(project.gallery) && project.gallery.length > 0) return project.gallery;
    if (Array.isArray(project.images) && project.images.length > 0) return project.images;
    return project.image_url ? [project.image_url] : [];
  })();

  const date = project?.created_at
    ? new Date(project.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <Head>
        <title>{project?.title ? `${project.title} — Projets` : 'Projet — DevPortfolio'}</title>
        <meta name="description" content={project?.description || ''} />
      </Head>
      <Header />

      <main className="pt-28 pb-24 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #5865f5, transparent 70%)' }} />

        <div className="section-container relative max-w-5xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 dark:text-white/50 text-gray-500 hover:text-primary-400 dark:hover:text-primary-400 text-sm mb-10 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Retour aux projets
          </Link>

          {loading  && <LoadingSkeleton />}
          {notFound && <NotFound />}

          {project && !loading && (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero image / gallery */}
              <div className="mb-10">
                <div
                  className="relative h-72 sm:h-96 lg:h-[460px] rounded-2xl overflow-hidden border dark:border-white/8 border-gray-200 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${
                      project.category === 'backend' ? '#1e1540' : '#1a1f2e'
                    }, #0d0f18)`,
                  }}
                >
                  {images[activeImage] ? (
                    <motion.img
                      key={activeImage}
                      src={images[activeImage]}
                      alt={project.title}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="w-48 h-48 rounded-full animate-pulse-slow"
                        style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)', filter: 'blur(60px)' }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {project.category && (
                    <span className="absolute top-4 left-4 tag text-[10px] uppercase tracking-wider backdrop-blur-md">
                      <Folder size={11} className="inline mr-1" />{project.category}
                    </span>
                  )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        data-cursor="link"
                        className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          activeImage === i
                            ? 'border-primary-500 shadow-glow-primary'
                            : 'dark:border-white/10 border-gray-200 hover:border-primary-500/40 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image src={src} alt={`${project.title} ${i + 1}`} fill sizes="96px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Header */}
              <header className="mb-10">
                <h1 className="font-display font-bold text-3xl lg:text-5xl dark:text-white text-gray-900 mb-4 leading-[1.1] text-balance">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="dark:text-white/60 text-gray-600 text-lg mb-5">{project.subtitle}</p>
                )}
                <div className="flex flex-wrap items-center gap-5 dark:text-white/40 text-gray-400 text-sm">
                  {date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />{date}
                    </span>
                  )}
                  {(project.tags || []).length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} />{project.tags.length} technologie{project.tags.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </header>

              {/* Description */}
              <div className="dark:text-white/75 text-gray-700 leading-[1.85] text-[16px] space-y-4 mb-10">
                {(project.long_description || project.description || '').split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Tags */}
              {(project.tags || []).length > 0 && (
                <div className="mb-10">
                  <h4 className="text-xs font-semibold uppercase tracking-wider dark:text-white/40 text-gray-500 mb-3">
                    Technologies utilisées
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-8 border-t dark:border-white/8 border-gray-200">
                {project.demo_url && (
                  <Magnetic strength={0.25}>
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm px-5 py-2.5 group"
                    >
                      <ExternalLink size={15} className="group-hover:rotate-12 transition-transform" />
                      Voir la démo
                    </a>
                  </Magnetic>
                )}
                {project.github_url && (
                  <Magnetic strength={0.25}>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm px-5 py-2.5 group"
                    >
                      <Github size={15} className="group-hover:scale-110 transition-transform" />
                      Code source
                    </a>
                  </Magnetic>
                )}
                <Link
                  href="/projects"
                  className="ml-auto inline-flex items-center gap-1.5 dark:text-white/50 text-gray-500 hover:text-primary-400 dark:hover:text-primary-400 text-sm font-medium transition-colors group/link self-center"
                >
                  <ArrowLeft size={14} className="group-hover/link:-translate-x-1 transition-transform" />
                  Tous les projets
                </Link>
              </div>
            </motion.article>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
