import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAdmin } from '@/context/AdminContext';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { login, logout, admin } = useAdmin();
  const router = useRouter();

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data.token, data.user);
      toast.success('Connexion réussie');
      router.push('/admin');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
    toast.success('Déconnecté');
  };

  return { admin, loading, handleLogin, handleLogout };
}
