import { DonutChart } from '@/components/molecules/DonutChart';

interface CostBreakdownData {
  label: string;
  value: number;
  color: string;
}

interface CostBreakdownChartProps {
  data: CostBreakdownData[];
  total: number;
}

export function CostBreakdownChart({ data, total }: CostBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full min-h-[250px] md:min-h-[300px] rounded-3xl border border-border-default bg-surface-bg/50 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Belum ada data pengeluaran.</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[250px] md:min-h-[300px] py-4">
      <DonutChart
        totalLabel="Total Cost"
        totalValue={`Rp ${total.toLocaleString('id-ID')}`}
        data={data}
      />
    </div>
  );
}
