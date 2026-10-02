/** Modèles de facture (I1) : mêmes formes que le backend (`invoicing`). */
type InvoiceLayout = 'CLASSIC' | 'MODERN' | 'MINIMAL';
type InvoiceFont = 'HELVETICA' | 'TIMES' | 'COURIER';
/** Zone « Signature et cachet » : cadre vide, cachet scanné ou cachet généré */
type InvoiceSignatureStyle = 'BOX' | 'IMAGE' | 'GENERATED';

interface IInvoiceTemplateConfig {
  layout: InvoiceLayout;
  primaryColor: string;
  accentColor: string;
  font: InvoiceFont;
  showLogo: boolean;
  columns: { period: boolean; quantity: boolean; unitPrice: boolean; vat: boolean };
  blocks: { legal: boolean; bank: boolean; signature: boolean };
  /** Absent des anciens modèles : BOX */
  signatureStyle?: InvoiceSignatureStyle;
  texts: { title: string; intro: string; paymentTerms: string; notes: string; footer: string };
}

interface IInvoiceTemplate {
  id: string;
  name: string;
  /** Modèle commun : le modifier crée une copie pour l'agence */
  isDefault: boolean;
  /** Présentation d'un modèle commun ; null pour un modèle de l'agence */
  description: string | null;
  config: IInvoiceTemplateConfig;
  updatedAt: string;
}

interface IInvoiceSettings {
  vatRate: number;
  invoicePrefix: string;
  defaultTemplateId: string | null;
  /** Cachet ou signature scanné de l'agence */
  stampUrl: string | null;
}

interface IInvoiceTemplatesResponse {
  templates: IInvoiceTemplate[];
  settings: IInvoiceSettings;
}

/** Factures (I2) : mêmes formes que le backend (`invoicing/invoices`). */
type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
type InvoicePaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHECK' | 'CARD' | 'OTHER';

interface IInvoiceLine {
  description: string;
  period?: string | null;
  quantity: number;
  /** Prix unitaire HT, francs CFA */
  unitPrice: number;
}

interface IInvoiceClient {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

/** Contenu modifiable d'un brouillon. */
interface IInvoiceDraft {
  templateId?: string;
  client: IInvoiceClient;
  lines: IInvoiceLine[];
  /** Échéance AAAA-MM-JJ */
  dueAt: string;
}

interface IInvoice {
  id: string;
  /** Attribué à l'émission */
  number: string | null;
  status: InvoiceStatus;
  bookingId: string | null;
  bookingReference: string | null;
  templateId: string | null;
  /** Modèle figé à l'émission */
  templateName: string | null;
  client: IInvoiceClient;
  lines: IInvoiceLine[];
  totals: { ht: number; vat: number; ttc: number };
  /** Taux figé à l'émission ; null pour un brouillon (taux du jour de l'agence) */
  vatRate: number | null;
  dueAt: string;
  issuedAt: string | null;
  paidAt: string | null;
  paymentMethod: InvoicePaymentMethod | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
}

interface IInvoiceListItem {
  id: string;
  number: string | null;
  status: InvoiceStatus;
  clientName: string;
  totalTtc: number;
  dueAt: string;
  issuedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface IInvoiceList {
  content: IInvoiceListItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  /** Nombre de factures de l'agence par statut */
  counts: Partial<Record<InvoiceStatus, number>>;
}

interface IInvoiceListParams {
  agencyId: string;
  status?: InvoiceStatus;
  q?: string;
  page?: number;
  pageSize?: number;
}

/** Réservation confirmée ou terminée, proposée à la facturation. */
interface IInvoiceableBooking {
  id: string;
  reference: string;
  status: 'CONFIRMED' | 'COMPLETED';
  clientName: string | null;
  propertyTitle: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  /** Factures déjà créées pour cette réservation */
  invoiceCount: number;
}

/** Catalogue des variables : groupe → clé → libellé. */
type IInvoiceVariables = Record<string, Record<string, string>>;

export type {
  InvoiceLayout,
  InvoiceFont,
  InvoiceSignatureStyle,
  IInvoiceTemplateConfig,
  IInvoiceTemplate,
  IInvoiceSettings,
  IInvoiceTemplatesResponse,
  IInvoiceVariables,
  InvoiceStatus,
  InvoicePaymentMethod,
  IInvoiceLine,
  IInvoiceClient,
  IInvoiceDraft,
  IInvoice,
  IInvoiceListItem,
  IInvoiceList,
  IInvoiceListParams,
  IInvoiceableBooking,
};
