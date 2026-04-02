import axios from 'axios';
import { appPaths, publicPaths } from '@/app/paths';
import { getAuthToken } from '@/features/auth/session';
import { useAuthStore } from '../store/useAuthStore';
import { showNotification, SESSION_EXPIRED_MESSAGE } from '../utils/notification';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan sistem';
    
    // Auto-logout on 401 Unauthorized (session expired or invalid token)
    if (error.response?.status === 401) {
      const isOnAuthPage = publicPaths.has(window.location.pathname);

      if (!isOnAuthPage) {
        const currentUser = useAuthStore.getState().user;
        const role = currentUser?.role;

        useAuthStore.getState().logout();
        showNotification(SESSION_EXPIRED_MESSAGE, 'warning');

        const loginPath =
          role === 'RESIDENT' ? appPaths.auth.residentLogin : appPaths.auth.ownerLogin;
        window.location.href = loginPath;
      }
    }
    
    return Promise.reject(new Error(message));
  }
);

export const axiosInstance = api;
export default api;
