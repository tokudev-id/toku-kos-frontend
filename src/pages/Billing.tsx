import { useState, useEffect } from 'react';
import { CheckCircle2, Crown } from 'lucide-react';
import { billingService } from '@/api/billing.service';
import type { Plan, Subscription, UsageSummary } from '@/api/billing.service';
import { cn } from '@/utils/cn';

export default function Billing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s, u] = await Promise.all([
          billingService.getPlans(),
          billingService.getSubscription(),
          billingService.getUsage(),
        ]);
        setPlans(p);
        setSubscription(s);
        setUsage(u);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-lg">
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {[1, 2, 3].map((i) => <div key={i} className="card h-64 animate-pulse bg-slate-50" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      <div>
        <h2 className="text-2xl font-bold">Billing & Langganan</h2>
        <p className="text-text-secondary">Kelola paket langganan dan lihat penggunaan akun Anda.</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <div className="card p-lg border border-brand-primary/20 bg-brand-primary-soft/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown size={20} className="text-brand-primary" />
                <h3 className="font-bold text-lg">Paket Aktif: {subscription.plan_name}</h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', STATUS_CLASSES[subscription.status] ?? 'bg-slate-100 text-slate-600')}>
                  {STATUS_LABELS[subscription.status] ?? subscription.status}
                </span>
                <span>Mulai: {new Date(subscription.started_at).toLocaleDateString('id-ID')}</span>
                {subscription.expires_at && (
                  <span>Berakhir: {new Date(subscription.expires_at).toLocaleDateString('id-ID')}</span>
                )}
              </div>
            </div>
          </div>

          {usage && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Kamar Digunakan</span>
                <span className="font-semibold">{usage.rooms_used} / {usage.plan_room_limit === -1 ? 'Unlimited' : usage.plan_room_limit}</span>
              </div>
              {usage.plan_room_limit !== -1 && (
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={cn('h-2 rounded-full transition-all', usage.rooms_used / usage.plan_room_limit > 0.8 ? 'bg-danger' : 'bg-brand-primary')}
                    style={{ width: `${Math.min((usage.rooms_used / usage.plan_room_limit) * 100, 100)}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-text-secondary mt-2">Penghuni aktif: {usage.residents_active}</p>
            </div>
          )}
        </div>
      )}

      {/* Plans */}
      <div>
        <h3 className="font-bold text-lg mb-md">Pilihan Paket</h3>
        {plans.length === 0 ? (
          <div className="card p-xl text-center text-text-secondary">
            <p>Informasi paket tidak tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {plans.map((plan) => {
              const isActive = subscription?.plan_name === plan.name;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    'card p-lg flex flex-col gap-4 transition-all',
                    isActive ? 'border-2 border-brand-primary ring-1 ring-brand-primary/20' : 'hover:border-brand-primary/40'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xl">{plan.name}</h4>
                      {isActive && (
                        <span className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full font-bold">Aktif</span>
                      )}
                    </div>
                    <p className="text-3xl font-bold mt-2">
                      {plan.price === 0 ? 'Gratis' : `Rp ${plan.price.toLocaleString('id-ID')}`}
                      {plan.price > 0 && <span className="text-sm text-text-secondary font-normal">/bulan</span>}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {plan.room_limit === -1 ? 'Unlimited kamar' : `Hingga ${plan.room_limit} kamar`}
                    </p>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {plan.features?.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={cn('w-full py-2.5 rounded-lg font-semibold transition-colors', isActive ? 'bg-slate-100 text-text-secondary cursor-default' : 'btn-primary')}
                    disabled={isActive}
                  >
                    {isActive ? 'Paket Sekarang' : 'Pilih Paket'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
