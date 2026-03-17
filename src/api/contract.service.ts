import api from './axios';
import type { RentContract } from './resident.service';

export interface AssignRoomPayload {
  room_id: string;
  start_date: string;
  end_date: string;
  agreed_price_per_month: number;
}

export const contractService = {
  assignRoom: async (residentId: string, data: AssignRoomPayload) => {
    const response = await api.post<RentContract>(`/residents/${residentId}/assign-room`, data);
    return response.data;
  },
  
  getContracts: async (residentId: string) => {
    const response = await api.get<RentContract[]>(`/residents/${residentId}/contracts`);
    return response.data;
  },

  terminateContract: async (residentId: string, contractId: string) => {
    const response = await api.post<RentContract>(`/residents/${residentId}/contracts/${contractId}/terminate`);
    return response.data;
  },
};
