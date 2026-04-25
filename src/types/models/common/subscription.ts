import { BillingCycle, PlanCategory, PlanType, PricingType } from '../../enum';

export interface IPlanFeature {
  id: string;
  label: string;
  limit: number | null; // null = unlimited
  enabled: true;
  feature: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
}

export interface IPlanPricing {
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  discountPercentage?: number;
}

export interface ISubscriptionPlan {
  id: string;
  name: PlanType;
  planCategory: PlanCategory;
  pricingType: PricingType;
  description: string;
  commissionRate?: number;
  pricings?: IPlanPricing[];
  planFeatures: IPlanFeature[];
  popular?: boolean;
  highlight?: boolean;
}
