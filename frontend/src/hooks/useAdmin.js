import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}

export function useAdminProjects(page = 1) {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const fetchProjects = async () => {
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
  };

  return { projects, total, loading, refetch: fetchProjects };
}
