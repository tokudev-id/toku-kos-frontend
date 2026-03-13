import { useEffect, useState, useRef } from 'react';
import { Plus, Users, Search, Mail, Phone, Calendar, MoreVertical, Pencil, LogOut } from 'lucide-react';
import { residentService } from '@/api/resident.service';
import type { Resident } from '@/api/resident.service';
import { AddResidentModal } from '@/components/AddResidentModal';
import { Modal } from '@/components/Modal';

export default function Residents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dropdown per row
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Edit state
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', email: '', phone: '', identity_number: '', emergency_contact: '', notes: '' });
  const [saving, setSaving] = useState(false);

  // Checkout state
  const [checkoutResident, setCheckoutResident] = useState<Resident | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchResidents();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await residentService.getResidents();
      setResidents(response.data);
    } catch (error) {
      console.error('Failed to fetch residents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEdit = (resident: Resident) => {
    setEditForm({ full_name: resident.full_name, email: resident.email, phone: resident.phone || '', identity_number: resident.identity_number || '', emergency_contact: resident.emergency_contact || '', notes: resident.notes || '' });
    setEditingResident(resident);
    setOpenMenuId(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResident) return;
    setSaving(true);
    try {
      await residentService.updateResident(editingResident.id, editForm);
      setEditingResident(null);
      fetchResidents();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleCheckout = async () => {
    if (!checkoutResident) return;
    setCheckingOut(true);
    try {
      await residentService.checkoutResident(checkoutResident.id);
      setCheckoutResident(null);
      fetchResidents();
    } catch (err) { console.error(err); }
    finally { setCheckingOut(false); }
  };

  const filteredResidents = residents.filter(r => 
    (r.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (r.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Daftar Penghuni</h2>
          <p className="text-text-secondary">Kelola data penyewa kos Anda secara terpusat.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={20} />
          Tambah Penghuni
        </button>
      </div>

      {/* Filter & Search */}
      <div className="card p-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau email penghuni..." 
            className="input-field pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-bg border-b border-border-default">
              <tr>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Nama & Kontak</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Identitas</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Tgl Bergabung</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-md py-6 bg-slate-50/50" />
                  </tr>
                ))
              ) : filteredResidents.length > 0 ? filteredResidents.map((resident) => (
                <tr key={resident.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-md py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center font-bold">
                        {resident.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{resident.full_name}</p>
                        <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                          <span className="flex items-center gap-1"><Mail size={12} /> {resident.email}</span>
                          {resident.phone && <span className="flex items-center gap-1"><Phone size={12} /> {resident.phone}</span>}
                        </div>
                      </div>
                    </div>
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
                        className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft rounded-lg transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === resident.id && (
                        <div className="absolute right-0 top-9 w-40 bg-white border border-border-default rounded-xl shadow-lg py-1 z-20">
                          <button onClick={() => openEdit(resident)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                            <Pencil size={14} /> Edit Data
                          </button>
                          {resident.status !== 'CHECKOUT' && (
                            <button onClick={() => { setCheckoutResident(resident); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-warning text-left">
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
                  <td colSpan={5} className="px-md py-12 text-center text-text-secondary italic">
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

      <AddResidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchResidents} 
      />

      {/* Edit Resident Modal */}
      <Modal
        isOpen={!!editingResident}
        onClose={() => setEditingResident(null)}
        title="Edit Data Penghuni"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="label-field">Nama Lengkap *</label>
            <input required className="input-field" value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Email *</label>
              <input required type="email" className="input-field" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="label-field">Telepon</label>
              <input className="input-field" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">No. KTP/Identitas</label>
              <input className="input-field" value={editForm.identity_number} onChange={e => setEditForm(f => ({ ...f, identity_number: e.target.value }))} />
            </div>
            <div>
              <label className="label-field">Kontak Darurat</label>
              <input className="input-field" value={editForm.emergency_contact} onChange={e => setEditForm(f => ({ ...f, emergency_contact: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label-field">Catatan</label>
            <textarea rows={2} className="input-field" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setEditingResident(null)} className="btn-secondary flex-1 justify-center">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
          </div>
        </form>
      </Modal>

      {/* Checkout Confirmation Modal */}
      <Modal
        isOpen={!!checkoutResident}
        onClose={() => setCheckoutResident(null)}
        title="Konfirmasi Checkout"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 text-warning rounded-full flex items-center justify-center"><LogOut size={18} /></div>
          </div>
          <p className="text-text-secondary text-sm">
            Penghuni <strong>{checkoutResident?.full_name}</strong> akan di-checkout dari kamar. Status akan berubah menjadi Checkout.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setCheckoutResident(null)} className="btn-secondary flex-1 justify-center">Batal</button>
            <button onClick={handleCheckout} disabled={checkingOut} className="btn-primary bg-warning hover:bg-warning/90 border-warning flex-1 justify-center">
              {checkingOut ? 'Memproses...' : 'Ya, Checkout'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
