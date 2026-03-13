import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, AlertCircle, Users } from 'lucide-react';
import { reportService } from '@/api/report.service';
import type { ReportSummary, CashflowDataPoint } from '@/api/report.service';

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function formatTooltipValue(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function Laporan() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [cashflow, setCashflow] = useState<CashflowDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c] = await Promise.all([reportService.getSummary(), reportService.getCashflow()]);
        setSummary(s);
        setCashflow(c);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const kpiCards = summary
    ? [
        {
          label: 'Total Pemasukan (6 bln)',
          value: formatCurrency(summary.totalIncome),
          icon: TrendingUp,
          color: 'text-success',
          border: 'border-l-success',
        },
        {
          label: 'Total Pengeluaran (6 bln)',
          value: formatCurrency(summary.totalExpenses),
          icon: TrendingDown,
          color: 'text-danger',
          border: 'border-l-danger',
        },
        {
          label: 'Laba Bersih (6 bln)',
          value: formatCurrency(summary.netProfit),
          icon: DollarSign,
          color: summary.netProfit >= 0 ? 'text-success' : 'text-danger',
          border: summary.netProfit >= 0 ? 'border-l-success' : 'border-l-danger',
        },
        {
          label: 'Tagihan Lunas',
          value: summary.paidInvoices.toString(),
          icon: FileText,
          color: 'text-brand-primary',
          border: 'border-l-brand-primary',
        },
        {
          label: 'Tagihan Jatuh Tempo',
          value: summary.overdueInvoices.toString(),
          icon: AlertCircle,
          color: 'text-warning',
          border: 'border-l-warning',
        },
        {
          label: 'Penghuni Baru',
          value: summary.newResidents.toString(),
          icon: Users,
          color: 'text-blue-500',
          border: 'border-l-blue-500',
        },
      ]
    : [];

  return (
    <div className="space-y-lg">
      <div>
        <h2 className="text-2xl font-bold">Laporan</h2>
        <p className="text-text-secondary">Ringkasan keuangan dan performa kos Anda dalam 6 bulan terakhir.</p>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-md">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="card h-24 animate-pulse bg-slate-50" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-md">
          {kpiCards.map((card) => (
            <div key={card.label} className={`card p-md border-l-4 ${card.border}`}>
              <div className="flex items-center gap-2 mb-1">
                <card.icon size={16} className={card.color} />
                <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">{card.label}</p>
              </div>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cashflow Chart */}
      <div className="card p-lg">
        <div className="mb-lg">
          <h3 className="font-bold text-lg">Arus Kas 6 Bulan Terakhir</h3>
          <p className="text-sm text-text-secondary">Perbandingan pemasukan, pengeluaran, dan laba bersih.</p>
        </div>
        {loading ? (
          <div className="h-72 bg-slate-50 animate-pulse rounded-lg" />
        ) : cashflow.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-text-secondary">
            Belum ada data arus kas.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashflow} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(value) => typeof value === 'number' ? formatTooltipValue(value) : String(value)} />
              <Legend />
              <Bar dataKey="pemasukan" name="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="labaBersih" name="Laba Bersih" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Cashflow Table */}
      {cashflow.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-md border-b border-border-default">
            <h3 className="font-bold">Detail Bulanan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-bg border-b border-border-default">
                <tr>
                  <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Bulan</th>
                  <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Pemasukan</th>
                  <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Pengeluaran</th>
                  <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Laba Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {cashflow.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="px-md py-3 font-medium text-sm">{row.month}</td>
                    <td className="px-md py-3 text-right text-success font-semibold text-sm">
                      {row.pemasukan > 0 ? `Rp ${row.pemasukan.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-md py-3 text-right text-danger text-sm">
                      {row.pengeluaran > 0 ? `Rp ${row.pengeluaran.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className={`px-md py-3 text-right font-bold text-sm ${row.labaBersih >= 0 ? 'text-success' : 'text-danger'}`}>
                      Rp {row.labaBersih.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
