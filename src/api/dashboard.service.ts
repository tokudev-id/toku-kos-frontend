import api from './axios';

export interface DashboardSummary {
  properties: number;
  rooms: {
    total: number;
    occupied: number;
  };
  residents: number;
  finance: {
    totalAmount: number;
    paidAmount: number;
  };
}

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },
};
