import { useEffect, useState } from 'react';
import { Home, TrendingUp, Wallet, Plus } from 'lucide-react';
import { dashboardService } from '@/api/dashboard.service';
import type { DashboardSummary } from '@/api/dashboard.service';
import { StatCard } from '@/components/molecules/StatCard';
import { ChartCard } from '@/components/molecules/ChartCard';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { TransactionItem } from '@/components/molecules/TransactionItem';
import { MaintenanceItem } from '@/components/molecules/MaintenanceItem';
import { DonutChart } from '@/components/molecules/DonutChart';
import { Button } from '@/components/atoms/Button';

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

  const costData = [
    { label: 'Maintenance', value: 45, color: 'oklch(75% 0.12 150)' },
    { label: 'Repair', value: 25, color: 'oklch(85% 0.1 80)' },
    { label: 'Taxes', value: 15, color: 'oklch(80% 0.08 200)' },
    { label: 'Saving', value: 15, color: 'oklch(75% 0.1 260)' },
  ];

  const handleCreateInvoice = () => {
    console.log('Create invoice');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-44 bg-white rounded-2xl border border-border-default animate-pulse" />)
        ) : (
          <>
            <StatCard 
              icon={<Home size={24} />} 
              label="Total Properties" 
              value={summary?.rooms.total || 0}
              trend={{ value: '20%', direction: 'up', subtitle: 'Last month total 1.050' }}
            />
            <StatCard 
              icon={<TrendingUp size={24} />} 
              label="Number of Sales" 
              value="320"
              trend={{ value: '12%', direction: 'up', subtitle: 'Global average' }}
            />
            <StatCard 
              icon={<Wallet size={24} />} 
              label="Total Revenue" 
              value={summary ? `Rp ${summary.finance.paidAmount.toLocaleString()}` : 'Rp 0'}
              trend={{ value: '8%', direction: 'up', subtitle: 'vs last month' }}
            />
          </>
        )}
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Revenue Performance" 
            action={<Button variant="ghost" size="sm" className="rounded-full">Weekly View</Button>}
          >
            <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-surface-bg/30 rounded-3xl border border-dashed border-border-default group hover:border-brand-primary/30 transition-all">
               <TrendingUp className="text-brand-primary/20 mb-3 group-hover:scale-110 transition-transform" size={48} />
               <p className="text-text-secondary italic text-sm font-medium">Analytics engine initializing...</p>
               <p className="text-[10px] text-text-secondary/60 mt-1">Connect your bank account to see real-time data</p>
            </div>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Cost Breakdown" action={<Button variant="ghost" size="sm" className="rounded-full">See Details</Button>}>
            <div className="h-full min-h-[300px] py-4">
              <DonutChart 
                totalLabel="Total Cost" 
                totalValue="Rp 4.7M" 
                data={costData} 
              />
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <SectionHeader 
            title="Recent Transactions" 
            subtitle="View your latest income activity"
            action={{ label: 'See All', onClick: () => {} }} 
          />
          <div className="space-y-1 bg-white p-3 rounded-[32px] border border-border-default shadow-sm">
            <TransactionItem 
              title="123 Maple Avenue Springfield" 
              subtitle="12 Sep 2024, 9:29" 
              amount="Rp 30.0K" 
            />
            <TransactionItem 
              title="Booking 987 Villa Street" 
              subtitle="10 Sep 2024, 9:29" 
              amount="Rp 12.5K" 
            />
             <TransactionItem 
              title="Apartment Booking Garden St" 
              subtitle="08 Sep 2024, 14:00" 
              amount="Rp 20.0K" 
            />
            <div className="p-4 mt-2">
               <Button onClick={handleCreateInvoice} className="w-full rounded-2xl py-4" variant="primary">
                 <Plus size={18} />
                 Create New Invoice
               </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
           <SectionHeader 
            title="Maintenance Requests" 
            subtitle="Active tasks requiring attention"
            action={{ label: 'See All', onClick: () => {} }} 
          />
          <div className="grid grid-cols-1 gap-4 flex-1">
            <MaintenanceItem 
              category="Plumbing"
              location="721 Meadowview"
              requestId="MR-001"
              description="Broken Garbage"
              assignee={{ name: 'Jacob Jones' }}
            />
            <MaintenanceItem 
              category="Electrical"
              location="710 Hillside"
              requestId="MR-002"
              description="Light Flickering"
              assignee={{ name: 'Albert Flores' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

