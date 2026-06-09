import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/admin';

export function useAdminStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}

export function useAdminProjects(page = 1) {
  const [projects, setProjects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getProjects(page);
      setProjects(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, total, loading, refetch: fetchProjects };
}
