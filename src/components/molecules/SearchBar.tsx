import { Search } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="relative flex items-center w-full max-w-xl">
      <input
        type="text"
        placeholder="Search Anything..."
        className="w-full bg-white border border-border-default rounded-full h-12 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
      />
      <button className="absolute right-1 w-10 h-10 bg-text-primary text-white rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors shadow-sm">
        <Search size={18} />
      </button>
    </div>
  );
}
