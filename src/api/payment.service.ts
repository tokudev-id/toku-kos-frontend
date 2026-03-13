import api from './axios';
import type { Invoice } from './invoice.service';

export type PaymentMethod = 'CASH' | 'MANUAL_TRANSFER' | 'E_WALLET';

export interface Payment {
  id: string;
  invoice_id: string;
  invoice?: Invoice;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  notes?: string;
  created_at: string;
}

export interface CreatePaymentDto {
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const paymentService = {
  getPayments: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Payment>>('/finance/payments', { params });
    return response.data;
  },

  createPayment: async (data: CreatePaymentDto) => {
    const response = await api.post<Payment>('/finance/payments', data);
    return response.data;
  },
};
