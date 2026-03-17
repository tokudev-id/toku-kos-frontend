import { ChartCard } from '@/components/molecules/ChartCard';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CostBreakdownChart } from '@/components/dashboard/CostBreakdownChart';
import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList';
import { MaintenanceList } from '@/components/dashboard/MaintenanceList';
import { OccupancyList } from '@/components/dashboard/OccupancyList';

export default function Overview() {
  const { summary, isLoading, error, costData, totalExpenses } = useDashboard();

  return (
    <div className="w-full space-y-8 md:space-y-10 lg:space-y-10">
      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <DashboardStats summary={summary} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Performance">
            <RevenueChart data={summary?.monthlyRevenue ?? []} />
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Cost Breakdown">
            <CostBreakdownChart data={costData} total={totalExpenses} />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        <div>
          <SectionHeader title="Recent Transactions" subtitle="View your latest income activity" />
          <RecentTransactionsList reminders={summary?.paymentReminders ?? []} />
        </div>

        <div>
          <SectionHeader title="Maintenance Requests" subtitle="Active tasks requiring attention" />
          <MaintenanceList tickets={summary?.recentMaintenance ?? []} />
        </div>
      </div>

      <div>
        <SectionHeader title="Tingkat Hunian per Properti" />
        <OccupancyList entries={summary?.occupancyPerProperty ?? []} />
      </div>
    </div>
  );
}

