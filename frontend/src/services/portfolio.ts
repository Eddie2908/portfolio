import api from './api';
import type {
  Settings,
  Project,
  Testimonial,
  BlogPost,
} from '@/types';

export const portfolioService = {
  async getProfile(): Promise<Settings> {
    const { data } = await api.get<Settings>('/profile');
    return data;
  },

  async getSkills(): Promise<any[]> {
    const { data } = await api.get('/skills');
    return data;
  },

  async getProjects(category: string | null = null): Promise<Project[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'all') params.category = category;
    const { data } = await api.get<Project[]>('/projects', { params });
    return data;
  },

  async getProject(id: string | number): Promise<Project | null> {
    try {
      const { data } = await api.get<Project>(`/projects/${id}`);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        const { data: all } = await api.get<Project[]>('/projects');
        return (all || []).find((p) => String(p.id) === String(id)) || null;
      }
      throw err;
    }
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const { data } = await api.get<Testimonial[]>('/testimonials');
    return data;
  },

  async getBlogPosts(page = 1, category: string | null = null): Promise<BlogPost[]> {
    const params: Record<string, any> = { page };
    if (category) params.category = category;
    const { data } = await api.get<BlogPost[]>('/blog', { params });
    return data;
  },

  async getBlogPost(slug: string): Promise<BlogPost> {
    const { data } = await api.get<BlogPost>(`/blog/${slug}`);
    return data;
  },
};
