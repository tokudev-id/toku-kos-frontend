import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { 
  ArrowLeft, Mail, Phone, Calendar, User, FileText, 
  MapPin, ShieldAlert, Edit2, LogOut, Download, ExternalLink,
  ChevronRight
} from 'lucide-react';
import { residentService, type Resident } from '@/api/resident.service';
import { SectionHeader, Modal } from '@/components/molecules';

export default function ResidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await residentService.getResident(id);
      setResident(data);
    } catch (err) {
      console.error(err);
      navigate('/residents');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading) {
    return <div className="p-xl text-center animate-pulse">Memuat data penghuni...</div>;
  }

  if (!resident) return null;

  const profile = resident.profile;
  const residentName = profile?.full_name || resident.full_name || '-';
  const residentEmail = profile?.email || resident.email || '-';
  const residentPhone = profile?.phone_number || resident.phone || '-';
  const residentKtpUrl = profile?.identity_card_url || resident.identity_card_url;

  return (
    <div className="space-y-lg animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/residents')}
        className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group px-1 mb-2"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Kembali ke Daftar</span>
      </button>

      <SectionHeader 
        title="Detail Penghuni" 
        subtitle={`Manajemen informasi untuk ${residentName}`}
        className="mb-8"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Basic Info Card */}
        <div className="lg:w-1/3 space-y-6">
          <div className="card overflow-hidden">
            <div className="h-24 bg-brand-primary-soft relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-brand-primary text-white flex items-center justify-center text-3xl font-bold">
                    {residentName.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-12 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{residentName}</h3>
                  <span className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                    resident.status === 'CHECKOUT' ? 'bg-slate-100 text-text-secondary' : 'bg-success/10 text-success'
                  }`}>
                    {resident.status === 'CHECKOUT' ? 'Checkout' : 'Aktif'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border-muted">
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-text-muted"><Mail size={16} /></div>
                  <span className="text-sm truncate">{residentEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-text-muted"><Phone size={16} /></div>
                  <span className="text-sm">{residentPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-text-muted"><Calendar size={16} /></div>
                  <span className="text-sm">Bergabung {new Date(resident.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-secondary text-xs py-2.5"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => setIsCheckoutModalOpen(true)}
                  disabled={resident.status === 'CHECKOUT'}
                  className="btn-primary bg-warning hover:bg-warning/90 border-warning text-xs py-2.5"
                >
                  <LogOut size={14} /> Checkout
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Identitas & Dokumen</h4>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border-default bg-surface-bg group hover:border-brand-primary/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <FileText size={16} />
                    <span className="text-sm font-bold">KTP / Paspor</span>
                  </div>
                  {residentKtpUrl && <Download size={14} className="text-text-muted group-hover:text-brand-primary" />}
                </div>
                <p className="text-xs text-text-secondary mb-3">{resident.identity_number || 'Belum diisi'}</p>
                {residentKtpUrl ? (
                  <div className="rounded-lg overflow-hidden border border-border-muted aspect-video relative">
                    <img src={residentKtpUrl} alt="KTP" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink size={20} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-border-muted p-4 text-center">
                    <p className="text-[10px] text-text-muted font-medium italic">Belum ada lampiran</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info & Stay History */}
        <div className="lg:w-2/3 space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-border-default px-6 py-4 flex items-center gap-2">
              <User size={18} className="text-brand-primary" />
              <h4 className="font-bold text-text-primary">Informasi Lengkap</h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Nama Lengkap</p>
                <p className="text-sm font-medium text-text-primary">{residentName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">No. Telepon</p>
                <p className="text-sm font-medium text-text-primary">{residentPhone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Email</p>
                <p className="text-sm font-medium text-text-primary">{residentEmail}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Kontak Darurat</p>
                <div className="flex items-center gap-2 text-danger">
                  <ShieldAlert size={14} />
                  <p className="text-sm font-bold">{resident.emergency_contact || '-'}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Catatan</p>
                <p className="text-sm text-text-secondary bg-slate-50 p-4 rounded-xl italic">
                  "{resident.notes || 'Tidak ada catatan.'}"
                </p>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
             <div className="border-b border-border-default px-6 py-4 flex items-center gap-2">
              <MapPin size={18} className="text-brand-primary" />
              <h4 className="font-bold text-text-primary">Riwayat Hunian</h4>
            </div>
            <div className="p-6">
              {resident.history && resident.history.length > 0 ? (
                <div className="space-y-4">
                    {resident.history.map((stay) => (
                    <div key={stay.id} className="flex items-center justify-between p-4 rounded-xl border border-border-default hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                          stay.status === 'ACTIVE' ? 'bg-brand-primary-soft text-brand-primary' : 'bg-slate-100 text-text-secondary'
                        }`}>
                          <span className="text-[10px] font-bold leading-none">KAMAR</span>
                          <span className="text-lg font-bold">{stay.room?.room_code || '?'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{stay.room?.property?.name || 'Unknown Property'}</p>
                          <div className="flex flex-col text-[10px] text-text-secondary mt-0.5">
                            <span className="font-medium text-text-muted">
                              {new Date(stay.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - {stay.status === 'ACTIVE' ? 'Sekarang' : new Date(stay.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className={`mt-1 font-bold ${stay.status === 'ACTIVE' ? 'text-success' : 'text-text-muted'}`}>
                              {stay.status === 'ACTIVE' ? 'Sedang Berjalan' : stay.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary italic">
                  <p>Belum ada riwayat hunian.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Penghuni"
      >
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const data = {
            emergency_contact: formData.get('emergency_contact') as string,
            notes: formData.get('notes') as string,
          };
          await residentService.updateResident(resident.id, data);
          setIsEditModalOpen(false);
          fetchDetail();
        }}>
          <div>
            <label className="label-field">Nama Lengkap *</label>
            <input name="full_name" required className="input-field" defaultValue={residentName} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Email *</label>
              <input name="email" required type="email" className="input-field" defaultValue={residentEmail} disabled />
            </div>
            <div>
              <label className="label-field">Telepon</label>
              <input name="phone" className="input-field" defaultValue={residentPhone} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">No. Identitas</label>
              <input name="identity_number" className="input-field" defaultValue={resident.identity_number} />
            </div>
            <div>
              <label className="label-field">Kontak Darurat</label>
              <input name="emergency_contact" className="input-field" defaultValue={resident.emergency_contact} />
            </div>
          </div>
          <div>
            <label className="label-field">Catatan</label>
            <textarea name="notes" rows={2} className="input-field" defaultValue={resident.notes} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" className="btn-primary flex-1">Simpan Perubahan</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Konfirmasi Checkout"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut size={32} />
          </div>
          <p className="text-text-secondary">
            Apakah Anda yakin ingin melakukan checkout untuk <strong>{residentName}</strong>?
          </p>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsCheckoutModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button 
              onClick={async () => {
                await residentService.checkoutResident(resident.id);
                setIsCheckoutModalOpen(false);
                fetchDetail();
              }}
              className="btn-primary bg-warning border-warning hover:bg-warning/90 flex-1"
            >
              Ya, Checkout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
