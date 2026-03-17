import { useCallback, useEffect, useMemo, useState } from 'react';
import { dashboardService, type DashboardSummary } from '@/api/dashboard.service';

interface DashboardCache {
  data: DashboardSummary;
  fetchedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const CHART_COLORS = [
  'var(--color-brand-primary)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-accent-warm)',
] as const;

let dashboardCache: DashboardCache | null = null;

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(dashboardCache?.data ?? null);
  const [isLoading, setIsLoading] = useState(!dashboardCache);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await dashboardService.getSummary();
      dashboardCache = { data, fetchedAt: Date.now() };
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isStale = !dashboardCache || Date.now() - dashboardCache.fetchedAt > CACHE_TTL_MS;
    if (!isStale) {
      return;
    }

    void fetchSummary();
  }, [fetchSummary]);

  const refresh = useCallback(async () => {
    dashboardCache = null;
    await fetchSummary();
  }, [fetchSummary]);

  const costData = useMemo(
    () =>
      summary?.expenseBreakdown.map((entry, index) => ({
        label: entry.category,
        value: entry.total,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })) ?? [],
    [summary],
  );

  const totalExpenses = useMemo(
    () => costData.reduce((sum, item) => sum + item.value, 0),
    [costData],
  );

  return {
    summary,
    isLoading,
    error,
    costData,
    totalExpenses,
    refresh,
  };
}
