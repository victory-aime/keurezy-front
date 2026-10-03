import type { MODELS } from '_types/*';

type Legal = MODELS.IAgencyLegal;

/** Libellés des informations légales (note de vérification, formulaire). */
export const LEGAL_FIELD_LABELS: Record<
  Exclude<keyof Legal, 'bankName' | 'bankAccount' | 'mobileMoneyNumber' | `${string}ProofUrl`>,
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

/** Pièces justificatives : ce que chacune prouve et comment l'obtenir. */
export const LEGAL_PROOFS: {
  kind: MODELS.LegalProofKind;
  field: 'legalFormProofUrl' | 'nineaProofUrl' | 'rccmProofUrl';
  label: string;
  proves: string;
}[] = [
  {
    kind: 'LEGAL_FORM',
    field: 'legalFormProofUrl',
    label: 'Statuts de la société',
    proves: 'Raison sociale et forme juridique',
  },
  { kind: 'NINEA', field: 'nineaProofUrl', label: 'Attestation NINEA', proves: 'NINEA' },
  { kind: 'RCCM', field: 'rccmProofUrl', label: 'Extrait du RCCM', proves: 'RCCM' },
];

/** Libellé d'un élément manquant (champ ou pièce) dans la note de vérification. */
export const missingLabel = (key: string): string =>
  LEGAL_FIELD_LABELS[key as keyof typeof LEGAL_FIELD_LABELS] ??
  LEGAL_PROOFS.find((proof) => proof.field === key)?.label ??
  key;

export const PROOF_MAX_BYTES = 5 * 1024 * 1024;
export const PROOF_ACCEPT = ['application/pdf', 'image/png', 'image/jpeg'];

/** Contrôle avant envoi (le backend revérifie le contenu) : message d'erreur, ou `null`. */
export function proofFileError(file: { type: string; size: number }): string | null {
  if (!PROOF_ACCEPT.includes(file.type)) return 'Fichier PDF, PNG ou JPEG uniquement.';
  if (file.size > PROOF_MAX_BYTES) return 'Fichier de 5 Mo au plus.';
  return null;
}

/** Nom lisible d'un fichier Cloudinary (« ninea-3f2a….pdf » → « ninea.pdf »). */
export function proofFileName(url: string): string {
  const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? '');
  return (
    name.replace(/-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, '') || 'document'
  );
}

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
