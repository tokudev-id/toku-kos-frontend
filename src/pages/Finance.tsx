import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Mock data until Finance Service expanded
const invoices = [
  { id: '1', number: 'INV/2024/001', resident: 'Ahmad Faisal', room: 'A-101', amount: 1500000, date: '2024-03-01', status: 'PAID' },
  { id: '2', number: 'INV/2024/002', resident: 'Budi Santoso', room: 'B-202', amount: 1200000, date: '2024-03-02', status: 'PENDING' },
  { id: '3', number: 'INV/2024/003', resident: 'Citra Dewi', room: 'A-105', amount: 1500000, date: '2024-03-02', status: 'OVERDUE' },
];

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Keuangan</h2>
          <p className="text-text-secondary">Pantau tagihan dan arus kas kos Anda.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Buat Tagihan (Manual)
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="card p-md border-l-4 border-l-success">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Terbayar (Mar)</p>
          <p className="text-xl font-bold mt-1">Rp 18.500.000</p>
        </div>
        <div className="card p-md border-l-4 border-l-warning">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Menunggu</p>
          <p className="text-xl font-bold mt-1">Rp 4.200.000</p>
        </div>
        <div className="card p-md border-l-4 border-l-danger">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Tunggakan</p>
          <p className="text-xl font-bold mt-1">Rp 1.500.000</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="card p-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Cari No. Tagihan atau nama penghuni..." 
            className="input-field pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn-secondary h-11 px-4">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn-secondary h-11 px-4">
            <Download size={18} />
            Ekspor
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card overflow-hidden">
        <div className="p-md border-b border-border-default">
          <h3 className="font-bold">Semua Tagihan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-bg border-b border-border-default">
              <tr>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">No. Tagihan</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Penghuni</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Kamar</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Total</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Status</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-md py-4">
                    <div className="flex items-center gap-2">
                       <FileText size={16} className="text-text-secondary" />
                       <span className="font-medium">{inv.number}</span>
                    </div>
                  </td>
                  <td className="px-md py-4 font-semibold">{inv.resident}</td>
                  <td className="px-md py-4 text-text-secondary ">{inv.room}</td>
                  <td className="px-md py-4 font-bold">Rp {inv.amount.toLocaleString()}</td>
                  <td className="px-md py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                      inv.status === 'PAID' ? "bg-success/10 text-success" :
                      inv.status === 'PENDING' ? "bg-warning/10 text-warning" : 
                      "bg-danger/10 text-danger"
                    )}>
                      {inv.status === 'PAID' ? <CheckCircle2 size={12} /> : 
                       inv.status === 'PENDING' ? <Clock size={12} /> : 
                       <AlertCircle size={12} />}
                      {inv.status === 'PAID' ? 'Lunas' : 
                       inv.status === 'PENDING' ? 'Menunggu' : 'Tunggakan'}
                    </span>
                  </td>
                  <td className="px-md py-4 text-right">
                    <button className="text-brand-primary text-sm font-bold hover:underline">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
