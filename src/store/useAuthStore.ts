import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'OWNER' | 'RESIDENT';
  company_name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('toku_token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        // Clear both token and persisted store
        localStorage.removeItem('toku_token');
        localStorage.removeItem('toku-auth-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'toku-auth-storage',
    }
  )
);

