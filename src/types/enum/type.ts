export enum LandPaymentType {
  CASH = 'CASH',
  PARTIAL = 'PARTIAL',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  STUDIO = 'STUDIO',
}

export enum PlanType {
  BASIC_COMMISSION = 'BASIC_COMMISSION',
  STANDARD_COMMISSION = 'STANDARD_COMMISSION',
  PREMIUM_COMMISSION = 'PREMIUM_COMMISSION',
  BASIC_SUB = 'BASIC_SUB',
  STANDARD_SUB = 'STANDARD_SUB',
  PREMIUM_SUB = 'PREMIUM_SUB',
}

export type PlanCategory = 'COMMISSION_BASED' | 'SUBSCRIPTION_BASED';
export type PricingType = 'COMMISSION' | 'SUBSCRIPTION';
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type PlanTier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export enum UserRole {
  OWNER = 'OWNER', // propriétaire de l'agence,
  AGENCY_ADMIN = 'AGENCY_ADMIN', // admin interne agence
  AGENT = 'AGENT', // agent interne agence
}

export enum AgencyRole {
  AGENCY_ADMIN = 'AGENCY_ADMIN',
  AGENT = 'AGENT',
  ACCOUNTANT = 'ACCOUNTANT',
  MEMBER = 'MEMBER',
}

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  PAYMENT = 'PAYMENT',
  MAINTENANCE = 'MAINTENANCE',
  SYSTEM = 'SYSTEM',
  LEAD = 'LEAD',
  VISIT = 'VISIT',
  TICKET = 'TICKET',
}
