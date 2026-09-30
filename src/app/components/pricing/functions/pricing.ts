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

export const getFilteredPlans = (
  allPacks: MODELS.COMMON.ISubscriptionPlan[] | undefined,
  mode: ENUM.PricingType,
): MODELS.COMMON.ISubscriptionPlan[] => {
  if (!allPacks) return [];

  const targetCategory = mode === 'COMMISSION' ? 'COMMISSION_BASED' : 'SUBSCRIPTION_BASED';

  const filtered = allPacks
    .filter((p) => p.planCategory === targetCategory)
    .filter((p) => p.pricingType !== 'SUBSCRIPTION' || Boolean(p.pricings?.length));

  const popularPlan = filtered.find((p) => p.popular);
  const others = filtered.filter((p) => !p.popular);

  if (popularPlan && others.length >= 2) {
    return [others[1], popularPlan, others[0]];
  }

  return filtered;
};

export const getBestYearlySavings = (
  mode: ENUM.PricingType,
  filteredPlans: MODELS.COMMON.ISubscriptionPlan[] | undefined,
): number | null => {
  if (mode !== 'SUBSCRIPTION') return null;
  if (!filteredPlans?.length) return null;

  return filteredPlans.reduce<number | null>((max, plan) => {
    const yearly = plan.pricings?.find((pr) => pr.billingCycle === 'YEARLY');
    const discount = yearly?.discountPercentage;

    if (!discount) return max;
    return max === null ? discount : Math.max(max, discount);
  }, null);
};
