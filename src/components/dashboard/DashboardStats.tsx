import { Home, LayoutGrid, Users, Wallet } from 'lucide-react';
import type { DashboardSummary } from '@/api/dashboard.service';
import { StatCard } from '@/components/molecules/StatCard';

interface DashboardStatsProps {
  summary: DashboardSummary | null;
  isLoading: boolean;
}

export function DashboardStats({ summary, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-40 md:h-44 bg-white rounded-2xl border border-border-default animate-pulse"
          />
        ))}
      </div>
    );
  }

  const totalRooms = summary?.rooms.total ?? 0;
  const occupiedRooms = summary?.rooms.occupied ?? 0;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard icon={<Home size={24} />} label="Total Properti" value={summary?.properties ?? 0} />
      <StatCard icon={<LayoutGrid size={24} />} label="Tingkat Hunian" value={`${occupancyRate}%`} />
      <StatCard icon={<Users size={24} />} label="Total Penghuni" value={summary?.residents ?? 0} />
      <StatCard
        icon={<Wallet size={24} />}
        label="Total Pendapatan"
        value={`Rp ${(summary?.finance.paidAmount ?? 0).toLocaleString('id-ID')}`}
      />
    </div>
  );
}
