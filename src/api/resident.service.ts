import api from './axios';

export interface Resident {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  identity_number?: string;
  identity_card_url?: string;
  emergency_contact?: string;
  check_in_date?: string;
  notes?: string;
  status?: 'ACTIVE' | 'CHECKOUT';
  room_id?: string;
  room?: { id: string; room_code: string; property?: { name: string } };
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const residentService = {
  getResidents: async (page = 1, limit = 10) => {
    const response = await api.get<PaginatedResponse<Resident>>('/residents', {
      params: { page, limit },
    });
    return response.data;
  },

  getResident: async (id: string) => {
    const response = await api.get<Resident>(`/residents/${id}`);
    return response.data;
  },

  createResident: async (data: Omit<Resident, 'id' | 'created_at'>) => {
    const response = await api.post<Resident>('/residents', data);
    return response.data;
  },

  updateResident: async (id: string, data: Partial<Omit<Resident, 'id' | 'created_at'>>) => {
    const response = await api.patch<Resident>(`/residents/${id}`, data);
    return response.data;
  },

  checkoutResident: async (id: string) => {
    const response = await api.post<Resident>(`/residents/${id}/checkout`);
    return response.data;
  },

  uploadKtp: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Resident>(`/residents/${id}/upload-ktp`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
