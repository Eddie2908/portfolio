import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

type ProjectFilters = {
  category?: string;
};

type RequestError = {
  message?: string;
};

export function useProjects(filters: ProjectFilters = {}) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects', { params: { category: filters.category } });
      setProjects(data);
    } catch (err) {
      const error = err as RequestError;
      setError(error.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [filters.category]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
