import api from './axios';

export type MediaType = 'GENERAL' | 'ROOM_PHOTO' | 'PROPERTY_PHOTO' | 'PAYMENT_PROOF';

export interface Media {
  id: string;
  url: string;
  public_id?: string;
  original_name?: string;
  mime_type?: string;
  file_size?: number;
  type: MediaType;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const mediaService = {
  upload: async (file: File, type: MediaType) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<Media>('/media/upload', formData, {
      params: { type },
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  getAll: async (type?: MediaType, page = 1, limit = 50) => {
    const response = await api.get<PaginatedResponse<Media>>('/media', {
      params: { type, page, limit },
    });
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/media/${id}`);
  },
};
