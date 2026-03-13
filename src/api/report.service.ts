import api from './axios';

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  newResidents: number;
}

export interface CashflowDataPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  labaBersih: number;
}

export const reportService = {
  getSummary: async () => {
    const response = await api.get<ReportSummary>('/laporan/summary');
    return response.data;
  },

  getCashflow: async () => {
    const response = await api.get<CashflowDataPoint[]>('/laporan/cashflow');
    return response.data;
  },
};
