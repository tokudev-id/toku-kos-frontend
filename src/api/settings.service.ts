import api from './axios';

export interface OwnerSettings {
  id?: string;
  brand_name?: string;
  contact_email?: string;
  whatsapp_number?: string;
  bank_account?: string;
  billing_date?: number;
  penalty_type?: 'flat' | 'percentage';
  penalty_per_day?: number;
}

export const settingsService = {
  getSettings: async () => {
    const response = await api.get<OwnerSettings>('/settings');
    return response.data;
  },

  updateSettings: async (data: OwnerSettings) => {
    const response = await api.put<OwnerSettings>('/settings', data);
    return response.data;
  },
};
