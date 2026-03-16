/**
 * Session Authentication Error Handler
 * Displays user-friendly messages when session expires or auth fails
 */

export interface NotificationCallback {
  (message: string, type: 'info' | 'error' | 'success' | 'warning'): void;
}

let notificationCallback: NotificationCallback | null = null;

export const setNotificationCallback = (callback: NotificationCallback) => {
  notificationCallback = callback;
};

export const showNotification = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
  if (notificationCallback) {
    notificationCallback(message, type);
  } else {
    // Fallback if no callback registered
    console.warn(`[${type.toUpperCase()}]: ${message}`);
  }
};

export const SESSION_EXPIRED_MESSAGE = 'Sesi Anda telah berakhir. Silakan login kembali.';
export const UNAUTHORIZED_MESSAGE = 'Anda tidak memiliki akses ke resource ini.';
export const NETWORK_ERROR_MESSAGE = 'Terjadi kesalahan pada jaringan. Silakan periksa koneksi Anda.';
