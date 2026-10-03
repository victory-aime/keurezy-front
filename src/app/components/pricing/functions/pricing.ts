import { MODELS, ENUM } from '_types/*';

export const getPricing = (
  plan: MODELS.COMMON.ISubscriptionPlan,
  cycle: ENUM.BillingCycle,
): MODELS.COMMON.IPlanPricing | undefined => {
  if (!plan.pricings || plan.pricings.length === 0) return undefined;
  return (
    plan.pricings.find((p) => p.billingCycle === cycle) ??
    plan.pricings.find((p) => p.billingCycle === 'MONTHLY')
  );
};

/** Plans en vente (avec un prix), du Gratuit au plus cher. */
export const getFilteredPlans = (
  allPacks: MODELS.COMMON.ISubscriptionPlan[] | undefined,
): MODELS.COMMON.ISubscriptionPlan[] =>
  (allPacks ?? [])
    .filter((p) => Boolean(p.pricings?.length))
    .sort(
      (a, b) => (getPricing(a, 'MONTHLY')?.price ?? 0) - (getPricing(b, 'MONTHLY')?.price ?? 0),
    );
