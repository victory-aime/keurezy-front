import { BillingCycle, COMMON, PlanType, PropertyType } from '../enum';
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
interface ICloseAgency {
  agencyId: string;
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
  /** Fermeture demandée par l'owner, effective à cette date (annulable d'ici là) */
  closeScheduledAt?: string | null;
}

interface IAgencyFilters extends IPagination {
  title?: string;
  status?: COMMON.Status;
  type?: PropertyType;
}

interface IAgencyCommonParams {
  agencyId: string;
}

interface IAgencySubscriptionInfo {
  plan: string;
  features: {
    id: string;
    name: string;
    category: string;
    limit: null;
  }[];
}

/** État d'un quota, calculé par le backend (`NEAR_LIMIT` dès 80 %). */
type SubscriptionUsageState = 'OK' | 'NEAR_LIMIT' | 'REACHED' | 'UNLIMITED';

/** `GET agency/subscription` : page « Mon abonnement » (owner uniquement). */
interface IAgencySubscriptionOverview {
  /** null : l'agence n'a aucune souscription */
  subscription: {
    status: 'ACTIVE' | 'INACTIVE';
    plan: { id: string; name: PlanType };
    billingCycle: BillingCycle | null;
    price: number | null;
    currency: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
  } | null;
  /** Une entrée par fonctionnalité limitée ayant un compteur réel */
  usage: {
    feature: string;
    used: number;
    /** null : illimité */
    limit: number | null;
    remaining: number | null;
    /** 0–100, null si illimité */
    percentage: number | null;
    state: SubscriptionUsageState;
  }[];
  features: {
    name: string;
    category: string;
    description: string | null;
    limit: number | null;
    /** false : proposée par un autre plan */
    included: boolean;
  }[];
}

interface IAgencyStats {
  properties: {
    total: number;
    available: number;
    rented: number;
    occupancyRate: number;
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

/** `GET agency/close-impact` : ce que la fermeture de l'agence entraîne (owner uniquement). */
interface IAgencyCloseImpact {
  members: { active: number };
  /** `online` : biens ayant au moins une annonce en ligne */
  properties: { total: number; online: number };
  /** `upcoming` : réservations confirmées dont le séjour n'est pas terminé */
  bookings: { upcoming: number; pending: number };
  subscription: { plan: string; currentPeriodEnd: string | null } | null;
  closeScheduledAt: string | null;
  /** Délai de grâce appliqué par le backend (jours) */
  closeDelayDays: number;
}

export type {
  ICreateAgency,
  IUpdateAgency,
  ICloseAgency,
  IAgency,
  IAgencyFilters,
  IAgencyCommonParams,
  IAgencySubscriptionInfo,
  IAgencySubscriptionOverview,
  SubscriptionUsageState,
  IAgencyStats,
  IAgencyCloseImpact,
};
