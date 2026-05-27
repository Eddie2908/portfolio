import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { portfolioService } from '@/services/portfolio';

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
const TTL_MS    = 5 * 60 * 1000; // 5 min "fresh", après on refetch en arrière-plan

const EMPTY_PROFILE = {
  full_name: '', job_title: '', bio_1: '', bio_2: '', bio_3: '',
  years_experience: '', projects_count: '', fun_stat: '', fun_stat_label: '',
  location: '', phone: '', avatar_url: null, contact_email: '',
  github_url: '', linkedin_url: '', twitter_url: '',
  tech_tags: [], hero_badge_exp: '', hero_badge_projects: '',
};

const DEFAULT = {
  profile: EMPTY_PROFILE,
  skills: [],
  projects: [],
  testimonials: [],
  posts: [],
  ready: false,   // true dès qu'on a au moins servi depuis le cache OU fini le premier fetch
  loading: true,  // true tant qu'aucune donnée n'a été servie (cold start sans cache)
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

  const inFlight = useRef(false);

  const fetchAll = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const [profile, skills, projects, testimonials, posts] = await Promise.all([
        portfolioService.getProfile().catch(() => null),
        portfolioService.getSkills().catch(() => []),
        portfolioService.getProjects().catch(() => []),
        portfolioService.getTestimonials().catch(() => []),
        portfolioService.getBlogPosts(1).catch(() => []),
      ]);

      const merged = {
        profile: profile ? { ...EMPTY_PROFILE, ...profile } : EMPTY_PROFILE,
        skills:        Array.isArray(skills)       ? skills       : [],
        projects:      Array.isArray(projects)     ? projects     : [],
        testimonials:  Array.isArray(testimonials) ? testimonials : [],
        posts:         Array.isArray(posts)        ? posts        : [],
      };

      writeCache(merged);
      setData((d) => ({ ...d, ...merged, ready: true, loading: false }));
    } finally {
      inFlight.current = false;
    }
  }, []);

  // Hydratation cache + fetch ne s'exécute qu'APRÈS le premier render client.
  useEffect(() => {
    const cached = readCache();
    if (cached?.data) {
      // Sert immédiatement depuis le cache (instant).
      setData((d) => ({ ...d, ...cached.data, ready: true, loading: false }));
      // Si stale, refetch en arrière-plan (stale-while-revalidate).
      if ((Date.now() - cached.ts) > TTL_MS) {
        fetchAll();
      }
    } else {
      // Pas de cache : fetch parallèle complet.
      fetchAll();
    }
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
