import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async updateProfile(profileData) {
    const { data } = await api.put('/auth/me', profileData);
    return data;
  },

  async changePassword(passwords) {
    const { data } = await api.put('/auth/change-password', passwords);
    return data;
  },
};
