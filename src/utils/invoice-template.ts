import type { MODELS } from '_types/*';

type Config = MODELS.IInvoiceTemplateConfig;

export const LAYOUT_OPTIONS: { value: MODELS.InvoiceLayout; label: string; description: string }[] =
  [
    {
      value: 'CLASSIC',
      label: 'Classique',
      description: 'En-tête sobre, client encadré, tableau à fond gris.',
    },
    {
      value: 'MODERN',
      label: 'Moderne',
      description: 'Bandeau de couleur en haut, tableau à en-tête coloré.',
    },
    { value: 'MINIMAL', label: 'Minimal', description: 'Sans fond : typographie et filets fins.' },
  ];

export const FONT_OPTIONS: { value: MODELS.InvoiceFont; label: string }[] = [
  { value: 'HELVETICA', label: 'Helvetica (moderne)' },
  { value: 'TIMES', label: 'Times (classique)' },
  { value: 'COURIER', label: 'Courier (machine à écrire)' },
];

export const COLUMN_LABELS: Record<keyof Config['columns'], string> = {
  period: 'Période',
  quantity: 'Quantité',
  unitPrice: 'Prix unitaire',
  vat: 'TVA',
};

export const BLOCK_LABELS: Record<keyof Config['blocks'], { label: string; hint: string }> = {
  legal: { label: 'Informations légales', hint: 'NINEA et RCCM de l’agence' },
  bank: {
    label: 'Coordonnées de paiement',
    hint: 'Banque, RIB, Wave ou Orange Money (page Agence)',
  },
  signature: { label: 'Signature et cachet', hint: 'Cadre en bas de la facture' },
};

export const TEXT_FIELDS: {
  key: keyof Config['texts'];
  label: string;
  maxLength: number;
  multiline: boolean;
}[] = [
  { key: 'title', label: 'Titre', maxLength: 60, multiline: false },
  { key: 'intro', label: 'Introduction', maxLength: 500, multiline: true },
  { key: 'paymentTerms', label: 'Conditions de paiement', maxLength: 500, multiline: true },
  { key: 'notes', label: 'Notes', maxLength: 1000, multiline: true },
  { key: 'footer', label: 'Pied de page', maxLength: 300, multiline: false },
];

const TOKEN = /\{\{\s*([a-z_]+)\.([a-z_]+)\s*\}\}/g;

/** Même contrôle que le backend : variables hors catalogue ou accolades mal formées. */
export function unknownVariables(text: string, catalogue: MODELS.IInvoiceVariables): string[] {
  const unknown = new Set<string>();
  for (const [, group, key] of text.matchAll(TOKEN)) {
    if (!catalogue[group]?.[key]) unknown.add(`${group}.${key}`);
  }
  if (text.replace(TOKEN, '').includes('{{')) unknown.add('{{…}}');
  return [...unknown];
}

/** Insère `{{groupe.cle}}` à la place de la sélection ; renvoie le texte et la position du curseur. */
export function insertVariable(
  text: string,
  selection: { start: number; end: number },
  variable: string,
): { text: string; cursor: number } {
  const token = `{{${variable}}}`;
  const start = Math.max(0, Math.min(selection.start, text.length));
  const end = Math.max(start, Math.min(selection.end, text.length));
  return { text: text.slice(0, start) + token + text.slice(end), cursor: start + token.length };
}

/** Aperçu PDF d'une configuration (même origine : le cookie de session part avec). */
export const invoicePreviewUrl = (agencyId: string) =>
  `/api/v1/secure/invoicing/templates/preview?${new URLSearchParams({ agencyId })}`;
