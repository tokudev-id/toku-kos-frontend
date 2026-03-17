import api from './axios';

export interface RentContract {
  id: string;
  tenancy_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  agreed_price_per_month: number;
  status: 'ACTIVE' | 'TERMINATED' | 'COMPLETED';
  room?: {
    id: string;
    room_code: string;
    property?: {
      name: string;
    };
  };
}

export interface ResidentProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  identity_card_url?: string;
}

export interface Resident {
  id: string;
  profile_id?: string;
  profile?: ResidentProfile;
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
  room?: { 
    id: string; 
    room_code: string; 
    property?: { 
      name: string 
    } 
  };
  history?: RentContract[];
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface CreateResidentPayload {
  full_name: string;
  email?: string;
  phone?: string;
  identity_number?: string;
  identity_card_url?: string;
  emergency_contact?: string;
  check_in_date?: string;
  notes?: string;
  room_id?: string;
}

export const residentService = {
  getResidents: async (page = 1, limit = 10, search?: string) => {
    const response = await api.get<PaginatedResponse<Resident>>('/residents', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getResident: async (id: string) => {
    const response = await api.get<Resident>(`/residents/${id}`);
    return response.data;
  },

  createResident: async (data: CreateResidentPayload) => {
    const response = await api.post<Resident>('/residents', data);
    return response.data;
  },

  updateResident: async (id: string, data: Partial<CreateResidentPayload>) => {
    const response = await api.patch<Resident>(`/residents/${id}`, data);
    return response.data;
  },

  checkoutResident: async (id: string) => {
    const response = await api.post<Resident>(`/residents/${id}/checkout`);
    return response.data;
  },

  uploadKtp: async (_id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Resident>('/residents/me/upload-ktp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
