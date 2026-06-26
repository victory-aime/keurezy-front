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
    isCommercial: boolean;
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
export interface IPaymentStatus {
  order_id: string;
  local_status: string;
  naboo_status: string;
  data: {
    phone: string;
    planId: string;
    address: string;
    priceXOF: number;
    username: string;
    userEmail: string;
    password: string;
    description: string;
    documents: string[];
    pricingId: string;
    agencyName: string;
    acceptTerms: boolean;
    agencyEmail: string;
    pricingType: string;
    billingCycle: BillingCycle;
    commissionRate: string;
  };
}
