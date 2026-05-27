import api from './api';

export const adminService = {
  async getDashboardStats() {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  async getProjects(page = 1, limit = 20) {
    const { data } = await api.get('/admin/projects', { params: { page, limit } });
    return data;
  },

  async getProject(id) {
    const { data } = await api.get(`/admin/projects/${id}`);
    return data;
  },

  async createProject(projectData) {
    const { data } = await api.post('/admin/projects', projectData);
    return data;
  },

  async updateProject(id, projectData) {
    const { data } = await api.put(`/admin/projects/${id}`, projectData);
    return data;
  },

  async deleteProject(id) {
    const { data } = await api.delete(`/admin/projects/${id}`);
    return data;
  },

  async getTestimonials(page = 1) {
    const { data } = await api.get('/admin/testimonials', { params: { page } });
    return data;
  },

  async createTestimonial(data_) {
    const { data } = await api.post('/admin/testimonials', data_);
    return data;
  },

  async updateTestimonial(id, data_) {
    const { data } = await api.put(`/admin/testimonials/${id}`, data_);
    return data;
  },

  async deleteTestimonial(id) {
    const { data } = await api.delete(`/admin/testimonials/${id}`);
    return data;
  },

  async approveTestimonial(id) {
    const { data } = await api.patch(`/testimonials/${id}/approve`);
    return data;
  },

  async rejectTestimonial(id) {
    const { data } = await api.patch(`/testimonials/${id}/reject`);
    return data;
  },

  async getBlogPosts(page = 1) {
    const { data } = await api.get('/admin/blog', { params: { page } });
    return data;
  },

  async getBlogPost(id) {
    const { data } = await api.get(`/admin/blog/${id}`);
    return data;
  },

  async createBlogPost(postData) {
    const { data } = await api.post('/admin/blog', postData);
    return data;
  },

  async updateBlogPost(id, postData) {
    const { data } = await api.put(`/admin/blog/${id}`, postData);
    return data;
  },

  async deleteBlogPost(id) {
    const { data } = await api.delete(`/admin/blog/${id}`);
    return data;
  },

  async getUsers() {
    const { data } = await api.get('/admin/users');
    return data;
  },

  async createUser(userData) {
    const { data } = await api.post('/admin/users', userData);
    return data;
  },

  async deleteUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  async getMessages(page = 1, limit = 20) {
    const { data } = await api.get('/contact', { params: { page, limit } });
    return data;
  },

  async deleteMessage(id) {
    const { data } = await api.delete(`/contact/${id}`);
    return data;
  },

  async markMessageRead(id) {
    const { data } = await api.patch(`/contact/${id}/read`);
    return data;
  },

  async uploadFile(file, bucket = 'portfolio') {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post(`/admin/upload?bucket=${bucket}`, form, {
      headers: { 'Content-Type': undefined },
      timeout: 60000,
    });
    return data;
  },

  async getSettings() {
    const { data } = await api.get('/admin/settings');
    return data;
  },

  async updateSettings(settings) {
    const { data } = await api.put('/admin/settings', settings);
    return data;
  },

  async getSkills(page = 1) {
    const { data } = await api.get('/admin/skills', { params: { page } });
    return data;
  },

  async createSkill(skillData) {
    const { data } = await api.post('/admin/skills', skillData);
    return data;
  },

  async updateSkill(id, skillData) {
    const { data } = await api.put(`/admin/skills/${id}`, skillData);
    return data;
  },

  async deleteSkill(id) {
    const { data } = await api.delete(`/admin/skills/${id}`);
    return data;
  },
};
