import type { MODELS } from '_types/*';

type Legal = MODELS.IAgencyLegal;

/** Libellés des informations légales (note de vérification, formulaire). */
export const LEGAL_FIELD_LABELS: Record<
  Exclude<keyof Legal, 'bankName' | 'bankAccount' | 'mobileMoneyNumber'>,
  string
> = {
  companyName: 'Raison sociale',
  legalForm: 'Forme juridique',
  ninea: 'NINEA',
  rccm: 'RCCM',
  billingAddress: 'Adresse de facturation',
  billingEmail: 'E-mail de facturation',
};

/** Coordonnées bancaires (facultatives) : bloc « coordonnées de paiement » des factures. */
export const BANK_FIELD_LABELS = {
  bankName: 'Banque',
  bankAccount: 'RIB ou IBAN',
  mobileMoneyNumber: 'Numéro Wave ou Orange Money',
} as const;

export const LEGAL_FORMS: { value: MODELS.LegalForm; label: string }[] = [
  { value: 'SARL', label: 'SARL' },
  { value: 'SUARL', label: 'SUARL' },
  { value: 'SA', label: 'SA' },
  { value: 'SAS', label: 'SAS' },
  { value: 'SASU', label: 'SASU' },
  { value: 'GIE', label: 'GIE' },
  { value: 'INDIVIDUAL', label: 'Entreprise individuelle' },
  { value: 'OTHER', label: 'Autre' },
];

/** Même normalisation que le backend : majuscules, sans espaces. */
export const normalizeIdentifier = (value: string | null | undefined) =>
  (value ?? '').replace(/\s+/g, '').toUpperCase();

/**
 * Le formulaire change-t-il la raison sociale, le NINEA ou le RCCM ? Sur une agence vérifiée,
 * le backend retire alors la vérification : on prévient avant d'enregistrer.
 */
export function changesIdentity(current: Partial<Legal>, next: Partial<Legal>): boolean {
  return (
    (next.companyName ?? '').trim() !== (current.companyName ?? '').trim() ||
    normalizeIdentifier(next.ninea) !== normalizeIdentifier(current.ninea) ||
    normalizeIdentifier(next.rccm) !== normalizeIdentifier(current.rccm)
  );
}

export type VerificationState = 'VERIFIED' | 'PENDING' | 'INCOMPLETE';

/** État affiché par la note de la page Agence. */
export function verificationState(agency: {
  isVerified?: boolean;
  legalMissing?: string[];
}): VerificationState {
  if (agency.isVerified) return 'VERIFIED';
  return agency.legalMissing?.length ? 'INCOMPLETE' : 'PENDING';
}
