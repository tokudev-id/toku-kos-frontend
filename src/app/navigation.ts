import {
  Banknote,
  BellRing,
  Building2,
  CreditCard,
  LayoutDashboard,
  Package,
  Receipt,
  UserCircle,
  Users,
  Wrench,
} from 'lucide-react';
import { appPaths } from './paths';

export interface NavigationItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const ownerNavigationItems: NavigationItem[] = [
  { label: 'Overview', href: appPaths.owner.dashboard, icon: LayoutDashboard },
  { label: 'Properties', href: appPaths.owner.properties, icon: Building2 },
  { label: 'Residents', href: appPaths.owner.residents, icon: Users },
  { label: 'Tagihan', href: appPaths.owner.invoices, icon: Receipt },
  { label: 'Pembayaran', href: appPaths.owner.payments, icon: CreditCard },
  { label: 'Pengeluaran', href: appPaths.owner.expenses, icon: Banknote },
  { label: 'Inventaris', href: appPaths.owner.inventory, icon: Package },
  { label: 'Maintenance', href: appPaths.owner.maintenance, icon: Wrench },
  { label: 'WhatsApp', href: appPaths.owner.whatsapp, icon: BellRing },
  { label: 'Laporan', href: appPaths.owner.reports, icon: Receipt },
  { label: 'Billing', href: appPaths.owner.billing, icon: CreditCard },
];

export const residentNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: appPaths.resident.home, icon: LayoutDashboard },
  { label: 'Invoices', href: appPaths.resident.invoices, icon: Receipt },
  { label: 'Maintenance', href: appPaths.resident.maintenance, icon: Wrench },
  { label: 'Profile', href: appPaths.resident.profile, icon: UserCircle },
];
