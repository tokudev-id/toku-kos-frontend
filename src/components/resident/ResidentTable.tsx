import { Mail, Phone, Calendar, MoreVertical, Pencil, LogOut, Eye, Upload, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import type { Resident } from '@/api/resident.service';

interface ResidentTableProps {
  items: Resident[];
  isLoading: boolean;
  onEdit: (resident: Resident) => void;
  onCheckout: (resident: Resident) => void;
  onViewKtp: (resident: Resident) => void;
  onUploadKtp: (resident: Resident) => void;
  onAssignRoom: (resident: Resident) => void;
}

export function ResidentTable({ 
  items, 
  isLoading, 
  onEdit, 
  onCheckout, 
  onViewKtp, 
  onUploadKtp,
  onAssignRoom
}: ResidentTableProps) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="card overflow-visible"> {/* Ensure overflow-visible for dropdowns */}
      <div className="overflow-x-auto min-h-100"> {/* Min-height helps popover visibility at bottom */}
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-surface-bg border-b border-border-default sticky top-0 z-10">
            <tr>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Nama & Kontak</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Unit & Lokasi</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Identitas</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Tgl Bergabung</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-md py-6 bg-slate-50/50" />
                </tr>
              ))
            ) : items.length > 0 ? items.map((resident) => (
              <tr key={resident.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-md py-4">
                  {(() => {
                    const profile = resident.profile;
                    return (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center font-bold">
                      {(profile?.full_name || resident.full_name || '-').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary group-hover:text-brand-primary transition-colors">{profile?.full_name || resident.full_name}</p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                        <span className="flex items-center gap-1"><Mail size={12} /> {profile?.email || resident.email}</span>
                        {(profile?.phone_number || resident.phone) && <span className="flex items-center gap-1"><Phone size={12} /> {profile?.phone_number || resident.phone}</span>}
                      </div>
                    </div>
                  </div>
                    );
                  })()}
                </td>
                <td className="px-md py-4">
                  {resident.room ? (
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-text-primary uppercase">{resident.room.room_code}</p>
                      <p className="text-[11px] text-text-secondary">{resident.room.property?.name || '-'}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAssignRoom(resident)}
                      className="text-[10px] font-bold text-white bg-brand-primary px-3 py-1.5 rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/10 whitespace-nowrap"
                    >
                      Tentukan Kamar
                    </button>
                  )}
                </td>
                <td className="px-md py-4 text-sm text-text-secondary font-medium">
                  {resident.identity_number || '-'}
                </td>
                <td className="px-md py-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar size={14} />
                    {new Date(resident.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-md py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${resident.status === 'CHECKOUT' ? 'bg-slate-100 text-text-secondary' : 'bg-success/10 text-success'}`}>
                    {resident.status === 'CHECKOUT' ? 'Checkout' : 'Aktif'}
                  </span>
                </td>
                <td className="px-md py-4 text-right">
                  <div className="relative inline-block" ref={openMenuId === resident.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === resident.id ? null : resident.id)}
                      className="inline-flex h-11 w-11 items-center justify-center text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft rounded-lg transition-all"
                      aria-label={`Aksi untuk ${resident.profile?.full_name || resident.full_name || 'penghuni'}`}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === resident.id && (
                      <div className="absolute right-0 top-9 w-44 bg-white border border-border-default rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in duration-100 origin-top-right">
                        <button 
                          onClick={() => { navigate(`/residents/${resident.id}`); setOpenMenuId(null); }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left"
                        >
                          <Eye size={14} className="text-brand-primary" /> Lihat Detail
                        </button>
                        <button onClick={() => { onEdit(resident); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                          <Pencil size={14} /> Edit Data
                        </button>
                        {(resident.profile?.identity_card_url || resident.identity_card_url) ? (
                          <button onClick={() => { onViewKtp(resident); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                            <Upload size={14} /> Lihat KTP
                          </button>
                        ) : (
                          <button onClick={() => { onUploadKtp(resident); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                            <Upload size={14} /> Upload KTP
                          </button>
                        )}
                        {resident.status !== 'CHECKOUT' && (
                          <button onClick={() => { onCheckout(resident); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-danger text-left border-t border-border-muted mt-1">
                            <LogOut size={14} /> Checkout
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-md py-12 text-center text-text-secondary italic">
                  <div className="flex flex-col items-center gap-2">
                     <Users size={32} className="opacity-20 mb-2" />
                     <p>Tidak ada penghuni ditemukan.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
