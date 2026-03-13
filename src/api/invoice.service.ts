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
  resident_id: string; // From column, likely still there but might be null if not selected
  // resident?: { id: string; full_name: string; room?: { room_code: string } }; // REMOVED
  contract?: {
    id: string;
    resident?: { id: string; full_name: string; email?: string; phone_number?: string };
    room?: { id: string; room_code: string };
  };
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

  exportInvoices: async (status?: string) => {
    const response = await api.get<{ data: string; filename: string }>('/finance/invoices/export', { 
      params: { status } 
    });
    return response.data;
  },

  downloadPdf: async (id: string, isResidentRole: boolean = false) => {
    const endpoint = isResidentRole ? `/finance/my-invoices/${id}/pdf` : `/finance/invoices/${id}/pdf`;
    const response = await api.get(endpoint, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice-${id.substring(0, 8)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
