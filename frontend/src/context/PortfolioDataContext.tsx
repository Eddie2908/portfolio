import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { portfolioService } from '@/services/portfolio';
import { supabase } from '@/lib/supabase';

/**
 * Centralized provider that prefetches ALL public portfolio data in parallel
 * once at app mount, caches it in sessionStorage, and exposes it via hooks
 * so child sections render instantly on subsequent navigations.
 *
 * Strategy: stale-while-revalidate.
 *  - If cache exists (TTL not expired) → return immediately, NO network.
 *  - If cache exists but stale → return cached data, refetch in background.
 *  - If no cache → fetch all endpoints in PARALLEL (Promise.all).
 */

const CACHE_KEY = 'pf_data_cache_v1';

const EMPTY_PROFILE = {
  full_name: '', job_title: '', bio_1: '', bio_2: '', bio_3: '',
  years_experience: '', projects_count: '', fun_stat: '', fun_stat_label: '',
  location: '', phone: '', avatar_url: null, contact_email: '',
  github_url: '', linkedin_url: '', twitter_url: '',
  tech_tags: [], hero_badge_exp: '', hero_badge_projects: '',
};

type PortfolioDataState = {
  profile: typeof EMPTY_PROFILE;
  skills: any[];
  projects: any[];
  testimonials: any[];
  posts: any[];
  ready: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const DEFAULT: PortfolioDataState = {
  profile: EMPTY_PROFILE,
  skills: [],
  projects: [],
  testimonials: [],
  posts: [],
  ready: false,   // true dès qu'on a au moins servi depuis le cache OU fini le premier fetch
  loading: true,  // true tant qu'aucune donnée n'a été servie (cold start sans cache)
  error: null,    // string si erreur réseau
  refresh: () => {},
};

const PortfolioDataContext = createContext(DEFAULT);

function readCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* quota / private mode → ignore */
  }
}

export function PortfolioDataProvider({ children }) {
  // IMPORTANT : on initialise toujours avec DEFAULT pour matcher le SSR.
  // Le cache sessionStorage est lu UNIQUEMENT côté client après hydratation,
  // sinon on déclenche un "Text content does not match" hydration error.
  const [data, setData] = useState(DEFAULT);

  const router = useRouter();
  const inFlight = useRef(false);

  const fetchAll = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      let profile, skills, projects, testimonials, posts;
      let usedFallback = false;

      try {
        // Try backend API first
        [profile, skills, projects, testimonials, posts] = await Promise.all([
          portfolioService.getProfile(),
          portfolioService.getSkills(),
          portfolioService.getProjects(),
          portfolioService.getTestimonials(),
          portfolioService.getBlogPosts(1),
        ]);
      } catch {
        // Backend unreachable → fallback to direct Supabase queries
        if (!supabase) {
          throw new Error('Supabase fallback unavailable');
        }

        usedFallback = true;
        console.warn('[PortfolioData] Backend API unavailable, using Supabase fallback');

        const [profileRes, skillsRes, projectsRes, testimonialsRes, postsRes] = await Promise.all([
          Promise.resolve(supabase.from('settings').select('*').eq('id', 1).single()).then(r => r.data).catch(() => null),
          Promise.resolve(supabase.from('skills').select('*').order('category').order('display_order')).then(r => {
            const groups = {};
            (r.data || []).forEach(skill => {
              const cat = skill.category;
              if (!groups[cat]) groups[cat] = { category: cat, category_color: skill.category_color, skills: [] };
              groups[cat].skills.push({ id: skill.id, name: skill.name, level: skill.level });
            });
            return Object.values(groups);
          }).catch(() => []),
          Promise.resolve(supabase.from('projects').select('*').eq('status', 'published').order('created_at', { ascending: false })).then(r => r.data || []).catch(() => []),
          Promise.resolve(supabase.from('testimonials').select('*').eq('status', 'published').order('created_at', { ascending: false })).then(r => r.data || []).catch(() => []),
          Promise.resolve(supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(20)).then(r => r.data || []).catch(() => []),
        ]);

        profile = profileRes;
        skills = skillsRes;
        projects = projectsRes;
        testimonials = testimonialsRes;
        posts = postsRes;
      }

      const merged = {
        profile: profile ? { ...EMPTY_PROFILE, ...profile } : EMPTY_PROFILE,
        skills:        Array.isArray(skills)       ? skills       : [],
        projects:      Array.isArray(projects)     ? projects     : [],
        testimonials:  Array.isArray(testimonials) ? testimonials : [],
        posts:         Array.isArray(posts)        ? posts        : [],
      };

      writeCache(merged);
      setData((d) => ({ ...d, ...merged, ready: true, loading: false, error: null }));
    } catch (err) {
      console.error('[PortfolioData] All fetch strategies failed:', err);
      setData((d) => ({ ...d, loading: false, error: 'Impossible de charger les données' }));
    } finally {
      inFlight.current = false;
    }
  }, []);

  // Hydratation cache + fetch ne s'exécute qu'APRÈS le premier render client.
  useEffect(() => {
    const cached = readCache();
    if (cached?.data) {
      // Sert immédiatement depuis le cache (instant, pas de loader).
      setData((d) => ({ ...d, ...cached.data, ready: true, loading: false }));
    }
    // Dans TOUS les cas on revalide en arrière-plan pour garantir des données
    // fraîches (stale-while-revalidate). Le cache n'est qu'un affichage instantané.
    fetchAll();
  }, [fetchAll]);

  // Revalidation en arrière-plan à CHAQUE changement de page.
  // Les données en cache restent affichées instantanément (pas de loader),
  // mais on récupère systématiquement la dernière version → plus besoin
  // d'actualiser manuellement après une navigation ou une modif admin.
  useEffect(() => {
    const handleRouteChange = () => { fetchAll(); };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, fetchAll]);

  // Revalidation quand l'onglet redevient visible (ex. retour depuis l'admin
  // ouvert dans un autre onglet, ou après modification).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchAll();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [fetchAll]);

  return (
    <PortfolioDataContext.Provider value={{ ...data, refresh: fetchAll }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
