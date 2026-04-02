import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_STORE_KEY, clearAuthSession, setAuthToken } from '@/features/auth/session';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'OWNER' | 'RESIDENT';
  company_name?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        setAuthToken(token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        clearAuthSession();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: AUTH_STORE_KEY,
    }
  )
);
