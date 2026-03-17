import api from './axios';

export interface PaymentReminder {
  invoice_id: string;
  invoice_number: string;
  due_date: string;
  total_amount: number;
  status: 'UNPAID' | 'PAID' | 'VERIFICATION_PENDING';
  resident_name?: string;
  room_code?: string;
}

export interface OccupancyEntry {
  property_id: string;
  property_name: string;
  total_rooms: number;
  occupied_rooms: number;
  occupancy_rate: number;
}

export interface MaintenanceSummary {
  id: string;
  title: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  room_code?: string;
  property_name?: string;
  resident_name?: string;
  created_at: string;
}

export interface DashboardSummary {
  properties: number;
  rooms: {
    total: number;
    occupied: number;
    available: number;
  };
  residents: number;
  finance: {
    totalBilled: number;
    paidAmount: number;
    pendingAmount: number;
    overdueCount: number;
    activeExpensesCount: number;
  };
  paymentReminders: PaymentReminder[];
  occupancyPerProperty: OccupancyEntry[];
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  expenseBreakdown: Array<{ category: string; total: number }>;
  recentMaintenance: MaintenanceSummary[];
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },
};
