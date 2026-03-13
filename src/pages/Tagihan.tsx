import { useState, useEffect } from 'react';
import {
  Plus, Search, FileText, CheckCircle2, Clock, AlertCircle, Eye, ChevronDown,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { invoiceService } from '@/api/invoice.service';
import type { Invoice, InvoiceStatus, CreateInvoiceDto, InvoiceItemCategory } from '@/api/invoice.service';
import { residentService } from '@/api/resident.service';
import type { Resident } from '@/api/resident.service';

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  UNPAID: 'Belum Bayar',
  VERIFICATION_PENDING: 'Menunggu Verifikasi',
  PAID: 'Lunas',
  OVERDUE: 'Jatuh Tempo',
};

const STATUS_CLASSES: Record<InvoiceStatus, string> = {
  UNPAID: 'bg-warning/10 text-warning',
  VERIFICATION_PENDING: 'bg-blue-100 text-blue-600',
  PAID: 'bg-success/10 text-success',
  OVERDUE: 'bg-danger/10 text-danger',
};

const ITEM_CATEGORIES: InvoiceItemCategory[] = ['Sewa', 'Listrik', 'Air', 'Internet', 'Lainnya'];

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function Tagihan() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CreateInvoiceDto>({
    resident_id: '',
    items: [{ name: 'Sewa Kamar', qty: 1, unit_price: 0, category: 'Sewa' }],
    due_date: '',
    period: '',
    discount: 0,
  });

  useEffect(() => {
    fetchInvoices();
    fetchResidents();
  }, [filterStatus]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await invoiceService.getInvoices(filterStatus ? { status: filterStatus } : undefined);
      setInvoices(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await residentService.getResidents(1, 100);
      setResidents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await invoiceService.createInvoice(form);
      setShowModal(false);
      resetForm();
      fetchInvoices();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await invoiceService.verifyInvoice(id);
      fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setForm({
      resident_id: '',
      items: [{ name: 'Sewa Kamar', qty: 1, unit_price: 0, category: 'Sewa' }],
      due_date: '',
      period: '',
      discount: 0,
    });
  };

  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { name: '', qty: 1, unit_price: 0, category: 'Lainnya' }] }));
  };

  const removeItem = (idx: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const updateItem = (idx: number, key: string, value: string | number) => {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...f, items };
    });
  };

  const totalAmount = form.items.reduce((sum, item) => sum + (item.qty ?? 1) * item.unit_price, 0) - (form.discount ?? 0);

  const filtered = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return !q ||
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.resident?.full_name?.toLowerCase().includes(q) ||
      inv.resident?.room?.room_code?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tagihan</h2>
          <p className="text-text-secondary">Kelola semua tagihan penghuni kos Anda.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Buat Tagihan
        </button>
      </div>

      {/* Filters */}
      <div className="card p-md flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Cari no. tagihan atau nama penghuni..."
            className="input-field pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="input-field h-11 pr-8 appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | '')}
          >
            <option value="">Semua Status</option>
            {(Object.keys(STATUS_LABELS) as InvoiceStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-md border-b border-border-default flex items-center justify-between">
          <h3 className="font-bold">Daftar Tagihan</h3>
          <span className="text-sm text-text-secondary">{filtered.length} tagihan</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-bg border-b border-border-default">
              <tr>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">No. Tagihan</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Penghuni</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Kamar</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Periode</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Total</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Jatuh Tempo</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Status</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}><td colSpan={8} className="px-md py-4"><div className="h-4 bg-slate-100 animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-md py-8 text-center text-text-secondary">Belum ada tagihan.</td></tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-md py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-text-secondary" />
                        <span className="font-medium text-sm">{inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-md py-4 font-semibold text-sm">{inv.resident?.full_name ?? '-'}</td>
                    <td className="px-md py-4 text-sm text-text-secondary">{inv.resident?.room?.room_code ?? '-'}</td>
                    <td className="px-md py-4 text-sm text-text-secondary">{inv.period ?? '-'}</td>
                    <td className="px-md py-4 font-bold text-sm">{formatCurrency(inv.total_amount)}</td>
                    <td className="px-md py-4 text-sm text-text-secondary">{new Date(inv.due_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-md py-4">
                      <span className={cn('flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase', STATUS_CLASSES[inv.status])}>
                        {inv.status === 'PAID' ? <CheckCircle2 size={12} /> : inv.status === 'OVERDUE' ? <AlertCircle size={12} /> : <Clock size={12} />}
                        {STATUS_LABELS[inv.status]}
                      </span>
                    </td>
                    <td className="px-md py-4 text-right flex items-center justify-end gap-2">
                      <button className="text-brand-primary text-sm font-bold hover:underline" onClick={() => setSelectedInvoice(inv)}>
                        <Eye size={16} />
                      </button>
                      {inv.status === 'VERIFICATION_PENDING' && (
                        <button
                          className="text-success text-xs font-bold hover:underline"
                          onClick={() => handleVerify(inv.id)}
                        >
                          Verifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-lg border-b border-border-default flex items-center justify-between">
              <h3 className="font-bold text-lg">Buat Tagihan Baru</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-text-secondary hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-lg space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="label-field">Penghuni</label>
                  <select
                    className="input-field"
                    required
                    value={form.resident_id}
                    onChange={(e) => setForm((f) => ({ ...f, resident_id: e.target.value }))}
                  >
                    <option value="">Pilih penghuni...</option>
                    {residents.map((r) => (
                      <option key={r.id} value={r.id}>{r.full_name} {r.room ? `(${r.room.room_code})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-field">Periode (opsional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="cth. Januari 2025"
                    value={form.period ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-field">Jatuh Tempo</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={form.due_date}
                    onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-field">Diskon (Rp)</label>
                  <input
                    type="number"
                    className="input-field"
                    min={0}
                    value={form.discount ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-field mb-0">Item Tagihan</label>
                  <button type="button" onClick={addItem} className="btn-secondary text-xs px-3 py-1">
                    <Plus size={14} /> Tambah Item
                  </button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="input-field col-span-4"
                        placeholder="Nama item"
                        required
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      />
                      <select
                        className="input-field col-span-3"
                        value={item.category}
                        onChange={(e) => updateItem(idx, 'category', e.target.value)}
                      >
                        {ITEM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input
                        type="number"
                        className="input-field col-span-2"
                        placeholder="Qty"
                        min={1}
                        value={item.qty ?? 1}
                        onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                      />
                      <input
                        type="number"
                        className="input-field col-span-2"
                        placeholder="Harga"
                        min={0}
                        required
                        value={item.unit_price}
                        onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))}
                      />
                      <button
                        type="button"
                        disabled={form.items.length === 1}
                        onClick={() => removeItem(idx)}
                        className="text-danger col-span-1 disabled:opacity-30"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  {(form.discount ?? 0) > 0 && (
                    <p className="text-sm text-text-secondary">Diskon: -{formatCurrency(form.discount ?? 0)}</p>
                  )}
                  <p className="font-bold text-lg">Total: {formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Batal</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Buat Tagihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="p-lg border-b border-border-default flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedInvoice.invoice_number}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-text-secondary hover:text-text-primary">✕</button>
            </div>
            <div className="p-lg space-y-3">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Penghuni</span><span className="font-semibold">{selectedInvoice.resident?.full_name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Kamar</span><span>{selectedInvoice.resident?.room?.room_code ?? '-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Periode</span><span>{selectedInvoice.period ?? '-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Jatuh Tempo</span><span>{new Date(selectedInvoice.due_date).toLocaleDateString('id-ID')}</span></div>
              <hr className="border-border-default" />
              {selectedInvoice.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} <span className="text-text-secondary text-xs">({item.category})</span> x{item.qty}</span>
                  <span>{formatCurrency(item.unit_price * item.qty)}</span>
                </div>
              ))}
              {(selectedInvoice.discount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-success"><span>Diskon</span><span>-{formatCurrency(selectedInvoice.discount ?? 0)}</span></div>
              )}
              <hr className="border-border-default" />
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(selectedInvoice.total_amount)}</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Status</span>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', STATUS_CLASSES[selectedInvoice.status])}>
                  {STATUS_LABELS[selectedInvoice.status]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
