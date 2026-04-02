import { useEffect, useState } from 'react';
import { billingService } from '@/api/billing.service';
import type { Plan, Subscription, UsageSummary } from '@/api/billing.service';

interface BillingPageData {
  plans: Plan[];
  subscription: Subscription | null;
  usage: UsageSummary | null;
  loading: boolean;
}

export function useBillingPageData(): BillingPageData {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [loadedPlans, loadedSubscription, loadedUsage] = await Promise.all([
          billingService.getPlans(),
          billingService.getSubscription(),
          billingService.getUsage(),
        ]);

        setPlans(loadedPlans);
        setSubscription(loadedSubscription);
        setUsage(loadedUsage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { plans, subscription, usage, loading };
}
