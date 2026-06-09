import { createContext, useContext, useState, useEffect } from 'react';

type AdminUser = {
  token: string;
  name?: string;
  email?: string;
  role?: string;
};

type AdminContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  login: (token: string, user: Omit<AdminUser, 'token'>) => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userRaw = localStorage.getItem('admin_user');
    if (token) {
      const user = userRaw ? JSON.parse(userRaw) : {};
      setAdmin({ token, ...user });
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAdmin({ token, ...user });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
