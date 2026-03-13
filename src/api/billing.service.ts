import api from './axios';

export interface Plan {
  id: string;
  name: string;
  price: number;
  room_limit: number;
  features: string[];
}

export interface Subscription {
  id: string;
  plan_name: string;
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED';
  started_at: string;
  expires_at?: string;
}

export interface UsageSummary {
  rooms_used: number;
  plan_room_limit: number;
  residents_active: number;
}

export const billingService = {
  getPlans: async () => {
    const response = await api.get<Plan[]>('/saas/plans');
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get<Subscription>('/saas/subscription');
    return response.data;
  },

  getUsage: async () => {
    const response = await api.get<UsageSummary>('/saas/usage');
    return response.data;
  },
};
