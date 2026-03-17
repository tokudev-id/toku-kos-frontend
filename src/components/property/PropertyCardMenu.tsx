import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { Property } from '@/api/property.service';

interface PropertyCardMenuProps {
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
}

export function PropertyCardMenu({ onEdit, onDelete }: PropertyCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="absolute top-3 right-3 z-10" ref={menuRef}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen((v) => !v); }}
        className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-8 w-36 bg-white border border-border-default rounded-xl shadow-lg py-1 z-20">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-danger text-left"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      )}
    </div>
  );
}
