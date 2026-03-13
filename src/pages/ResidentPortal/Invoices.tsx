import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import api from '@/api/axios';
import type { Invoice, InvoiceStatus } from '@/api/invoice.service';

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

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function ResidentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Invoice[]; total: number }>('/finance/my-invoices');
      setInvoices(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const unpaidCount = invoices.filter((i) => i.status === 'UNPAID' || i.status === 'OVERDUE').length;
  const totalUnpaid = invoices
    .filter((i) => i.status === 'UNPAID' || i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.total_amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tagihan Saya</h2>
        <p className="text-text-secondary">Riwayat semua tagihan kamar Anda.</p>
      </div>

      {/* Summary */}
      {unpaidCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-md flex gap-3 items-start">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-amber-900 font-bold text-sm">{unpaidCount} Tagihan Belum Dibayar</p>
            <p className="text-amber-700 text-sm">Total: {formatCurrency(totalUnpaid)}</p>
          </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="bg-surface-card border border-border-default rounded-xl h-20 animate-pulse bg-slate-50" />)
        ) : invoices.length === 0 ? (
          <div className="bg-surface-card border border-border-default rounded-2xl p-xl flex flex-col items-center text-text-secondary gap-2">
            <FileText size={40} className="opacity-30" />
            <p className="font-medium">Belum ada tagihan.</p>
          </div>
        ) : (
          invoices.map((inv) => (
            <button
              key={inv.id}
              className="bg-surface-card border border-border-default rounded-2xl p-md w-full text-left hover:border-brand-primary transition-colors"
              onClick={() => setSelectedInvoice(inv)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', inv.status === 'PAID' ? 'bg-success/10' : 'bg-warning/10')}>
                    <FileText size={20} className={inv.status === 'PAID' ? 'text-success' : 'text-warning'} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{inv.invoice_number}</p>
                    <p className="text-text-secondary text-xs">{inv.period ?? 'Tagihan'} • Jatuh tempo: {new Date(inv.due_date).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(inv.total_amount)}</p>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_CLASSES[inv.status])}>
                    {STATUS_LABELS[inv.status]}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-lg border-b border-border-default flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedInvoice.invoice_number}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-text-secondary hover:text-text-primary text-xl">✕</button>
            </div>
            <div className="p-lg space-y-3">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Periode</span><span>{selectedInvoice.period ?? '-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Jatuh Tempo</span><span>{new Date(selectedInvoice.due_date).toLocaleDateString('id-ID')}</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Status</span>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', STATUS_CLASSES[selectedInvoice.status])}>
                  {STATUS_LABELS[selectedInvoice.status]}
                </span>
              </div>
              <hr className="border-border-default" />
              {selectedInvoice.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} <span className="text-text-secondary text-xs">x{item.qty}</span></span>
                  <span>{formatCurrency(item.unit_price * item.qty)}</span>
                </div>
              ))}
              {(selectedInvoice.discount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-success"><span>Diskon</span><span>-{formatCurrency(selectedInvoice.discount ?? 0)}</span></div>
              )}
              <hr className="border-border-default" />
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(selectedInvoice.total_amount)}</span></div>
              {selectedInvoice.paid_date && (
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle2 size={16} />
                  <span>Dibayar pada {new Date(selectedInvoice.paid_date).toLocaleDateString('id-ID')}</span>
                </div>
              )}
              {(selectedInvoice.status === 'UNPAID' || selectedInvoice.status === 'OVERDUE') && (
                <div className="pt-2 border-t border-border-default">
                  <p className="text-sm text-text-secondary mb-2">Untuk membayar, silahkan transfer ke rekening yang tertera di pengumuman kos.</p>
                </div>
              )}
              {selectedInvoice.status === 'VERIFICATION_PENDING' && (
                <div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-50 rounded-lg p-3">
                  <Clock size={16} />
                  <span>Pembayaran sedang diverifikasi oleh pengelola.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
