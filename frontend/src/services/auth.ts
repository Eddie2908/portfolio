import api from './api';
import type {
  AuthResponse,
  User,
  RegisterPayload,
  ProfileUpdatePayload,
  ChangePasswordPayload,
  MessageResponse,
} from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async register(userData: RegisterPayload): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/register', userData);
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async updateProfile(profileData: ProfileUpdatePayload): Promise<MessageResponse> {
    const { data } = await api.put<MessageResponse>('/auth/me', profileData);
    return data;
  },

  async changePassword(passwords: ChangePasswordPayload): Promise<MessageResponse> {
    const { data } = await api.put<MessageResponse>('/auth/change-password', passwords);
    return data;
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/reset-password', {
      token,
      new_password: password,
    });
    return data;
  },
};
