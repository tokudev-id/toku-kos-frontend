import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { paymentService } from '@/api/payment.service';
import type { Payment, CreatePaymentDto, PaymentMethod } from '@/api/payment.service';
import { invoiceService } from '@/api/invoice.service';
import type { Invoice } from '@/api/invoice.service';
import { Modal } from '@/components/molecules';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Tunai',
  MANUAL_TRANSFER: 'Transfer Bank',
  E_WALLET: 'E-Wallet',
};

const METHOD_CLASSES: Record<PaymentMethod, string> = {
  CASH: 'bg-green-100 text-green-700',
  MANUAL_TRANSFER: 'bg-blue-100 text-blue-700',
  E_WALLET: 'bg-purple-100 text-purple-700',
};

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function Pembayaran() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<CreatePaymentDto>({
    invoice_id: '',
    amount: 0,
    payment_method: 'MANUAL_TRANSFER',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchPayments();
    fetchUnpaidInvoices();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getPayments();
      setPayments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnpaidInvoices = async () => {
    try {
      const res = await invoiceService.getInvoices({ status: 'UNPAID' });
      const overdue = await invoiceService.getInvoices({ status: 'OVERDUE' });
      setInvoices([...res.data, ...overdue.data]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await paymentService.createPayment(form);
      setShowModal(false);
      resetForm();
      fetchPayments();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      invoice_id: '',
      amount: 0,
      payment_method: 'MANUAL_TRANSFER',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const totalThisMonth = payments
    .filter((p) => {
      const d = new Date(p.payment_date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    return !q ||
      p.invoice?.invoice_number?.toLowerCase().includes(q) ||
      p.invoice?.contract?.resident?.full_name?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pembayaran</h2>
          <p className="text-text-secondary">Riwayat dan pencatatan pembayaran penghuni.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Catat Pembayaran
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="card p-md border-l-4 border-l-success">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Bulan Ini</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalThisMonth)}</p>
        </div>
        <div className="card p-md border-l-4 border-l-brand-primary">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Pembayaran</p>
          <p className="text-xl font-bold mt-1">{payments.length}</p>
        </div>
        <div className="card p-md border-l-4 border-l-warning">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Tagihan Menunggu</p>
          <p className="text-xl font-bold mt-1">{invoices.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-md">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Cari tagihan atau penghuni..."
            className="input-field pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-md border-b border-border-default flex items-center justify-between">
          <h3 className="font-bold">Riwayat Pembayaran</h3>
          <span className="text-sm text-text-secondary">{filtered.length} transaksi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-bg border-b border-border-default">
              <tr>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">No. Tagihan</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Penghuni</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Kamar</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Jumlah</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Metode</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Tanggal</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}><td colSpan={7} className="px-md py-4"><div className="h-4 bg-slate-100 animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-md py-8 text-center text-text-secondary">Belum ada pembayaran.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-md py-4 text-sm font-medium">{p.invoice?.invoice_number ?? '-'}</td>
                    <td className="px-md py-4 text-sm font-semibold">{p.invoice?.contract?.resident?.full_name ?? '-'}</td>
                    <td className="px-md py-4 text-sm text-text-secondary">{p.invoice?.contract?.room?.room_code ?? '-'}</td>
                    <td className="px-md py-4 text-sm font-bold">{formatCurrency(p.amount)}</td>
                    <td className="px-md py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase', METHOD_CLASSES[p.payment_method])}>
                        {METHOD_LABELS[p.payment_method]}
                      </span>
                    </td>
                    <td className="px-md py-4 text-sm text-text-secondary">{new Date(p.payment_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-md py-4 text-sm text-text-secondary">{p.notes ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); resetForm(); }} 
        title="Catat Pembayaran"
        
      >
        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="label-field">Tagihan</label>
            <select
              className="input-field"
              required
              value={form.invoice_id}
              onChange={(e) => {
                const inv = invoices.find((i) => i.id === e.target.value);
                setForm((f) => ({ ...f, invoice_id: e.target.value, amount: inv?.total_amount ?? 0 }));
              }}
            >
              <option value="">Pilih tagihan yang belum dibayar...</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} — {inv.contract?.resident?.full_name} ({formatCurrency(inv.total_amount)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Jumlah Dibayar (Rp)</label>
            <input
              type="number"
              className="input-field"
              required
              min={1}
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="label-field">Metode Pembayaran</label>
            <select
              className="input-field"
              value={form.payment_method}
              onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value as PaymentMethod }))}
            >
              {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((m) => (
                <option key={m} value={m}>{METHOD_LABELS[m]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Tanggal Bayar</label>
            <input
              type="date"
              className="input-field"
              required
              value={form.payment_date}
              onChange={(e) => setForm((f) => ({ ...f, payment_date: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-field">Catatan (opsional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="cth. Bukti transfer sudah diterima"
              value={form.notes ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn-secondary flex-1" onClick={() => { setShowModal(false); resetForm(); }}>Batal</button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Catat Pembayaran'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
