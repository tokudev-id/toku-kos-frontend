import { Mail, Phone, Calendar, MoreVertical, Pencil, LogOut, Eye, Upload, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import type { Resident } from '@/api/resident.service';

interface ResidentCardProps {
  resident: Resident;
  onEdit: (resident: Resident) => void;
  onCheckout: (resident: Resident) => void;
  onViewKtp: (resident: Resident) => void;
  onUploadKtp: (resident: Resident) => void;
  onAssignRoom: (resident: Resident) => void;
}

function ResidentCard({ 
  resident, 
  onEdit, 
  onCheckout, 
  onViewKtp, 
  onUploadKtp,
  onAssignRoom
}: ResidentCardProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="card hover:shadow-lg transition-all group overflow-visible">
      <div className="p-md">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary-soft text-brand-primary flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-110 transition-transform">
            {resident.full_name.charAt(0)}
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft rounded-lg transition-all"
            >
              <MoreVertical size={18} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-9 w-44 bg-white border border-border-default rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in duration-100 origin-top-right">
                <button 
                  onClick={() => navigate(`/residents/${resident.id}`)} 
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left"
                >
                  <Eye size={14} className="text-brand-primary" /> Lihat Detail
                </button>
                <button onClick={() => onEdit(resident)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                  <Pencil size={14} /> Edit Data
                </button>
                {resident.identity_card_url ? (
                  <button onClick={() => onViewKtp(resident)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                    <Upload size={14} /> Lihat KTP
                  </button>
                ) : (
                  <button onClick={() => onUploadKtp(resident)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                    <Upload size={14} /> Upload KTP
                  </button>
                )}
                {resident.status !== 'CHECKOUT' && (
                  <button onClick={() => onCheckout(resident)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-danger text-left border-t border-border-muted mt-1">
                    <LogOut size={14} /> Checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h4 className="font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors truncate">
            {resident.full_name}
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
            resident.status === 'CHECKOUT' ? 'bg-slate-100 text-text-secondary' : 'bg-success/10 text-success'
          }`}>
            {resident.status === 'CHECKOUT' ? 'Checkout' : 'Aktif'}
          </span>
        </div>

        <div className="space-y-2 text-sm text-text-secondary border-t border-border-muted pt-4">
          <div className="flex items-center gap-2">
            <Mail size={14} className="shrink-0" />
            <span className="truncate">{resident.email}</span>
          </div>
          {resident.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0" />
              <span>{resident.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="shrink-0" />
            <span>Bergabung {new Date(resident.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
          </div>
          {resident.room ? (
            <div className="flex items-center gap-2 pt-1 border-t border-border-muted/50 mt-1">
              <MapPin size={14} className="shrink-0 text-brand-primary" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-tight">
                {resident.room.room_code} | <span className="font-medium text-text-secondary normal-case">{resident.room.property?.name}</span>
              </span>
            </div>
          ) : (
            <button
              onClick={() => onAssignRoom(resident)}
              className="w-full mt-2 text-[10px] font-bold text-white bg-brand-primary px-3 py-2 rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/10"
            >
              Tentukan Kamar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ResidentGridProps {
  items: Resident[];
  isLoading: boolean;
  onEdit: (resident: Resident) => void;
  onCheckout: (resident: Resident) => void;
  onViewKtp: (resident: Resident) => void;
  onUploadKtp: (resident: Resident) => void;
  onAssignRoom: (resident: Resident) => void;
}

export function ResidentGrid({ 
  items, 
  isLoading, 
  onEdit, 
  onCheckout, 
  onViewKtp, 
  onUploadKtp, 
  onAssignRoom
}: ResidentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="card h-48 animate-pulse bg-slate-50/50" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card p-xl text-center text-text-secondary italic">
        <div className="flex flex-col items-center gap-3">
          <Users size={48} className="opacity-10" />
          <p>Tidak ada penghuni ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((resident) => (
        <ResidentCard 
          key={resident.id}
          resident={resident}
          onEdit={onEdit}
          onCheckout={onCheckout}
          onViewKtp={onViewKtp}
          onUploadKtp={onUploadKtp}
          onAssignRoom={onAssignRoom}
        />
      ))}
    </div>
  );
}
