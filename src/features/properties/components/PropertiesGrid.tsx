import { Building2, Plus } from 'lucide-react';
import type { Property } from '@/api/property.service';
import { PropertyCard } from './PropertyCard';

interface PropertiesGridProps {
  properties: Property[];
  isLoading: boolean;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onAddFirstProperty: () => void;
}

export function PropertiesGrid({
  properties,
  isLoading,
  onEdit,
  onDelete,
  onAddFirstProperty,
}: PropertiesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="card h-48 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center space-y-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-bg text-text-secondary">
          <Building2 size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Belum Ada Properti</h3>
          <p className="max-w-xs text-text-secondary">
            Anda belum menambahkan kos atau properti apa pun. Mulai kelola kos
            pertama Anda sekarang.
          </p>
        </div>
        <button onClick={onAddFirstProperty} className="btn-primary">
          <Plus size={20} />
          Tambah Properti Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
