import api from './api';

export const contactService = {
  async sendMessage(data) {
    const { data: res } = await api.post('/contact', data);
    return res;
  },

  async getMessages(page = 1, limit = 20) {
    const { data } = await api.get('/contact', { params: { page, limit } });
    return data;
  },

  async getMessage(id) {
    const { data } = await api.get(`/contact/${id}`);
    return data;
  },

  async markAsRead(id) {
    const { data } = await api.patch(`/contact/${id}/read`);
    return data;
  },

  async deleteMessage(id) {
    const { data } = await api.delete(`/contact/${id}`);
    return data;
  },
};
