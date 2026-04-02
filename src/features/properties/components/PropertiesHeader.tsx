import { Plus } from 'lucide-react';

interface PropertiesHeaderProps {
  onAddProperty: () => void;
}

export function PropertiesHeader({ onAddProperty }: PropertiesHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold">Daftar Properti</h2>
        <p className="text-text-secondary">Kelola kos dan aset properti Anda.</p>
      </div>
      <button onClick={onAddProperty} className="btn-primary">
        <Plus size={20} />
        Tambah Properti
      </button>
    </div>
  );
}
