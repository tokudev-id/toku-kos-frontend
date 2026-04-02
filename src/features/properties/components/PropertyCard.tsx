import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  ChevronRight,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '@/api/property.service';
import { appPaths } from '@/app/paths';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertyCard({
  property,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="card group relative flex flex-col justify-between transition-all hover:border-brand-primary">
      <div className="absolute right-3 top-3 z-10" ref={menuRef}>
        <button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsMenuOpen((current) => !current);
          }}
          className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-slate-100 hover:text-text-primary"
        >
          <MoreVertical size={16} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-border-default bg-white py-1 shadow-lg">
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsMenuOpen(false);
                onEdit(property);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsMenuOpen(false);
                onDelete(property);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-slate-50"
            >
              <Trash2 size={14} />
              Hapus
            </button>
          </div>
        )}
      </div>

      <Link
        to={appPaths.owner.propertyDetails(property.id)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div>
          <div className="mb-4 flex items-start justify-between pr-8">
            <div className="rounded-xl bg-brand-primary-soft p-3 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
              <Building2 size={24} />
            </div>
            <div className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
              Aktif
            </div>
          </div>
          <h3 className="text-lg font-bold transition-colors group-hover:text-brand-primary">
            {property.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
            <MapPin size={14} />
            <span className="line-clamp-1">{property.address}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border-default pt-4">
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary">
                Kamar
              </p>
              <p className="text-sm font-bold">{property.total_rooms || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary">
                Tersedia
              </p>
              <p className="text-sm font-bold text-success">
                {property.available_rooms || 0}
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-text-secondary transition-all group-hover:translate-x-1 group-hover:text-brand-primary"
          />
        </div>
      </Link>
    </div>
  );
}
