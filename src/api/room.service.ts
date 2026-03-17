import api from './axios';
import type { Media } from './media.service';

export interface Room {
  id: string;
  property_id: string;
  room_code: string;
  type: 'STANDARD' | 'DELUXE' | 'SUITE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  price_per_month: number;
  price_per_year?: number;
  floor?: string;
  size?: string;
  deposit?: number;
  electricity_included?: boolean;
  water_included?: boolean;
  photo_url?: string;
  facilities?: string[];
  images?: Media[];
  created_at: string;
}

export interface RoomPayload {
  property_id: string;
  room_code: string;
  type?: Room['type'];
  status?: Room['status'];
  price_per_month: number;
  price_per_year?: number;
  floor?: string;
  size?: string;
  deposit?: number;
  electricity_included?: boolean;
  water_included?: boolean;
  photo_url?: string;
  facilities?: string[];
  image_ids?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const roomService = {
  getAllRooms: async (
    page = 1,
    limit = 50,
    search?: string,
    type?: Room['type'],
    status?: Room['status'],
  ) => {
    const response = await api.get<PaginatedResponse<Room>>('/rooms', { params: { page, limit, search, type, status } });
    return response.data;
  },

  getRoomsByProperty: async (
    propertyId: string,
    page = 1,
    limit = 10,
    search?: string,
    type?: Room['type'],
    status?: Room['status'],
  ) => {
    const response = await api.get<PaginatedResponse<Room>>(`/rooms/property/${propertyId}`, {
      params: { page, limit, search, type, status },
    });
    return response.data;
  },

  getRoom: async (id: string) => {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (data: RoomPayload) => {
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },

  updateRoom: async (id: string, data: Partial<RoomPayload>) => {
    const response = await api.patch<Room>(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string) => {
    await api.delete(`/rooms/${id}`);
  },
};
