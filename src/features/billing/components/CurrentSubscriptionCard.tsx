import { Crown } from 'lucide-react';
import type { Subscription, UsageSummary } from '@/api/billing.service';
import { cn } from '@/utils/cn';

interface CurrentSubscriptionCardProps {
  subscription: Subscription | null;
  usage: UsageSummary | null;
}

const STATUS_CLASSES: Record<string, string> = {
  ACTIVE: 'bg-success/10 text-success',
  TRIAL: 'bg-blue-100 text-blue-600',
  EXPIRED: 'bg-danger/10 text-danger',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aktif',
  TRIAL: 'Trial',
  EXPIRED: 'Kadaluarsa',
};

export function CurrentSubscriptionCard({
  subscription,
  usage,
}: CurrentSubscriptionCardProps) {
  if (!subscription) {
    return null;
  }

  const usageLimitLabel =
    usage?.plan_room_limit === -1 ? 'Unlimited' : usage?.plan_room_limit;
  const usageRatio =
    usage && usage.plan_room_limit > 0
      ? Math.min((usage.rooms_used / usage.plan_room_limit) * 100, 100)
      : 0;

  return (
    <div className="card border border-brand-primary/20 bg-brand-primary-soft/20 p-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Crown size={20} className="text-brand-primary" />
            <h3 className="text-lg font-bold">Paket Aktif: {subscription.plan_name}</h3>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-bold',
                STATUS_CLASSES[subscription.status] ?? 'bg-slate-100 text-slate-600'
              )}
            >
              {STATUS_LABELS[subscription.status] ?? subscription.status}
            </span>
            <span>
              Mulai: {new Date(subscription.started_at).toLocaleDateString('id-ID')}
            </span>
            {subscription.expires_at && (
              <span>
                Berakhir:{' '}
                {new Date(subscription.expires_at).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>

      {usage && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-text-secondary">Kamar Digunakan</span>
            <span className="font-semibold">
              {usage.rooms_used} / {usageLimitLabel}
            </span>
          </div>
          {usage.plan_room_limit !== -1 && (
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  usage.plan_room_limit > 0 && usage.rooms_used / usage.plan_room_limit > 0.8
                    ? 'bg-danger'
                    : 'bg-brand-primary'
                )}
                style={{ width: `${usageRatio}%` }}
              />
            </div>
          )}
          <p className="mt-2 text-sm text-text-secondary">
            Penghuni aktif: {usage.residents_active}
          </p>
        </div>
      )}
    </div>
  );
}
