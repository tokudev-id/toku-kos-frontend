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
import { ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* Desktop Sidebar Rail */}
      <div className="relative hidden md:block h-full overflow-visible z-40">
      <aside 
        className={cn(
          "md:flex flex-col bg-white border-r border-border-default h-full transition-all duration-300 shadow-sm relative overflow-x-hidden",
          isExpanded ? "w-64" : "w-[72px]"
        )}
      >

        {/* Brand/Logo */}
        <div className="h-20 flex items-center justify-center md:justify-start px-4 border-b border-border-muted overflow-hidden shrink-0 gap-3 transition-all duration-300">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-card shrink-0 flex-shrink-0">
            T
          </div>
          <span className={cn(
            "font-display font-bold text-lg text-text-primary transition-all duration-300 whitespace-nowrap",
            isExpanded ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-2 w-0 pointer-events-none"
          )}>
            TokuKos
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative min-h-[44px] md:min-h-[44px]",
                isActive 
                  ? "bg-brand-primary text-white shadow-card" 
                  : "text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 flex-shrink-0" />
                  <span className={cn(
                    "font-semibold text-sm whitespace-nowrap transition-all duration-300",
                    isExpanded ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-2 w-0 pointer-events-none"
                  )}>
                    {item.label}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute right-full -mr-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  )}

                  {/* Active indicator for collapsed state */}
                  {isActive && !isExpanded && (
                    <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-primary rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2.5 border-t border-border-muted space-y-1">
          <NavLink
            to="/pengaturan"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative min-h-[44px]",
              isActive ? "bg-brand-primary text-white shadow-card" : "text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft"
            )}
          >
            {() => (
              <>
                <Settings size={22} className="shrink-0 flex-shrink-0" />
                <span className={cn(
                  "font-semibold text-sm transition-all duration-300",
                  isExpanded ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-2 w-0 pointer-events-none"
                )}>
                  Pengaturan
                </span>
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                    Pengaturan
                    <div className="absolute right-full -mr-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </>
            )}
          </NavLink>
          
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center gap-3 px-3 py-3 text-danger hover:bg-danger/10 rounded-xl transition-all duration-200 group relative min-h-[44px]"
          >
            <LogOut size={22} className="shrink-0 flex-shrink-0" />
            <span className={cn(
              "font-semibold text-sm transition-all duration-300",
              isExpanded ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-2 w-0 pointer-events-none"
            )}>
              Logout
            </span>
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                Logout
                <div className="absolute right-full -mr-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </button>
        </div>
      </aside>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)"}
          className="absolute -right-3.5 top-24 w-7 h-7 bg-white border-2 border-border-default rounded-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-brand-primary hover:border-brand-primary hover:scale-110 transition-all duration-200 z-[55] shadow-lg active:scale-95"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft size={16} strokeWidth={3} className="transition-transform duration-300" />
          ) : (
            <ChevronRight size={16} strokeWidth={3} className="transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[70] h-11 w-11 rounded-xl border border-border-default bg-white/95 backdrop-blur flex items-center justify-center shadow-md transition-all duration-200 active:scale-95 text-text-secondary hover:text-brand-primary hover:border-brand-primary/30"
          aria-label="Open menu"
          aria-expanded={false}
          aria-controls="mobile-sidebar"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-50"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "md:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-border-default z-[60] transition-transform duration-300 flex flex-col shadow-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-border-muted">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-card">
              T
            </div>
            <span className="ml-3 font-display font-bold text-xl text-text-primary">TokuKos</span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="h-10 w-10 rounded-xl border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary/30 flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px]",
                isActive
                  ? "bg-brand-primary text-white shadow-card"
                  : "text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft"
              )}
            >
              <item.icon size={22} />
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border-muted space-y-2">
          <NavLink
            to="/pengaturan"
            onClick={closeMobileMenu}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px]",
              isActive ? "bg-brand-primary text-white shadow-card" : "text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft"
            )}
          >
            <Settings size={22} />
            <span className="font-semibold text-sm">Pengaturan</span>
          </NavLink>

          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/10 rounded-xl transition-all duration-200 min-h-[44px]"
          >
            <LogOut size={22} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-border-default z-[45] flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center min-w-[50px] min-h-[50px] rounded-xl transition-all",
              isActive ? "text-brand-primary bg-brand-primary-soft" : "text-text-secondary"
            )}
          >
            <item.icon size={24} />
            <span className="text-[9px] font-bold mt-1 text-center">{item.label.slice(0, 6)}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

