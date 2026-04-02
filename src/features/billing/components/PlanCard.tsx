import { CheckCircle2 } from 'lucide-react';
import type { Plan } from '@/api/billing.service';
import { cn } from '@/utils/cn';

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
}

export function PlanCard({ plan, isActive }: PlanCardProps) {
  return (
    <div
      className={cn(
        'card flex flex-col gap-4 p-lg transition-all',
        isActive
          ? 'border-2 border-brand-primary ring-1 ring-brand-primary/20'
          : 'hover:border-brand-primary/40'
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-bold">{plan.name}</h4>
          {isActive && (
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-xs font-bold text-white">
              Aktif
            </span>
          )}
        </div>
        <p className="mt-2 text-3xl font-bold">
          {plan.price === 0 ? 'Gratis' : `Rp ${plan.price.toLocaleString('id-ID')}`}
          {plan.price > 0 && (
            <span className="text-sm font-normal text-text-secondary">/bulan</span>
          )}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {plan.room_limit === -1 ? 'Unlimited kamar' : `Hingga ${plan.room_limit} kamar`}
        </p>
      </div>

      <ul className="flex-1 space-y-2">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="shrink-0 text-success" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={cn(
          'w-full rounded-lg py-2.5 font-semibold transition-colors',
          isActive ? 'cursor-default bg-slate-100 text-text-secondary' : 'btn-primary'
        )}
        disabled={isActive}
      >
        {isActive ? 'Paket Sekarang' : 'Pilih Paket'}
      </button>
    </div>
  );
}
