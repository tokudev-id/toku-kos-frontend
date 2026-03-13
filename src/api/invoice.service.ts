import api from './axios';

export type InvoiceStatus = 'UNPAID' | 'VERIFICATION_PENDING' | 'PAID' | 'OVERDUE';
export type InvoiceItemCategory = 'Sewa' | 'Listrik' | 'Air' | 'Internet' | 'Lainnya';

export interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  unit_price: number;
  category: InvoiceItemCategory;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  resident_id: string;
  resident?: { id: string; full_name: string; room?: { room_code: string } };
  items: InvoiceItem[];
  total_amount: number;
  discount?: number;
  period?: string;
  due_date: string;
  status: InvoiceStatus;
  paid_date?: string;
  created_at: string;
}

export interface CreateInvoiceItemDto {
  name: string;
  qty?: number;
  unit_price: number;
  category: InvoiceItemCategory;
}

export interface CreateInvoiceDto {
  resident_id: string;
  items: CreateInvoiceItemDto[];
  period?: string;
  due_date: string;
  discount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const invoiceService = {
  getInvoices: async (params?: { status?: InvoiceStatus; page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Invoice>>('/finance/invoices', { params });
    return response.data;
  },

  getInvoice: async (id: string) => {
    const response = await api.get<Invoice>(`/finance/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data: CreateInvoiceDto) => {
    const response = await api.post<Invoice>('/finance/invoices', data);
    return response.data;
  },

  verifyInvoice: async (id: string) => {
    const response = await api.post<Invoice>(`/finance/invoices/${id}/verify`);
    return response.data;
  },
};
