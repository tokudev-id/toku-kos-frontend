import api from './axios';

export type ExpenseCategory = 'Listrik' | 'Air' | 'Internet' | 'Perawatan' | 'Kebersihan' | 'Lainnya';

export interface Expense {
  id: string;
  property_id?: string;
  property?: { name: string };
  title: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  description?: string;
  created_at: string;
}

export interface CreateExpenseDto {
  property_id?: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const expenseService = {
  getExpenses: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Expense>>('/finance/expenses', { params });
    return response.data;
  },

  createExpense: async (data: CreateExpenseDto) => {
    const response = await api.post<Expense>('/finance/expenses', data);
    return response.data;
  },

  deleteExpense: async (id: string) => {
    await api.delete(`/finance/expenses/${id}`);
  },
};
