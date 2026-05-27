import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '@/hooks/usePortfolio';

export default function BlogPage() {
  const { posts: POSTS } = useBlogPosts();

  return (
    <>
      <Head>
        <title>Blog — DevPortfolio</title>
        <meta name="description" content="Articles sur le développement web, React, Python et les bonnes pratiques." />
      </Head>
      <Header />
      <main className="pt-28 pb-20 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #5865f5, transparent 70%)' }} />

        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <span className="tag mb-4 inline-block">Articles</span>
            <h1 className="section-title">
              Mon <span className="gradient-text-animate">Blog</span>
            </h1>
            <p className="dark:text-white/50 text-gray-500 max-w-xl mx-auto mt-4">
              Réflexions, tutoriels et retours d&apos;expérience sur le développement web.
            </p>
          </motion.div>

          {!POSTS.length && (
            <p className="text-center dark:text-white/30 text-gray-400 text-sm py-16">Aucun article pour le moment.</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((post, i) => {
              const date = post.created_at ? new Date(post.created_at).toLocaleDateString('fr-FR') : post.date || '';
              const readTime = post.read_time || '5 min';
              const tags = post.tags || [];
              return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="glass-card-hover overflow-hidden group flex flex-col"
              >
                <div className="h-48 relative overflow-hidden dark:bg-[linear-gradient(135deg,#1a1f2e,#1e1540)] bg-[linear-gradient(135deg,#e8eaf6,#ede7f6)]">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <div className="w-20 h-20 rounded-full animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #5865f5, #c344f0)', filter: 'blur(25px)' }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {post.category && (
                    <span className="absolute top-3 left-3 tag text-[10px] uppercase tracking-wider backdrop-blur-md">{post.category}</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 dark:text-white/40 text-gray-400 text-xs mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={12} />{date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />{readTime}</span>
                  </div>
                  <h2 className="font-display font-semibold dark:text-white text-gray-900 text-lg mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="dark:text-white/55 text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0, 3).map((t) => <span key={t} className="tag text-xs">{t}</span>)}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-primary-400 hover:text-accent-400 text-sm font-medium transition-colors group/link">
                    Lire l&apos;article
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
