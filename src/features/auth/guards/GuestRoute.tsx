import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '@/features/auth/session';
import { useAuthStore } from '@/store/useAuthStore';

interface GuestRouteProps {
  ownerRedirectTo: string;
  residentRedirectTo: string;
}

export function GuestRoute({ ownerRedirectTo, residentRedirectTo }: GuestRouteProps) {
  const user = useAuthStore((state) => state.user);
  const token = getAuthToken();

  if (user && token) {
    const redirectTo = user.role === 'RESIDENT' ? residentRedirectTo : ownerRedirectTo;
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
