import api from './api';
import type {
  Project,
  Testimonial,
  BlogPost,
  Skill,
  User,
  ContactMessage,
  Settings,
  PaginatedResponse,
  MessageResponse,
  UploadResponse,
  RegisterPayload,
} from '@/types';

const PORTFOLIO_CACHE_KEY = 'pf_data_cache_v1';

function clearPortfolioCache() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PORTFOLIO_CACHE_KEY);
  }
}

export const adminService = {
  async getDashboardStats(): Promise<Record<string, any>> {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  async getProjects(page = 1, limit = 20): Promise<PaginatedResponse<Project>> {
    const { data } = await api.get('/admin/projects', { params: { page, limit } });
    return data;
  },

  async getProject(id: number | string): Promise<Project> {
    const { data } = await api.get(`/admin/projects/${id}`);
    return data;
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    const { data } = await api.post('/admin/projects', projectData);
    clearPortfolioCache();
    return data;
  },

  async updateProject(id: number | string, projectData: Partial<Project>): Promise<Project> {
    const { data } = await api.put(`/admin/projects/${id}`, projectData);
    clearPortfolioCache();
    return data;
  },

  async deleteProject(id: number | string): Promise<MessageResponse> {
    const { data } = await api.delete(`/admin/projects/${id}`);
    clearPortfolioCache();
    return data;
  },

  async getTestimonials(page = 1): Promise<PaginatedResponse<Testimonial>> {
    const { data } = await api.get('/admin/testimonials', { params: { page } });
    return data;
  },

  async createTestimonial(data_: Partial<Testimonial>): Promise<Testimonial> {
    const { data } = await api.post('/admin/testimonials', data_);
    clearPortfolioCache();
    return data;
  },

  async updateTestimonial(id: string, data_: Partial<Testimonial>): Promise<Testimonial> {
    const { data } = await api.put(`/admin/testimonials/${id}`, data_);
    clearPortfolioCache();
    return data;
  },

  async deleteTestimonial(id: string): Promise<MessageResponse> {
    const { data } = await api.delete(`/admin/testimonials/${id}`);
    clearPortfolioCache();
    return data;
  },

  async approveTestimonial(id: string): Promise<Testimonial> {
    const { data } = await api.patch(`/testimonials/${id}/approve`);
    clearPortfolioCache();
    return data;
  },

  async rejectTestimonial(id: string): Promise<MessageResponse> {
    const { data } = await api.patch(`/testimonials/${id}/reject`);
    clearPortfolioCache();
    return data;
  },

  async getBlogPosts(page = 1): Promise<PaginatedResponse<BlogPost>> {
    const { data } = await api.get('/admin/blog', { params: { page } });
    return data;
  },

  async getBlogPost(id: string): Promise<BlogPost> {
    const { data } = await api.get(`/admin/blog/${id}`);
    return data;
  },

  async createBlogPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await api.post('/admin/blog', postData);
    clearPortfolioCache();
    return data;
  },

  async updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await api.put(`/admin/blog/${id}`, postData);
    clearPortfolioCache();
    return data;
  },

  async deleteBlogPost(id: string): Promise<MessageResponse> {
    const { data } = await api.delete(`/admin/blog/${id}`);
    clearPortfolioCache();
    return data;
  },

  async getUsers(): Promise<User[]> {
    const { data } = await api.get('/admin/users');
    return data;
  },

  async createUser(userData: RegisterPayload): Promise<MessageResponse> {
    const { data } = await api.post('/admin/users', userData);
    return data;
  },

  async deleteUser(id: number | string): Promise<MessageResponse> {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  async getMessages(page = 1, limit = 20): Promise<PaginatedResponse<ContactMessage>> {
    const { data } = await api.get('/contact', { params: { page, limit } });
    return data;
  },

  async deleteMessage(id: string): Promise<MessageResponse> {
    const { data } = await api.delete(`/contact/${id}`);
    return data;
  },

  async markMessageRead(id: string): Promise<MessageResponse> {
    const { data } = await api.patch(`/contact/${id}/read`);
    return data;
  },

  async uploadFile(file: File, bucket = 'portfolio'): Promise<UploadResponse> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/admin/upload?bucket=${bucket}`, form, {
      headers: { 'Content-Type': undefined },
      timeout: 60000,
    });
    return data;
  },

  async getSettings(): Promise<Settings> {
    const { data } = await api.get('/admin/settings');
    return data;
  },

  async updateSettings(settings: Partial<Settings>): Promise<MessageResponse> {
    const { data } = await api.put('/admin/settings', settings);
    clearPortfolioCache();
    return data;
  },

  async getSkills(page = 1): Promise<PaginatedResponse<Skill>> {
    const { data } = await api.get('/admin/skills', { params: { page } });
    return data;
  },

  async createSkill(skillData: Partial<Skill>): Promise<Skill> {
    const { data } = await api.post('/admin/skills', skillData);
    clearPortfolioCache();
    return data;
  },

  async updateSkill(id: number | string, skillData: Partial<Skill>): Promise<Skill> {
    const { data } = await api.put(`/admin/skills/${id}`, skillData);
    clearPortfolioCache();
    return data;
  },

  async deleteSkill(id: number | string): Promise<MessageResponse> {
    const { data } = await api.delete(`/admin/skills/${id}`);
    clearPortfolioCache();
    return data;
  },
};
