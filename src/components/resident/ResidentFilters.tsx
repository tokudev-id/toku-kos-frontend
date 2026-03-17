import { Search, LayoutGrid, List } from 'lucide-react';

interface ResidentFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export function ResidentFilters({ 
  search, 
  onSearchChange, 
  viewMode, 
  onViewModeChange 
}: ResidentFiltersProps) {
  return (
    <div className="card p-md flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
        <input 
          type="text" 
          placeholder="Cari nama atau email penghuni..." 
          className="input-field pl-10 h-11"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex bg-surface-bg p-1 rounded-xl border border-border-default h-11">
        <button
          onClick={() => onViewModeChange('table')}
          className={`px-3 flex items-center gap-2 rounded-lg transition-all ${
            viewMode === 'table' 
              ? 'bg-white text-brand-primary shadow-sm' 
              : 'text-text-secondary hover:bg-slate-50'
          }`}
          title="Tampilan Tabel"
        >
          <List size={18} />
          <span className="text-sm font-medium hidden sm:inline">Tabel</span>
        </button>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`px-3 flex items-center gap-2 rounded-lg transition-all ${
            viewMode === 'grid' 
              ? 'bg-white text-brand-primary shadow-sm' 
              : 'text-text-secondary hover:bg-slate-50'
          }`}
          title="Tampilan Grid"
        >
          <LayoutGrid size={18} />
          <span className="text-sm font-medium hidden sm:inline">Grid</span>
        </button>
      </div>
    </div>
  );
}
