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
/** Questionnaire de départ, facultatif (résiliation, fermeture d'agence). */
type ExitFeedbackReason =
  | 'TOO_EXPENSIVE'
  | 'MISSING_FEATURES'
  | 'LOW_USAGE'
  | 'SWITCHING_TOOL'
  | 'TECHNICAL_ISSUE'
  | 'BUSINESS_CLOSING'
  | 'OTHER';

interface IExitFeedback {
  reason?: ExitFeedbackReason;
  comment?: string;
}

interface ICloseAgency {
  agencyId: string;
  feedback?: IExitFeedback;
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
  /** INACTIVE : abonnement expiré, tableau de bord en lecture seule. Absent sans souscription. */
  status?: 'ACTIVE' | 'INACTIVE';
  features: {
    id: string;
    name: string;
    category: string;
    limit: null;
  }[];
}

/** État d'un quota, calculé par le backend (`NEAR_LIMIT` dès 80 %). */
type SubscriptionUsageState = 'OK' | 'NEAR_LIMIT' | 'REACHED' | 'UNLIMITED';

/** `GET agency/subscription/cancel-impact` : ce que la résiliation change à l'échéance. */
interface ISubscriptionCancelImpact {
  /** Fin de la période ; null si l'abonnement n'a pas d'échéance enregistrée */
  activeUntil: string | null;
  annonces: { online: number };
  members: { active: number };
  /** Réservations confirmées à venir, à honorer */
  bookings: { upcoming: number };
  /** À l'échéance, passage au Gratuit : ce qui dépasse ses limites (surplus désactivé) */
  freePlanExcess: { feature: string; used: number; limit: number }[];
}

/** Éléments gardés actifs, par fonctionnalité limitée en surplus. */
type SubscriptionKeep = { feature: string; ids: string[] }[];

type SubscriptionQuoteKind = 'RENEWAL' | 'UPGRADE' | 'DOWNGRADE' | 'REACTIVATION';

/** Élément actif proposé au choix quand le plan visé est plus petit que l'usage. */
interface ISubscriptionExcessItem {
  id: string;
  label: string;
  type: 'PROPERTY' | 'LAND' | 'BUILDING' | 'ANNONCE' | 'STAFF' | 'INVITATION';
}

/** `GET agency/subscription/quote` : montant et dates calculés par le backend. */
interface ISubscriptionQuote {
  kind: SubscriptionQuoteKind;
  /** À payer maintenant (XOF) ; 0 pour un downgrade */
  amount: number;
  currency: string;
  effectiveAt: string;
  newPeriodEnd: string;
  excess: { feature: string; limit: number; used: number; items: ISubscriptionExcessItem[] }[];
}

/** Plan et cycle visés. */
interface ISubscriptionTarget {
  agencyId: string;
  planId: string;
  billingCycle: BillingCycle;
  keep?: SubscriptionKeep;
}

/** `POST agency/subscription/checkout` */
interface ISubscriptionCheckout {
  checkoutUrl: string;
  orderId: string;
}

/** `GET agency/subscription/payment` */
interface ISubscriptionPaymentStatus {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
}

/** `GET agency/subscription/limits` : limites et usage, pour toute l'équipe. */
interface ISubscriptionLimits {
  plan: { id: string; name: PlanType } | null;
  usage: IAgencySubscriptionOverview['usage'];
  /** Paiement payé autre que l'inscription : pas d'aperçu promotionnel */
  hasPaymentHistory: boolean;
}

/** Paiement de l'historique de facturation (`GET agency/subscription/payments`). */
interface IAgencyPayment {
  id: string;
  kind: 'ONBOARDING' | 'RENEWAL' | 'UPGRADE' | 'REACTIVATION';
  plan: PlanType;
  amount: number;
  currency: string;
  status: ISubscriptionPaymentStatus['status'];
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  createdAt: string;
}

/** Réponse de `subscription/cancel` et `subscription/resume`. */
interface ISubscriptionCancellation {
  cancelAtPeriodEnd: boolean;
  activeUntil: string | null;
}

/** `GET agency/subscription` : page « Mon abonnement » (owner uniquement). */
interface IAgencySubscriptionOverview {
  /** null : l'agence n'a aucune souscription */
  subscription: {
    status: 'ACTIVE' | 'INACTIVE';
    plan: { id: string; name: PlanType };
    billingCycle: BillingCycle | null;
    price: number | null;
    /** Prochain renouvellement au tarif actuel du catalogue ; null pour le Gratuit */
    nextRenewalPrice: number | null;
    currency: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    /** Downgrade programmé pour l'échéance ; null sinon */
    scheduledChange: {
      plan: { id: string; name: PlanType };
      billingCycle: BillingCycle;
      effectiveAt: string;
      keep: SubscriptionKeep;
    } | null;
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
  ISubscriptionCancelImpact,
  ISubscriptionCancellation,
  SubscriptionUsageState,
  SubscriptionKeep,
  SubscriptionQuoteKind,
  ISubscriptionExcessItem,
  ISubscriptionQuote,
  ISubscriptionTarget,
  ISubscriptionCheckout,
  ISubscriptionPaymentStatus,
  IAgencyPayment,
  ISubscriptionLimits,
  IAgencyStats,
  IAgencyCloseImpact,
  IExitFeedback,
  ExitFeedbackReason,
};
