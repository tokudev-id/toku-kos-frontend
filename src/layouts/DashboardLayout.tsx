import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '@/components/layout';

export function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen bg-surface-bg font-sans selection:bg-brand-primary/10 selection:text-brand-primary overflow-hidden">
      {/* Sidebar - Full Height */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed */}
        <Header />
        
        {/* Content - Scrollable */}
        <main className="flex-1 w-full overflow-x-hidden overflow-y-auto pb-20 md:pb-0">
          <div className="px-4 md:px-6 lg:px-10 py-6 md:py-8 lg:py-10 w-full max-w-7xl mx-auto space-y-6 md:space-y-8 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-forwards">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

