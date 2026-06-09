import { useMemo } from 'react';
import { usePortfolioData } from '@/context/PortfolioDataContext';

/**
 * Tous les hooks délèguent au PortfolioDataContext qui prefetch en parallèle
 * une seule fois (avec cache sessionStorage stale-while-revalidate).
 * → Plus aucun refetch par section ni à chaque navigation.
 * L'API publique est conservée pour compatibilité ascendante.
 */

export function useProfile() {
  const { profile, loading } = usePortfolioData();
  return { profile, loading };
}

export function useSkills() {
  const { skills, loading } = usePortfolioData();
  return { skills, loading };
}

export function useProjects(category = null) {
  const { projects, loading } = usePortfolioData();
  const filtered = useMemo(() => {
    if (!category || category === 'all') return projects;
    return projects.filter((p) => p.category === category);
  }, [projects, category]);
  return { projects: filtered, loading };
}

export function useTestimonials() {
  const { testimonials, loading } = usePortfolioData();
  return { testimonials, loading };
}

export function useBlogPosts() {
  const { posts, loading } = usePortfolioData();
  return { posts, loading };
}
