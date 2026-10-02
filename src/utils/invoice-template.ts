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
  signature: { label: 'Signature et cachet', hint: 'Zone en bas à droite de la facture' },
};

/** Contenu de la zone « Signature et cachet ». */
export const SIGNATURE_STYLES: {
  value: MODELS.InvoiceSignatureStyle;
  label: string;
  description: string;
}[] = [
  {
    value: 'BOX',
    label: 'Cadre vide',
    description: 'Signé et tamponné à la main, après impression.',
  },
  {
    value: 'IMAGE',
    label: 'Cachet scanné',
    description: 'Votre cachet ou signature, téléversé sur la page Modèles de facture.',
  },
  {
    value: 'GENERATED',
    label: 'Cachet généré',
    description: 'Dessiné avec votre raison sociale, adresse, NINEA et RCCM : aucun scan.',
  },
];

/** Rôle des couleurs d'un modèle, tel que le rendu PDF les applique. */
export const COLOR_ROLES: { key: 'primaryColor' | 'accentColor'; label: string; usage: string }[] =
  [
    { key: 'primaryColor', label: 'Couleur principale', usage: 'Titres, en-tête et tableau' },
    { key: 'accentColor', label: 'Couleur d’accent', usage: 'Total à payer et intitulés' },
  ];

/** Nom courant d'une couleur #RRGGBB (« Noir », « Violet »…), pour la décrire sans code. */
export function colorName(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * light - 1));
  if (light < 0.2) return 'Noir';
  if (light > 0.92) return 'Blanc';
  if (sat < 0.15) return 'Gris';
  const d = max - min;
  const hue =
    (max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
  const names: [number, string][] = [
    [15, 'Rouge'],
    [45, 'Orange'],
    [65, 'Jaune'],
    [160, 'Vert'],
    [195, 'Turquoise'],
    [250, 'Bleu'],
    [290, 'Violet'],
    [335, 'Rose'],
    [360, 'Rouge'],
  ];
  return names.find(([limit]) => hue < limit)![1];
}

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
