import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { 
  ArrowLeft, Mail, Phone, Calendar, User, FileText, 
  MapPin, ShieldAlert, Edit2, LogOut, Download, ExternalLink,
  ChevronRight, RefreshCw, DollarSign, Settings, CheckCircle
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
  const [pageError, setPageError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Extension invoice modal
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [extensionQty, setExtensionQty] = useState(1);
  const [extensionPriceOverride, setExtensionPriceOverride] = useState('');
  const [extensionDueDate, setExtensionDueDate] = useState('');
  const [isSubmittingExtension, setIsSubmittingExtension] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);
  const [extensionSuccess, setExtensionSuccess] = useState(false);

  // Adjust price modal
  const [isAdjustPriceModalOpen, setIsAdjustPriceModalOpen] = useState(false);
  const [adjustPriceValue, setAdjustPriceValue] = useState('');
  const [isSubmittingAdjustPrice, setIsSubmittingAdjustPrice] = useState(false);
  const [adjustPriceError, setAdjustPriceError] = useState<string | null>(null);
  const [adjustPriceSuccess, setAdjustPriceSuccess] = useState(false);

  // Contract settings modal
  const [isContractSettingsModalOpen, setIsContractSettingsModalOpen] = useState(false);
  const [settingsStartDate, setSettingsStartDate] = useState('');
  const [settingsEndDate, setSettingsEndDate] = useState('');
  const [settingsBillingCycle, setSettingsBillingCycle] = useState(1);
  const [settingsForce, setSettingsForce] = useState(false);
  const [isSubmittingSettings, setIsSubmittingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setPageError(null);
    try {
      const data = await residentService.getResident(id);
      setResident(data);
    } catch {
      setPageError('Data penghuni tidak dapat dimuat. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading) {
    return <div className="p-xl text-center animate-pulse">Memuat data penghuni...</div>;
  }

  if (pageError || !resident) {
    return (
      <div className="card p-lg text-center space-y-4">
        <p className="text-danger font-medium">{pageError || 'Data penghuni tidak ditemukan.'}</p>
        <div className="flex justify-center gap-3">
          <button className="btn-secondary" onClick={() => navigate('/residents')}>Kembali ke daftar</button>
          <button className="btn-primary" onClick={fetchDetail}>Muat ulang</button>
        </div>
      </div>
    );
  }

  const profile = resident.profile;
  const residentName = profile?.full_name || resident.full_name || '-';
  const residentEmail = profile?.email || resident.email || '-';
  const residentPhone = profile?.phone_number || resident.phone || '-';
  const residentKtpUrl = profile?.identity_card_url || resident.identity_card_url;
  const activeContract = resident.history?.find((stay) => stay.status === 'ACTIVE');
  const nextBillingDate = activeContract?.end_date
    ? new Date(activeContract.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

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
                  onClick={() => { setEditError(null); setIsEditModalOpen(true); }}
                  className="btn-secondary text-xs py-2.5"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => { setCheckoutError(null); setIsCheckoutModalOpen(true); }}
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
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Tagihan Berikutnya</p>
                <p className="text-sm font-medium text-text-primary">{nextBillingDate}</p>
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

          {activeContract && (
            <div className="card overflow-hidden">
              <div className="border-b border-border-default px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw size={18} className="text-brand-primary" />
                  <h4 className="font-bold text-text-primary">Manajemen Kontrak</h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-success/10 text-success">Aktif</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Kamar</p>
                    <p className="text-sm font-bold text-text-primary">{activeContract.room?.room_code || '-'}</p>
                    <p className="text-xs text-text-muted">{activeContract.room?.property?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Mulai</p>
                    <p className="text-sm font-medium text-text-primary">{new Date(activeContract.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Berakhir / Tagihan</p>
                    <p className="text-sm font-medium text-text-primary">{new Date(activeContract.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Harga/Bulan</p>
                    <p className="text-sm font-bold text-brand-primary">Rp {Number(activeContract.agreed_price_per_month).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Siklus Tagihan</p>
                    <p className="text-sm font-medium text-text-primary">{(activeContract.billing_cycle_months ?? 1) === 1 ? 'Bulanan' : `${activeContract.billing_cycle_months} Bln sekali`}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setExtensionQty(1);
                      setExtensionPriceOverride('');
                      setExtensionDueDate('');
                      setExtensionError(null);
                      setExtensionSuccess(false);
                      setIsExtensionModalOpen(true);
                    }}
                    className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
                  >
                    <RefreshCw size={15} /> Perpanjang Sewa
                  </button>
                  <button
                    onClick={() => {
                      setAdjustPriceValue(String(activeContract.agreed_price_per_month));
                      setAdjustPriceError(null);
                      setAdjustPriceSuccess(false);
                      setIsAdjustPriceModalOpen(true);
                    }}
                    className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-2"
                  >
                    <DollarSign size={15} /> Sesuaikan Harga
                  </button>
                  <button
                    onClick={() => {
                      setSettingsStartDate(activeContract.start_date.split('T')[0]);
                      setSettingsEndDate(activeContract.end_date.split('T')[0]);
                      setSettingsBillingCycle(activeContract.billing_cycle_months ?? 1);
                      setSettingsForce(false);
                      setSettingsError(null);
                      setSettingsSuccess(false);
                      setIsContractSettingsModalOpen(true);
                    }}
                    className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-2"
                  >
                    <Settings size={15} /> Pengaturan Kontrak
                  </button>
                </div>
              </div>
            </div>
          )}

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
        onClose={() => { setIsEditModalOpen(false); setEditError(null); }}
        title="Edit Data Penghuni"
      >
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          setEditError(null);
          setIsSavingEdit(true);
          const form = e.currentTarget;
          const formData = new FormData(form);
          const data = {
            emergency_contact: formData.get('emergency_contact') as string,
            notes: formData.get('notes') as string,
          };
          try {
            await residentService.updateResident(resident.id, data);
            setIsEditModalOpen(false);
            fetchDetail();
          } catch {
            setEditError('Gagal menyimpan perubahan. Silakan coba lagi.');
          } finally {
            setIsSavingEdit(false);
          }
        }}>
          <div className="rounded-xl border border-border-default bg-surface-bg/50 p-4 space-y-2 text-sm text-text-secondary">
            <p>
              Informasi profil ditampilkan sebagai referensi. Perubahan dari halaman ini hanya untuk <span className="font-semibold text-text-primary">Kontak Darurat</span> dan <span className="font-semibold text-text-primary">Catatan</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <p><span className="font-semibold text-text-primary">Nama:</span> {residentName}</p>
              <p><span className="font-semibold text-text-primary">Email:</span> {residentEmail}</p>
              <p><span className="font-semibold text-text-primary">Telepon:</span> {residentPhone}</p>
              <p><span className="font-semibold text-text-primary">No. Identitas:</span> {resident.identity_number || '-'}</p>
            </div>
          </div>
          <div>
            <label className="label-field">Kontak Darurat</label>
            <input name="emergency_contact" className="input-field" defaultValue={resident.emergency_contact} />
          </div>
          <div>
            <label className="label-field">Catatan</label>
            <textarea name="notes" rows={2} className="input-field" defaultValue={resident.notes} />
          </div>
          {editError && (
            <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {editError}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={isSavingEdit} className="btn-primary flex-1">{isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => { setIsCheckoutModalOpen(false); setCheckoutError(null); }}
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
                setCheckoutError(null);
                setIsCheckingOut(true);
                try {
                  await residentService.checkoutResident(resident.id);
                  setIsCheckoutModalOpen(false);
                  fetchDetail();
                } catch {
                  setCheckoutError('Checkout gagal diproses. Silakan coba lagi.');
                } finally {
                  setIsCheckingOut(false);
                }
              }}
              disabled={isCheckingOut}
              className="btn-primary bg-warning border-warning hover:bg-warning/90 flex-1"
            >
              {isCheckingOut ? 'Memproses...' : 'Ya, Checkout'}
            </button>
          </div>
          {checkoutError && (
            <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {checkoutError}
            </div>
          )}
        </div>
      </Modal>

      {/* Extension Invoice Modal */}
      <Modal
        isOpen={isExtensionModalOpen}
        onClose={() => { setIsExtensionModalOpen(false); setExtensionSuccess(false); }}
        title="Perpanjang Sewa"
      >
        {extensionSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <p className="font-semibold text-text-primary">Invoice perpanjangan berhasil dibuat!</p>
            <p className="text-sm text-text-secondary">Invoice berstatus <strong>UNPAID</strong> telah dikirim. Kontrak akan otomatis diperpanjang setelah pembayaran diverifikasi.</p>
            <button className="btn-primary w-full mt-2" onClick={() => { setIsExtensionModalOpen(false); setExtensionSuccess(false); }}>Tutup</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!activeContract) return;
            setExtensionError(null);
            setIsSubmittingExtension(true);
            try {
              const price = extensionPriceOverride ? Number(extensionPriceOverride) : undefined;
              await residentService.generateExtensionInvoice(activeContract.id, extensionQty, price, extensionDueDate || undefined);
              setExtensionSuccess(true);
              fetchDetail();
            } catch (err: any) {
              const msg = err?.response?.data?.message || 'Gagal membuat invoice perpanjangan.';
              setExtensionError(Array.isArray(msg) ? msg.join(', ') : msg);
            } finally {
              setIsSubmittingExtension(false);
            }
          }}>
            <div className="rounded-xl border border-border-default bg-surface-bg/50 p-4 space-y-1 text-sm">
              <p className="text-text-secondary">Sistem akan membuat <strong className="text-text-primary">invoice UNPAID</strong> yang terhubung ke kontrak ini. Setelah pembayaran diverifikasi, kontrak akan otomatis diperpanjang.</p>
            </div>
            <div>
              <label className="label-field">Durasi Perpanjangan (Bulan) <span className="text-danger">*</span></label>
              <select
                className="input-field"
                value={extensionQty}
                onChange={(e) => setExtensionQty(Number(e.target.value))}
              >
                {[1,2,3,4,5,6,9,12].map(m => (
                  <option key={m} value={m}>{m} Bulan</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Harga per Bulan (Rp){extensionPriceOverride === '' && activeContract && <span className="text-text-muted font-normal ml-1">— default: Rp {Number(activeContract.agreed_price_per_month).toLocaleString('id-ID')}</span>}</label>
              <input
                type="number"
                min="0"
                className="input-field"
                placeholder={activeContract ? String(activeContract.agreed_price_per_month) : ''}
                value={extensionPriceOverride}
                onChange={(e) => setExtensionPriceOverride(e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Tanggal Jatuh Tempo <span className="text-text-muted font-normal">(opsional — default: tanggal akhir kontrak)</span></label>
              <input
                type="date"
                className="input-field"
                value={extensionDueDate}
                onChange={(e) => setExtensionDueDate(e.target.value)}
              />
            </div>
            {activeContract && (
              <div className="rounded-xl border border-brand-primary/20 bg-brand-primary-soft/30 p-4 text-sm">
                <p className="font-semibold text-text-primary mb-1">Ringkasan Invoice</p>
                <p className="text-text-secondary">Total: <strong>Rp {((extensionPriceOverride ? Number(extensionPriceOverride) : Number(activeContract.agreed_price_per_month)) * extensionQty).toLocaleString('id-ID')}</strong> ({extensionQty} bln × Rp {(extensionPriceOverride ? Number(extensionPriceOverride) : Number(activeContract.agreed_price_per_month)).toLocaleString('id-ID')})</p>
              </div>
            )}
            {extensionError && (
              <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{extensionError}</div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsExtensionModalOpen(false)} className="btn-secondary flex-1">Batal</button>
              <button type="submit" disabled={isSubmittingExtension} className="btn-primary flex-1">
                {isSubmittingExtension ? 'Membuat Invoice...' : 'Buat Invoice Perpanjangan'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Adjust Price Modal */}
      <Modal
        isOpen={isAdjustPriceModalOpen}
        onClose={() => { setIsAdjustPriceModalOpen(false); setAdjustPriceSuccess(false); }}
        title="Sesuaikan Harga Sewa"
      >
        {adjustPriceSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <p className="font-semibold text-text-primary">Harga berhasil diperbarui!</p>
            <p className="text-sm text-text-secondary">Invoice mendatang akan menggunakan harga baru ini. Invoice yang sudah ada tidak terpengaruh.</p>
            <button className="btn-primary w-full" onClick={() => { setIsAdjustPriceModalOpen(false); setAdjustPriceSuccess(false); }}>Tutup</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!activeContract || !id) return;
            const price = Number(adjustPriceValue);
            if (isNaN(price) || price < 0) { setAdjustPriceError('Harga tidak valid.'); return; }
            setAdjustPriceError(null);
            setIsSubmittingAdjustPrice(true);
            try {
              await residentService.updateContract(id, activeContract.id, { agreed_price_per_month: price });
              setAdjustPriceSuccess(true);
              fetchDetail();
            } catch (err: any) {
              const msg = err?.response?.data?.message || 'Gagal memperbarui harga.';
              setAdjustPriceError(Array.isArray(msg) ? msg.join(', ') : msg);
            } finally {
              setIsSubmittingAdjustPrice(false);
            }
          }}>
            <div className="rounded-xl border border-border-default bg-surface-bg/50 p-4 text-sm text-text-secondary">
              Perubahan harga hanya berlaku untuk invoice yang dibuat <strong className="text-text-primary">setelah</strong> penyesuaian ini. Invoice yang sudah ada tidak akan berubah.
            </div>
            <div>
              <label className="label-field">Harga Baru per Bulan (Rp) <span className="text-danger">*</span></label>
              <input
                type="number"
                min="0"
                required
                className="input-field"
                value={adjustPriceValue}
                onChange={(e) => setAdjustPriceValue(e.target.value)}
              />
            </div>
            {adjustPriceError && (
              <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{adjustPriceError}</div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsAdjustPriceModalOpen(false)} className="btn-secondary flex-1">Batal</button>
              <button type="submit" disabled={isSubmittingAdjustPrice} className="btn-primary flex-1">
                {isSubmittingAdjustPrice ? 'Menyimpan...' : 'Simpan Harga Baru'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Contract Settings Modal */}
      <Modal
        isOpen={isContractSettingsModalOpen}
        onClose={() => { setIsContractSettingsModalOpen(false); setSettingsSuccess(false); }}
        title="Pengaturan Kontrak"
      >
        {settingsSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <p className="font-semibold text-text-primary">Kontrak berhasil diperbarui!</p>
            <button className="btn-primary w-full" onClick={() => { setIsContractSettingsModalOpen(false); setSettingsSuccess(false); }}>Tutup</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!activeContract || !id) return;
            setSettingsError(null);
            setIsSubmittingSettings(true);
            try {
              await residentService.updateContract(id, activeContract.id, {
                start_date: settingsStartDate || undefined,
                end_date: settingsEndDate || undefined,
                billing_cycle_months: settingsBillingCycle,
                force: settingsForce,
              });
              setSettingsSuccess(true);
              fetchDetail();
            } catch (err: any) {
              const msg = err?.response?.data?.message || 'Gagal memperbarui kontrak.';
              setSettingsError(Array.isArray(msg) ? msg.join(', ') : msg);
            } finally {
              setIsSubmittingSettings(false);
            }
          }}>
            <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-text-secondary">
              <strong className="text-text-primary">Admin Override</strong> — Perubahan tanggal berlaku langsung tanpa invoice. Gunakan untuk koreksi input salah atau penyesuaian offline.
            </div>
            <div>
              <label className="label-field">Tanggal Mulai</label>
              <input
                type="date"
                className="input-field"
                value={settingsStartDate}
                onChange={(e) => setSettingsStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Tanggal Berakhir</label>
              <input
                type="date"
                className="input-field"
                value={settingsEndDate}
                onChange={(e) => { setSettingsEndDate(e.target.value); setSettingsForce(false); }}
              />
            </div>
            <div>
              <label className="label-field">Siklus Tagihan (Billing Cycle)</label>
              <select
                className="input-field"
                value={settingsBillingCycle}
                onChange={(e) => setSettingsBillingCycle(Number(e.target.value))}
              >
                {[1, 2, 3, 6, 12].map((m) => (
                  <option key={m} value={m}>
                    {m === 1 ? 'Bulanan (1 Bulan)' : m === 12 ? 'Tahunan (12 Bulan)' : `${m} Bulan sekali`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1">Invoice otomatis berikutnya akan dibuat untuk <strong>{settingsBillingCycle} bulan</strong> sekaligus.</p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border-default bg-surface-bg/50">
              <input
                id="force-flag"
                type="checkbox"
                className="mt-0.5 cursor-pointer accent-warning"
                checked={settingsForce}
                onChange={(e) => setSettingsForce(e.target.checked)}
              />
              <label htmlFor="force-flag" className="text-sm text-text-secondary cursor-pointer">
                <strong className="text-warning">Paksa perubahan mundur</strong> — Izinkan tanggal berakhir sebelum hari ini (koreksi input salah).
              </label>
            </div>
            {settingsError && (
              <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{settingsError}</div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsContractSettingsModalOpen(false)} className="btn-secondary flex-1">Batal</button>
              <button type="submit" disabled={isSubmittingSettings} className="btn-primary flex-1">
                {isSubmittingSettings ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
