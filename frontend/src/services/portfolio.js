import api from './api';

export const portfolioService = {
  async getProfile() {
    const { data } = await api.get('/profile');
    return data;
  },

  async getSkills() {
    const { data } = await api.get('/skills');
    return data;
  },

  async getProjects(category = null) {
    const params = {};
    if (category && category !== 'all') params.category = category;
    const { data } = await api.get('/projects', { params });
    return data;
  },

  async getProject(id) {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return data;
    } catch (err) {
      // Fallback : récupère la liste et filtre client-side
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        const { data: all } = await api.get('/projects');
        return (all || []).find((p) => String(p.id) === String(id)) || null;
      }
      throw err;
    }
  },

  async getTestimonials() {
    const { data } = await api.get('/testimonials');
    return data;
  },

  async getBlogPosts(page = 1, category = null) {
    const params = { page };
    if (category) params.category = category;
    const { data } = await api.get('/blog', { params });
    return data;
  },

  async getBlogPost(slug) {
    const { data } = await api.get(`/blog/${slug}`);
    return data;
  },
};
