import { Bell, Search, User } from 'lucide-react';

export function Header({ title }: { title: string }) {
  return (
    <header className="bg-surface-card h-16 border-b border-border-default sticky top-0 z-10 flex items-center justify-between px-xl">
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Cari sesuatu..." 
            className="input-field pl-10 py-1.5 min-w-[300px]"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="relative text-text-secondary hover:text-text-primary transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] flex items-center justify-center rounded-full border-2 border-surface-card">
              2
            </span>
          </button>
          
          <div className="h-8 w-px bg-border-default" />

          <button className="flex items-center gap-3 hover:bg-surface-bg p-1 rounded-lg transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-primary">Budi Kosan</p>
              <p className="text-xs text-text-secondary">Owner</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-primary-soft flex items-center justify-center text-brand-primary">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
