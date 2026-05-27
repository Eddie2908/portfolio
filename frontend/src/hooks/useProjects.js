import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [filters.category]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects', { params: filters });
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, refetch: fetchProjects };
}
