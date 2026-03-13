import api from './axios';

export interface Property {
  id: string;
  name: string;
  address: string;
  city?: string;
  province?: string;
  zip_code?: string;
  description?: string;
  notes?: string;
  total_rooms?: number;
  available_rooms?: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const propertyService = {
  getProperties: async (page = 1, limit = 10) => {
    const response = await api.get<PaginatedResponse<Property>>('/properties', {
      params: { page, limit },
    });
    return response.data;
  },

  getProperty: async (id: string) => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: Omit<Property, 'id' | 'created_at'>) => {
    const response = await api.post<Property>('/properties', data);
    return response.data;
  },

  updateProperty: async (id: string, data: Partial<Omit<Property, 'id' | 'created_at'>>) => {
    const response = await api.patch<Property>(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    await api.delete(`/properties/${id}`);
  },
};
