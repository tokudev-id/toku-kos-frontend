import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
}

const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full min-h-[250px] md:min-h-[300px] rounded-3xl border border-border-default bg-surface-bg/50 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Belum ada data pendapatan.</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[250px] md:min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            tickFormatter={(value) => formatCurrency(Number(value))}
            width={80}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              border: '1px solid var(--color-border-default)',
              borderRadius: '12px',
              backgroundColor: 'white',
            }}
          />
          <Bar dataKey="revenue" fill="var(--color-brand-primary)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
