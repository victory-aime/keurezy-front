import { BillingCycle, COMMON, PropertyType } from '../enum';
import { IPagination } from './pagination';
interface ICreateAgency {
  name?: string;
  address?: string;
  description?: string;
  username?: string;
  userEmail?: string;
  password?: string;
  email?: string;
  phone?: string;
  userId?: string;
  acceptTerms?: boolean;
  documents?: File[];
  plan?: {
    planId: string;
    billingCycle: BillingCycle;
  };
}

interface IUpdateAgency extends ICreateAgency {
  agencyId?: string;
}
interface ICloseAgency extends IUpdateAgency {
  ownerId: string;
}

interface IAgency {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  address: string;
  phone: string;
  status: COMMON.Status;
  isApprove: boolean;
  agencyLogo?: string;
  documents: string[];
}

interface IAgencyFilters extends IPagination {
  title?: string;
  status?: COMMON.Status;
  type?: PropertyType;
}

interface IAgencyCommonParams {
  agencyId: string;
  userId: string;
}

interface IAgencySubscriptionInfo {
  plan: string;
  features: {
    id: string;
    name: string;
    category: string;
    limit: null;
  }[];
  expiresAt: string;
}

interface IAgencyStats {
  properties: {
    total: number;
    available: number;
    rented: number;
    occupancyRate: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    visitPlanned: number;
    converted: number;
    conversionRate: number;
  };
  visits: {
    total: number;
    planned: number;
    confirmed: number;
    done: number;
    cancelled: number;
  };
  tenants: {
    total: number;
    active: number;
    inactive: number;
  };
  staff: {
    total: number;
    active: number;
    inactive: number;
  };
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
}

export type {
  ICreateAgency,
  IUpdateAgency,
  ICloseAgency,
  IAgency,
  IAgencyFilters,
  IAgencyCommonParams,
  IAgencySubscriptionInfo,
  IAgencyStats,
};
