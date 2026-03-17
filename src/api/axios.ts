import axios from 'axios';
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
    const token = useAuthStore.getState().token;
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
      // Check if user is attempting to access login/register pages
      const isOnAuthPage = 
        window.location.pathname === '/login' || 
        window.location.pathname === '/register' ||
        window.location.pathname === '/resident/login';

      if (!isOnAuthPage) {
        // Get user role before clearing auth
        const currentUser = useAuthStore.getState().user;
        const role = currentUser?.role;
        
        // Clear auth store
        useAuthStore.getState().logout();
        
        // Show notification to user
        showNotification(SESSION_EXPIRED_MESSAGE, 'warning');
        
        // Redirect to appropriate login page
        const loginPath = role === 'RESIDENT' ? '/resident/login' : '/login';
        window.location.href = loginPath;
      }
    }
    
    return Promise.reject(new Error(message));
  }
);

export const axiosInstance = api;
export default api;
