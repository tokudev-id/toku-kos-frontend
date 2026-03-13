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
  ChevronLeft,
  ChevronRight,
  Wrench,
  CreditCard as BillingIcon,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';

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
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "bg-surface-sidebar text-text-on-dark h-screen transition-all duration-300 flex flex-col sticky top-0",
      collapsed ? "w-[72px]" : "w-64"
    )}>
      {/* Brand */}
      <div className="p-md flex items-center gap-3 h-16 border-b border-slate-700 overflow-hidden">
        <div className="w-8 h-8 bg-brand-primary rounded-lg shrink-0 flex items-center justify-center font-bold text-white">
          T
        </div>
        {!collapsed && (
          <span className="font-bold text-lg whitespace-nowrap">TokuKos</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-md space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-brand-primary text-white" 
                : "hover:bg-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 space-y-1">
        <NavLink
          to="/pengaturan"
          className={({ isActive }) => cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-brand-primary text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <Settings size={20} />
          {!collapsed && <span className="font-medium">Pengaturan</span>}
        </NavLink>
        <NavLink
          to="/billing"
          className={({ isActive }) => cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
            isActive ? "bg-brand-primary text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <BillingIcon size={20} />
          {!collapsed && <span className="font-medium">Billing</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-md transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 w-full flex items-center justify-center p-2 text-slate-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
