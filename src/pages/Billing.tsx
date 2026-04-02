import { BillingHeader } from '@/features/billing/components/BillingHeader';
import { BillingSkeleton } from '@/features/billing/components/BillingSkeleton';
import { CurrentSubscriptionCard } from '@/features/billing/components/CurrentSubscriptionCard';
import { PlanCard } from '@/features/billing/components/PlanCard';
import { useBillingPageData } from '@/features/billing/hooks/useBillingPageData';

export default function Billing() {
  const { plans, subscription, usage, loading } = useBillingPageData();

  if (loading) {
    return <BillingSkeleton />;
  }

  return (
    <div className="space-y-lg">
      <BillingHeader />

      <CurrentSubscriptionCard subscription={subscription} usage={usage} />

      <div>
        <h3 className="font-bold text-lg mb-md">Pilihan Paket</h3>
        {plans.length === 0 ? (
          <div className="card p-xl text-center text-text-secondary">
            <p>Informasi paket tidak tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={subscription?.plan_name === plan.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
