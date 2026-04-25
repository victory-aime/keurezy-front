import { ENUM, MODELS } from '_types/*';

interface PlanSelectProps {
  value: ENUM.PricingType;
  onChange: (v: ENUM.PricingType) => void;
}

interface BillingCycleToggleProps {
  value: ENUM.BillingCycle;
  onChange: (v: ENUM.BillingCycle) => void;
  yearlySavings?: number | null;
}

interface PlanCardProps {
  plan: MODELS.COMMON.ISubscriptionPlan;
  billingCycle: ENUM.BillingCycle;
  index: number;
  isSelected?: boolean;
  onSelect: (payload: { planId: string; billingCycle?: ENUM.BillingCycle }) => void;
}

export type { BillingCycleToggleProps, PlanSelectProps, PlanCardProps };
