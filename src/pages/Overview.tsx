import { useEffect, useState } from 'react';
import { Home, Users, DoorOpen, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { dashboardService } from '@/api/dashboard.service';
import type { DashboardSummary } from '@/api/dashboard.service';
import { cn } from '@/utils/cn';

export default function Overview() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Kamar Terisi', 
      value: summary ? `${summary.rooms.occupied}/${summary.rooms.total}` : '0/0', 
      change: 'Hunian saat ini', 
      trend: 'up', 
      icon: DoorOpen 
    },
    { 
      label: 'Total Penghuni', 
      value: summary?.residents?.toString() || '0', 
      change: 'Aktif terpantau', 
      trend: 'up', 
      icon: Users 
    },
    { 
      label: 'Pendapatan', 
      value: summary ? `Rp ${summary.finance.paidAmount.toLocaleString()}` : 'Rp 0', 
      change: 'Bulan ini', 
      trend: 'up', 
      icon: Wallet 
    },
    { 
      label: 'Tunggakan', 
      value: summary ? `Rp ${(summary.finance.totalAmount - summary.finance.paidAmount).toLocaleString()}` : 'Rp 0', 
      change: 'Perlu ditagih', 
      trend: 'down', 
      icon: Home 
    },
  ];

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Halo, Budi!</h2>
          <p className="text-text-secondary">Ini ringkasan kos Kosan Asri Anda hari ini.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Buat Tagihan Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="card h-32 animate-pulse bg-slate-50" />)
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-brand-primary-soft text-brand-primary rounded-lg">
                  <stat.icon size={20} />
                </div>
                <span className={cn(
                  "flex items-center text-xs font-medium",
                  stat.trend === 'up' ? "text-success" : "text-warning"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Placeholder for Charts/Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 card h-80 flex flex-col justify-center items-center text-text-secondary italic">
          <p>Grafik Arus Kas (Sistem Integrasi Sedang Disiapkan)</p>
          <p className="text-xs mt-2 not-italic text-slate-400">Hubungkan bank untuk fitur otomatis</p>
        </div>
        <div className="card h-80 p-md flex flex-col">
          <h3 className="font-bold mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-border-default hover:border-brand-primary hover:bg-brand-primary-soft transition-all group">
              <p className="font-bold text-sm group-hover:text-brand-primary">Daftarkan Penghuni Baru</p>
              <p className="text-xs text-text-secondary">Input data KTP dan kontak</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border-default hover:border-brand-primary hover:bg-brand-primary-soft transition-all group">
              <p className="font-bold text-sm group-hover:text-brand-primary">Check-in Kamar</p>
              <p className="text-xs text-text-secondary">Hubungkan penghuni ke nomor kamar</p>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-border-default hover:border-brand-primary hover:bg-brand-primary-soft transition-all group">
              <p className="font-bold text-sm group-hover:text-brand-primary">Rekap Biaya Listrik</p>
              <p className="text-xs text-text-secondary">Input meteran bulanan</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
