import { Building2, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '@/api/property.service';
import { PropertyCardMenu } from './PropertyCardMenu';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  return (
    <div className="card group hover:border-brand-primary transition-all flex flex-col justify-between relative">
      <PropertyCardMenu
        property={property}
        onEdit={() => onEdit(property)}
        onDelete={() => onDelete(property)}
      />

      <Link to={`/properties/${property.id}`} className="flex flex-col flex-1 min-h-0">
        <div>
          <div className="flex items-start justify-between mb-4 pr-8">
            <div className="p-3 bg-brand-primary-soft text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <Building2 size={24} />
            </div>
            <div className="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Aktif
            </div>
          </div>
          <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors">{property.name}</h3>
          <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
            <MapPin size={14} />
            <span className="line-clamp-1">{property.address}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border-default flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Kamar</p>
              <p className="text-sm font-bold">{property.total_rooms || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Tersedia</p>
              <p className="text-sm font-bold text-success">{property.available_rooms || 0}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-text-secondary group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </div>
  );
}
