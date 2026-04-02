import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken } from '@/features/auth/session';
import { useAuthStore } from '@/store/useAuthStore';

type UserRole = 'OWNER' | 'RESIDENT';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectTo: string;
}

export function ProtectedRoute({ allowedRoles, redirectTo }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const token = getAuthToken();

  if (!user || !token || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
