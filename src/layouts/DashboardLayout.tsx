import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Ini ringkasan kos Anda hari ini',
  '/properties': 'Daftar Properti',
  '/rooms': 'Manajemen Kamar',
  '/residents': 'Daftar Penghuni',
  '/finance': 'Laporan Keuangan',
  '/maintenance': 'Perbaikan & Keluhan',
};

export function DashboardLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'TokuKos';

  return (
    <div className="flex min-h-screen bg-surface-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="p-xl flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
