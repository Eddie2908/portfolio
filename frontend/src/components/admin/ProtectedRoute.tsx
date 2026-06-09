import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdmin } from '@/context/AdminContext';
import { PageLoader } from '@/components/ui/Loader';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/admin/login');
    }
  }, [admin, loading, router]);

  if (loading) return <PageLoader />;
  if (!admin) return null;

  return children;
}
