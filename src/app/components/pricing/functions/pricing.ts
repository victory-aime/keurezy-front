import { MODELS, ENUM } from '_types/*';
import { formatFeatureLimit } from '_utils/subscription';

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

export const getCommercialFeatures = (
  plan: MODELS.COMMON.ISubscriptionPlan,
): MODELS.COMMON.IPlanFeature[] => {
  return plan.planFeatures.filter((f) => f.feature?.isCommercial);
};

export const formatLimit = (feature: MODELS.COMMON.IPlanFeature): string =>
  formatFeatureLimit(feature.feature?.name, feature.limit);

/** Plans en vente (avec un prix), du Gratuit au plus cher. */
export const getFilteredPlans = (
  allPacks: MODELS.COMMON.ISubscriptionPlan[] | undefined,
): MODELS.COMMON.ISubscriptionPlan[] =>
  (allPacks ?? [])
    .filter((p) => Boolean(p.pricings?.length))
    .sort(
      (a, b) => (getPricing(a, 'MONTHLY')?.price ?? 0) - (getPricing(b, 'MONTHLY')?.price ?? 0),
    );

export const getBestYearlySavings = (
  filteredPlans: MODELS.COMMON.ISubscriptionPlan[] | undefined,
): number | null => {
  if (!filteredPlans?.length) return null;

  return filteredPlans.reduce<number | null>((max, plan) => {
    const yearly = plan.pricings?.find((pr) => pr.billingCycle === 'YEARLY');
    const discount = yearly?.discountPercentage;

    if (!discount) return max;
    return max === null ? discount : Math.max(max, discount);
  }, null);
};
