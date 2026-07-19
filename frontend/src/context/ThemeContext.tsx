import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }) {
  // Default matches the server-rendered <html> class (see _document.tsx) so
  // hydration doesn't mismatch. The inline script there already applied the
  // correct class to <html> before hydration (avoiding a page-wide flash of
  // the wrong theme) — here we just mirror that into React state once mounted,
  // instead of re-deriving it from localStorage.
  const [theme, setTheme] = useState<Theme>('dark');
  const { pathname } = useRouter();
  // The admin dashboard (admin.css / AdminLayout) has its own always-dark
  // design and never got light-mode styling — it doesn't follow the public
  // site's toggle. Mirrors the same route check as the inline script in
  // _document.tsx, which handles the initial/full-reload case; this effect
  // covers client-side (Next.js Link) navigation between the two.
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      return;
    }
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', isDark);
    setTheme(isDark ? 'dark' : 'light');
  }, [isAdminRoute]);

  const toggleTheme = () => {
    if (isAdminRoute) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
