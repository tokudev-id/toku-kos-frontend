import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  DoorOpen, 
  Users, 
  FileText,
  CreditCard,
  TrendingDown,
  Package,
  BarChart2,
  Settings, 
  LogOut,
  Wrench,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'Properti', path: '/properties' },
  { icon: DoorOpen, label: 'Kamar', path: '/rooms' },
  { icon: Users, label: 'Penghuni', path: '/residents' },
  { icon: FileText, label: 'Tagihan', path: '/tagihan' },
  { icon: CreditCard, label: 'Pembayaran', path: '/pembayaran' },
  { icon: TrendingDown, label: 'Pengeluaran', path: '/pengeluaran' },
  { icon: Package, label: 'Inventaris', path: '/inventaris' },
  { icon: BarChart2, label: 'Laporan', path: '/laporan' },
  { icon: Wrench, label: 'Keluhan', path: '/maintenance' },
  { icon: MessageCircle, label: 'WhatsApp', path: '/whatsapp' },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar Rail */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-border-default h-screen sticky top-0 transition-all duration-300 z-30 shadow-sm relative",
          isExpanded ? "w-64" : "w-[72px]"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-border-default rounded-full flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all z-40 shadow-sm"
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Brand/Logo */}
        <div className="h-20 flex items-center px-4 border-b border-border-muted overflow-hidden shrink-0">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-card shrink-0">
            T
          </div>
          <span className={cn(
            "ml-3 font-display font-bold text-xl text-text-primary transition-all duration-300 whitespace-nowrap",
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          )}>
            TokuKos
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isExpanded ? item.label : undefined}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-brand-primary text-white shadow-card" 
                  : "text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className={cn(
                    "font-semibold text-sm whitespace-nowrap transition-all duration-300",
                    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                  )}>
                    {item.label}
                  </span>
                  {isActive && !isExpanded && (
                    <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-primary rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border-muted space-y-2">
          <NavLink
            to="/pengaturan"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              isActive ? "bg-brand-primary text-white shadow-card" : "text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft"
            )}
          >
            <Settings size={22} className="shrink-0" />
            <span className={cn(
              "font-semibold text-sm transition-all duration-300",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              Pengaturan
            </span>
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-danger hover:bg-danger/10 rounded-xl transition-all duration-200"
          >
            <LogOut size={22} className="shrink-0" />
            <span className={cn(
              "font-semibold text-sm transition-all duration-300",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border-default z-40 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all",
              isActive ? "text-brand-primary bg-brand-primary-soft" : "text-text-secondary"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold mt-1">{item.label.slice(0, 6)}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

