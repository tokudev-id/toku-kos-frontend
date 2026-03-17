import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DoorOpen, Wallet, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import type { Invoice } from '@/api/invoice.service';

export default function ResidentDashboard() {
  const user = useAuthStore((state) => state.user);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get<{ data: Invoice[]; total: number }>('/finance/my-invoices');
      setInvoices(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const unpaidInvoice = invoices.find((i) => i.status === 'UNPAID' || i.status === 'OVERDUE');
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="w-full space-y-6">
      {/* Welcome Section */}
      <section className="space-y-1">
        <h2 className="text-2xl font-bold">Halo, {user?.full_name}! ðŸ‘‹</h2>
        <p className="text-text-secondary">Selamat datang di portal hunian Anda.</p>
      </section>

      {/* Room Status Card */}
      <div className="bg-brand-primary text-white rounded-2xl p-lg shadow-lg shadow-brand-primary/20 flex items-center justify-between border border-white/10">
        <div className="space-y-1">
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Kamar Anda</p>
          <h3 className="text-2xl font-bold">{user?.company_name ?? 'TokuKos'}</h3>
          <p className="text-white/90 text-sm">Penghuni aktif</p>
        </div>
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <DoorOpen size={32} />
        </div>
      </div>

      {/* Unpaid Alert */}
      {unpaidInvoice && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-md flex gap-3 items-center">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-amber-900 font-bold text-sm">Tagihan Belum Dibayar</p>
            <p className="text-amber-700 text-xs">
              {unpaidInvoice.period ?? unpaidInvoice.invoice_number} â€¢ Rp {unpaidInvoice.total_amount.toLocaleString('id-ID')}
            </p>
          </div>
          <Link to="/resident/invoices" className="btn-secondary py-1.5 px-3 h-auto text-xs font-bold border-amber-300">
            Lihat
          </Link>
        </div>
      )}

      {/* Recent Invoices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Riwayat Tagihan</h3>
          <Link to="/resident/invoices" className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
            Lihat semua <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          [1, 2].map((i) => <div key={i} className="bg-surface-card border border-border-default rounded-xl h-16 animate-pulse bg-slate-50" />)
        ) : recentInvoices.length === 0 ? (
          <div className="bg-surface-card border border-border-default rounded-2xl p-lg text-center text-text-secondary text-sm">
            Belum ada tagihan.
          </div>
        ) : (
          <div className="space-y-3">
            {recentInvoices.map((inv) => (
              <Link
                key={inv.id}
                to="/resident/invoices"
                className="bg-surface-card border border-border-default rounded-xl p-md flex items-center justify-between hover:border-brand-primary transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${inv.status === 'PAID' ? 'bg-success/10' : 'bg-warning/10'}`}>
                    <Wallet size={20} className={inv.status === 'PAID' ? 'text-success' : 'text-warning'} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{inv.period ?? inv.invoice_number}</p>
                    <p className="text-text-secondary text-xs">Jatuh tempo: {new Date(inv.due_date).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-sm">Rp {inv.total_amount.toLocaleString('id-ID')}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      inv.status === 'PAID' ? 'bg-success/10 text-success' :
                      inv.status === 'OVERDUE' ? 'bg-danger/10 text-danger' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {inv.status === 'PAID' ? 'Lunas' : inv.status === 'OVERDUE' ? 'Jatuh Tempo' : inv.status === 'VERIFICATION_PENDING' ? 'Diverifikasi' : 'Belum Bayar'}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Support Message */}
      <div className="bg-surface-bg border-2 border-dashed border-border-default rounded-2xl p-lg text-center space-y-2">
        <p className="text-sm font-medium text-text-secondary">Punya kendala dengan kamar Anda?</p>
        <Link to="/resident/maintenance" className="text-brand-primary font-bold text-sm hover:underline">Ajukan Keluhan</Link>
      </div>
    </div>
  );
}
