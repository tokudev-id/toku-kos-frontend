import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface-bg font-sans selection:bg-brand-primary/10 selection:text-brand-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <Header />
        <main className="p-6 md:p-10 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-forwards">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

