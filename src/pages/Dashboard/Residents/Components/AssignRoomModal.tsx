import { useState } from 'react';
import { Calendar, Home, CreditCard, ChevronRight, MapPin, Search } from 'lucide-react';
import { Modal } from '@/components/molecules';
import { useContracts } from '@/hooks/useContracts';
import type { Resident } from '@/api/resident.service';
import { formatCurrency } from '@/utils/format';

interface AssignRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onSuccess: () => void;
}

export function AssignRoomModal({
  isOpen,
  onClose,
  resident,
  onSuccess,
}: AssignRoomModalProps) {
  const {
    step,
    setStep,
    properties,
    selectedProperty,
    setSelectedProperty,
    availableRooms,
    selectedRoom,
    setSelectedRoom,
    isLoading,
    saving,
    error,
    submitAssignment,
    reset,
  } = useContracts(resident?.id || null, () => {
    onSuccess();
    onClose();
  });

  const [searchProperty, setSearchProperty] = useState('');
  const [searchRoom, setSearchRoom] = useState('');

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!resident) return null;

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(searchProperty.toLowerCase()) ||
    p.address.toLowerCase().includes(searchProperty.toLowerCase())
  );

  const filteredRooms = availableRooms.filter(r =>
    r.room_code.toLowerCase().includes(searchRoom.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submitAssignment({
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      agreed_price_per_month: Number(formData.get('price')),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tentukan Kamar & Kontrak"
      maxWidth="max-w-3xl"
    >
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[
          { icon: <MapPin size={18} />, label: 'Lokasi' },
          { icon: <Home size={18} />, label: 'Kamar' },
          { icon: <CreditCard size={18} />, label: 'Kontrak' },
        ].map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-2 flex-1`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step > i + 1 ? 'bg-success text-white' :
                  step === i + 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' :
                    'bg-slate-100 text-text-muted'
                }`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-brand-primary' : 'text-text-muted'
                }`}>{s.label}</span>
            </div>
            {i < 2 && (
              <div className={`h-[2px] flex-1 -mt-6 ${step > i + 1 ? 'bg-success' : 'bg-slate-100'
                }`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
          {error}
        </div>
      )}

      {/* Step 1: Select Property */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              className="input-field pl-10"
              placeholder="Cari properti..."
              value={searchProperty}
              onChange={(e) => setSearchProperty(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-50 animate-pulse" />
              ))
            ) : filteredProperties.length > 0 ? filteredProperties.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedProperty(p); setStep(2); }}
                className={`text-left p-4 rounded-2xl border-2 transition-all group ${selectedProperty?.id === p.id
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-slate-100 hover:border-brand-primary/30 hover:bg-slate-50'
                  }`}
              >
                <h4 className="font-bold text-text-primary mb-1 group-hover:text-brand-primary transition-colors">{p.name}</h4>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{p.address}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold uppercase">
                    {p.available_rooms} Kamar Tersedia
                  </span>
                  <ChevronRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            )) : (
              <div className="col-span-full py-12 text-center text-text-secondary">
                <MapPin className="mx-auto mb-3 opacity-20" size={48} />
                <p>Tidak ada properti ditemukan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Select Room */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setStep(1)} className="text-sm font-bold text-brand-primary hover:underline">
              ← Ganti Properti
            </button>
            <span className="text-sm text-text-secondary font-medium">{selectedProperty?.name}</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              className="input-field pl-10"
              placeholder="Cari kode kamar..."
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-slate-50 animate-pulse" />
              ))
            ) : filteredRooms.length > 0 ? filteredRooms.map((r) => (
              <button
                key={r.id}
                onClick={() => { setSelectedRoom(r); setStep(3); }}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${selectedRoom?.id === r.id
                    ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/5'
                    : 'border-slate-100 hover:border-brand-primary/30 hover:bg-slate-50'
                  }`}
              >
                <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">
                  {r.type}
                </span>
                <h4 className="font-bold text-xl text-text-primary leading-none mb-1">{r.room_code}</h4>
                <p className="text-[10px] font-bold text-text-secondary">{formatCurrency(r.price_per_month)}/bln</p>
              </button>
            )) : (
              <div className="col-span-full py-12 text-center text-text-secondary">
                <Home className="mx-auto mb-3 opacity-20" size={48} />
                <p>Tidak ada kamar tersedia di properti ini</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Contract Details */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setStep(2)} className="text-sm font-bold text-brand-primary hover:underline">
              ← Ganti Kamar
            </button>
            <div className="text-right">
              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{selectedProperty?.name}</p>
              <p className="text-sm font-bold text-text-primary">Kamar {selectedRoom?.room_code}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label-field flex items-center gap-2">
                <Calendar size={14} className="text-brand-primary" /> Tanggal Mulai *
              </label>
              <input name="start_date" type="date" required className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <label className="label-field flex items-center gap-2">
                <Calendar size={14} className="text-brand-primary" /> Tanggal Selesai *
              </label>
              <input name="end_date" type="date" required className="input-field" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-field flex items-center gap-2">
              <CreditCard size={14} className="text-brand-primary" /> Harga Sewa Per Bulan (Rp) *
            </label>
            <input
              name="price"
              type="number"
              required
              className="input-field text-lg font-bold text-brand-primary"
              defaultValue={selectedRoom?.price_per_month}
            />
            <p className="text-[10px] text-text-secondary">Default: Harga sewa reguler untuk unit ini.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Penghuni:</span>
              <span className="font-bold text-text-primary">{resident.full_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Unit:</span>
              <span className="font-bold text-text-primary">{selectedRoom?.room_code}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Lokasi:</span>
              <span className="font-bold text-text-primary">{selectedProperty?.name}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 shadow-lg shadow-brand-primary/20">
              {saving ? 'Memproses...' : 'Konfirmasi & Simpan'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
