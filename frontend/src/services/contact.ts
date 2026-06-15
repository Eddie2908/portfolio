import api from './api';
import type {
  ContactPayload,
  ContactMessage,
  PaginatedResponse,
  MessageResponse,
} from '@/types';

export const contactService = {
  async sendMessage(data: ContactPayload): Promise<MessageResponse> {
    const { data: res } = await api.post<MessageResponse>('/contact', data);
    return res;
  },

  async getMessages(page = 1, limit = 20): Promise<PaginatedResponse<ContactMessage>> {
    const { data } = await api.get<PaginatedResponse<ContactMessage>>('/contact', {
      params: { page, limit },
    });
    return data;
  },

  async getMessage(id: string): Promise<ContactMessage> {
    const { data } = await api.get<ContactMessage>(`/contact/${id}`);
    return data;
  },

  async markAsRead(id: string): Promise<MessageResponse> {
    const { data } = await api.patch<MessageResponse>(`/contact/${id}/read`);
    return data;
  },

  async deleteMessage(id: string): Promise<MessageResponse> {
    const { data } = await api.delete<MessageResponse>(`/contact/${id}`);
    return data;
  },
};
