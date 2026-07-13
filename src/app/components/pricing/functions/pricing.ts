import { MODELS, ENUM } from '_types/*';

export const FEATURE_LABELS: Record<
  string,
  {
    singular?: string;
    plural?: string;
    unlimited?: string;
  }
> = {
  MANAGE_PROPERTIES: {
    singular: 'bien immobilier',
    plural: 'biens immobiliers',
    unlimited: 'Biens immobiliers illimités',
  },

  PUBLISH_PROPERTIES: {
    singular: 'annonce immobilière',
    plural: 'annonces immobilières',
    unlimited: 'Annonces immobilières illimitées',
  },

  MANAGE_USERS: {
    singular: 'collaborateur',
    plural: 'collaborateurs',
    unlimited: 'Collaborateurs illimités',
  },

  BOOST_ANNONCES: {
    singular: 'mise en avant',
    plural: 'mises en avant',
    unlimited: 'Mises en avant illimitées',
  },

  MANAGE_LEADS: {
    singular: 'prospect',
    plural: 'prospects',
    unlimited: 'Prospects illimités',
  },

  VIEW_REPORTS: {
    unlimited: 'Rapports et statistiques avancés',
  },

  MANAGE_ACCOUNTING: {
    unlimited: 'Module de comptabilité',
  },

  ANNONCE_STATS: {
    unlimited: 'Statistiques des annonces',
  },

  PREMIUM_SUPPORT: {
    unlimited: 'Support premium prioritaire',
  },
};

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

export const formatLimit = (feature: MODELS.COMMON.IPlanFeature): string => {
  const key = feature.feature?.name?.toUpperCase();

  const config = FEATURE_LABELS[key];

  if (!config) return '';

  // Feature sans limite numérique
  if (feature.limit === null) {
    return config.unlimited ?? '';
  }

  // Cas simple sans pluralisation
  if (!config.singular && !config.plural) {
    return `${feature.limit} ${config.unlimited}`;
  }

  const label = feature.limit === 1 ? config.singular : config.plural;

  return `Jusqu’à ${feature.limit} ${label}`;
};

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
