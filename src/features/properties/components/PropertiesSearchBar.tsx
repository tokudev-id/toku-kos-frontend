import { Search } from 'lucide-react';

interface PropertiesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PropertiesSearchBar({
  value,
  onChange,
}: PropertiesSearchBarProps) {
  return (
    <div className="card flex flex-col items-center gap-4 p-md md:flex-row">
      <div className="relative w-full flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          size={18}
        />
        <input
          type="text"
          placeholder="Cari nama atau alamat properti..."
          className="input-field h-11 pl-10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
