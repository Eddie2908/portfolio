import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (server unreachable)
    if (!error.response) {
      console.error('[API] Network error:', error.message);
      return Promise.reject(new Error('Impossible de contacter le serveur'));
    }

    const { status } = error.response;

    // Unauthorized — clear token and redirect admin pages
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }

    // Rate limited
    if (status === 429) {
      return Promise.reject(new Error('Trop de requêtes. Réessayez dans un instant.'));
    }

    return Promise.reject(error);
  }
);

export default api;
