import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, Home, FileText, User, Wrench } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Link, useLocation } from 'react-router-dom';

export function ResidentLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user || user.role !== 'RESIDENT') {
    return <Navigate to="/resident/login" replace />;
  }

  const navItems = [
    { label: 'Beranda', path: '/resident', icon: Home },
    { label: 'Tagihan', path: '/resident/invoices', icon: FileText },
    { label: 'Keluhan', path: '/resident/maintenance', icon: Wrench },
    { label: 'Profil', path: '/resident/profile', icon: User },
  ];

  return (
    <div className="min-h-screen w-full bg-surface-bg flex flex-col">
      {/* Top Header */}
      <header className="bg-surface-card border-b border-border-default px-4 py-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="font-bold text-lg">TokuKos</span>
        </div>
        <button 
          onClick={logout}
          className="p-2 text-text-secondary hover:text-error-600 rounded-full transition-colors"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pb-24 px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-[960px]">
        <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border-default px-4 py-2 sm:px-6 flex justify-around items-center z-10 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px]",
                isActive ? "text-brand-primary" : "text-text-secondary"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{item.label}</span>
              {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
