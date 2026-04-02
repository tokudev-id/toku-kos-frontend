import { Bell, MessageCircle } from 'lucide-react';
import { SearchBar } from './molecules/SearchBar';
import { Avatar } from './atoms/Avatar';
import { useAuthStore } from '@/store/useAuthStore';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.full_name ?? 'Owner';
  const companyName = user?.company_name ?? 'TokuKos';

  return (
    <header className="h-24 flex items-center justify-between px-6 md:px-10 sticky top-0 bg-surface-bg/80 backdrop-blur-md z-20">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold font-display tracking-tight text-text-primary">Hello, {displayName}!</h1>
          <p className="text-sm text-text-secondary font-medium mt-1">Explore information and activity about {companyName}</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-12 hidden lg:block">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3">
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all relative shadow-sm hover:shadow-md">
          <MessageCircle size={22} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-white" />
        </button>

        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all relative shadow-sm hover:shadow-md">
          <Bell size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-border-muted group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-text-primary leading-tight group-hover:text-brand-primary transition-colors">{companyName}</p>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold font-sans">{user?.role ?? 'OWNER'}</p>
          </div>
          <Avatar name={companyName} size="md" className="shadow-sm border-2 border-transparent group-hover:border-brand-primary transition-all bg-brand-primary-soft" />
        </div>
      </div>
    </header>
  );
}
