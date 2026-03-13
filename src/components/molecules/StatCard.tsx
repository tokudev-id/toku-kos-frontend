import type { ReactNode } from 'react';

import { Badge } from '../atoms/Badge';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    subtitle: string;
  };
  variant?: 'default' | 'minimal';
  className?: string;
}

export function StatCard({ icon, label, value, trend, variant = 'default', className }: StatCardProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn("bg-white p-4 rounded-xl border border-border-default flex items-center gap-4", className)}>
        <div className="w-10 h-10 rounded-lg bg-brand-primary-soft flex items-center justify-center text-brand-primary">
          {icon}
        </div>
        <div>
          <p className="text-xs text-text-secondary font-medium">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-border-default shadow-card hover:shadow-elevated transition-all duration-300", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-brand-primary-soft flex items-center justify-center text-brand-primary">
          {icon}
        </div>
        <button className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-bg transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
      <p className="text-3xl font-bold tracking-tight mb-4">{value}</p>
      
      {trend && (
        <div className="flex items-center gap-2">
          <Badge variant={trend.direction === 'up' ? 'success' : 'danger'} className="gap-1 px-1.5 py-0.5">
            {trend.direction === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}
          </Badge>
          <span className="text-xs text-text-secondary">{trend.subtitle}</span>
        </div>
      )}
    </div>
  );
}
