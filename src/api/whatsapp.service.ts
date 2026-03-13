import api from './axios';

export interface BlastRecipient {
  phone: string;
  name?: string;
}

export interface BlastResult {
  phone: string;
  success: boolean;
  error?: string;
}

export interface BlastResponse {
  sent: number;
  failed: number;
  results: BlastResult[];
}

export interface WaStatus {
  configured: boolean;
  message: string;
}

export const whatsappService = {
  getStatus: async () => {
    const res = await api.get<WaStatus>('/whatsapp/status');
    return res.data;
  },

  blast: async (recipients: BlastRecipient[], message: string) => {
    const res = await api.post<BlastResponse>('/whatsapp/blast', { recipients, message });
    return res.data;
  },
};
