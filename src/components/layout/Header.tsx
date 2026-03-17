import { Bell, MessageCircle, LogOut, Settings } from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { useHeader } from '@/hooks/useHeader';

export function Header() {
  const { isProfileOpen, setIsProfileOpen, profileRef, user, handleLogout, handleSettings } = useHeader();

  return (
    <header className="h-20 md:h-24 flex items-center justify-between px-4 md:px-6 lg:px-10 sticky top-0 bg-surface-bg/80 backdrop-blur-md z-20">
      <div className="flex items-center gap-3 md:gap-5 min-w-0">
        <div className="hidden md:block min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-text-primary truncate">Hello, {user?.full_name?.split(' ')[0]}!</h1>
          <p className="text-xs md:text-sm text-text-secondary font-medium mt-1 line-clamp-1">Explore information and activity about your property</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="w-10 md:w-12 h-10 md:h-12 hidden sm:flex items-center justify-center rounded-full bg-white border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all relative shadow-sm hover:shadow-md">
          <MessageCircle size={22} />
          <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 md:w-2.5 h-2 md:h-2.5 bg-brand-primary rounded-full border-2 border-white" />
        </button>

        <button className="w-10 md:w-12 h-10 md:h-12 hidden sm:flex items-center justify-center rounded-full bg-white border border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm hover:shadow-md">
          <Bell size={22} />
        </button>

        {/* Profile Menu */}
        <div className="relative ml-2 md:ml-4" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-brand-primary-soft transition-all border border-transparent hover:border-brand-primary/20 group active:scale-95"
            title={`${user?.full_name} (${user?.role})`}
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-bold text-text-primary leading-tight group-hover:text-brand-primary transition-colors truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[8px] md:text-[10px] text-text-secondary uppercase tracking-widest font-bold font-sans">
                {user?.role || 'Guest'}
              </p>
            </div>
            <Avatar 
              name={user?.full_name || 'User'} 
              size="sm" 
              className="shadow-sm border-2 border-transparent group-hover:border-brand-primary transition-all bg-brand-primary-soft" 
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-border-default shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border-muted bg-surface-bg/50">
                <p className="text-sm font-bold text-text-primary truncate">{user?.full_name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{user?.email}</p>
              </div>
              
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft transition-colors"
              >
                <Settings size={18} />
                <span>Pengaturan</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors border-t border-border-muted"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

