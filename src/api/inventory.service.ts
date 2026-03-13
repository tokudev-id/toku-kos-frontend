import api from './axios';

export type ItemCondition = 'baik' | 'rusak ringan' | 'rusak berat' | 'hilang';

export interface InventoryTemplate {
  id: string;
  name: string;
  qty: number;
  condition: ItemCondition;
  purchase_price?: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
}

export interface RoomInventoryItem {
  id: string;
  room_id: string;
  name: string;
  qty: number;
  condition: ItemCondition;
  purchase_price?: number;
  notes?: string;
}

export interface CreateInventoryTemplateDto {
  name: string;
  qty?: number;
  condition?: ItemCondition;
  purchase_price?: number;
  notes?: string;
  photo_url?: string;
}

export const inventoryService = {
  getTemplates: async () => {
    const response = await api.get<InventoryTemplate[]>('/inventory/templates');
    return response.data;
  },

  createTemplate: async (data: CreateInventoryTemplateDto) => {
    const response = await api.post<InventoryTemplate>('/inventory/templates', data);
    return response.data;
  },

  updateTemplate: async (id: string, data: Partial<CreateInventoryTemplateDto>) => {
    const response = await api.patch<InventoryTemplate>(`/inventory/templates/${id}`, data);
    return response.data;
  },

  deleteTemplate: async (id: string) => {
    await api.delete(`/inventory/templates/${id}`);
  },

  getRoomInventory: async (roomId: string) => {
    const response = await api.get<RoomInventoryItem[]>(`/inventory/rooms/${roomId}`);
    return response.data;
  },

  updateRoomItem: async (roomId: string, itemId: string, data: { qty?: number; condition?: ItemCondition; notes?: string }) => {
    const response = await api.patch<RoomInventoryItem>(`/inventory/rooms/${roomId}/items/${itemId}`, data);
    return response.data;
  },
};
