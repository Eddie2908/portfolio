import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, Clock, Tag, FileText } from 'lucide-react';
import { portfolioService } from '@/services/portfolio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-24 rounded-full bg-white/10" />
      <div className="h-10 w-3/4 rounded-xl bg-white/10" />
      <div className="h-4 w-1/2 rounded-full bg-white/8" />
      <div className="space-y-3 mt-8">
        {[100, 95, 88, 100, 72, 90, 80].map((w, i) => (
          <div key={i} className="h-3.5 rounded-full bg-white/6" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <FileText size={48} className="mx-auto text-white/20 mb-4" />
      <h2 className="font-display font-semibold text-xl text-white mb-2">Article introuvable</h2>
      <p className="text-white/40 text-sm mb-6">Cet article n&apos;existe pas ou a été supprimé.</p>
      <Link href="/blog" className="btn-primary text-sm px-5 py-2">Retour au blog</Link>
    </div>
  );
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const [post, setPost]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!router.isReady || !slug) return;
    setLoading(true);
    setNotFound(false);
    portfolioService.getBlogPost(slug)
      .then(setPost)
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, slug]);

  const date = post?.created_at
    ? new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const tags = Array.isArray(post?.tags) ? post.tags : [];

  return (
    <>
      <Head>
        <title>{post?.title ? `${post.title} — Blog` : 'Article — Blog'}</title>
        <meta name="description" content={post?.excerpt || ''} />
      </Head>
      <Header />

      <main className="pt-28 pb-24">
        <div className="section-container max-w-3xl">

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 dark:text-white/50 text-gray-500 hover:text-primary-400 dark:hover:text-primary-400 text-sm mb-10 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Retour au blog
          </Link>

          {loading  && <LoadingSkeleton />}
          {notFound && <NotFound />}

          {post && !loading && (
            <article>
              {/* ── Hero header ── */}
              <header className="mb-10">
                {post.category && (
                  <span className="tag mb-4 inline-block">{post.category}</span>
                )}

                <h1 className="font-display font-bold text-3xl lg:text-4xl dark:text-white text-gray-900 mb-5 leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-5 dark:text-white/40 text-gray-400 text-sm">
                  {date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />{date}
                    </span>
                  )}
                  {post.read_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />{post.read_time}
                    </span>
                  )}
                  {tags.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} />
                      {tags.join(', ')}
                    </span>
                  )}
                </div>

                {post.excerpt && (
                  <p className="mt-6 dark:text-white/60 text-gray-500 text-lg leading-relaxed border-l-2 border-primary-500/50 pl-4 italic">
                    {post.excerpt}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </header>

              {/* ── Cover image ── */}
              {post.image_url && (
                <div className="relative h-[420px] rounded-2xl overflow-hidden mb-10 border dark:border-white/8 border-gray-200 shadow-lg">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* ── Divider ── */}
              {!post.image_url && <div className="h-px dark:bg-white/8 bg-gray-200 mb-10" />}

              {/* ── Markdown body ── */}
              {post.content ? (
                <div className="article-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="dark:text-white/30 text-gray-400 text-sm italic text-center py-12">
                  Aucun contenu disponible pour cet article.
                </p>
              )}

              {/* ── Footer nav ── */}
              <div className="mt-16 pt-8 border-t dark:border-white/8 border-gray-200 flex justify-between items-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 dark:text-white/40 text-gray-400 hover:text-primary-400 dark:hover:text-primary-400 text-sm transition-colors group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Tous les articles
                </Link>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {tags.map((t) => <span key={t} className="tag text-xs">{t}</span>)}
                  </div>
                )}
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
