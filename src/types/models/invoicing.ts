/** Modèles de facture (I1) : mêmes formes que le backend (`invoicing`). */
type InvoiceLayout = 'CLASSIC' | 'MODERN' | 'MINIMAL';
type InvoiceFont = 'HELVETICA' | 'TIMES' | 'COURIER';

interface IInvoiceTemplateConfig {
  layout: InvoiceLayout;
  primaryColor: string;
  accentColor: string;
  font: InvoiceFont;
  showLogo: boolean;
  columns: { period: boolean; quantity: boolean; unitPrice: boolean; vat: boolean };
  blocks: { legal: boolean; bank: boolean; signature: boolean };
  texts: { title: string; intro: string; paymentTerms: string; notes: string; footer: string };
}

interface IInvoiceTemplate {
  id: string;
  name: string;
  /** Modèle commun : le modifier crée une copie pour l'agence */
  isDefault: boolean;
  config: IInvoiceTemplateConfig;
  updatedAt: string;
}

interface IInvoiceSettings {
  vatRate: number;
  invoicePrefix: string;
  defaultTemplateId: string | null;
}

interface IInvoiceTemplatesResponse {
  templates: IInvoiceTemplate[];
  settings: IInvoiceSettings;
}

/** Catalogue des variables : groupe → clé → libellé. */
type IInvoiceVariables = Record<string, Record<string, string>>;

export type {
  InvoiceLayout,
  InvoiceFont,
  IInvoiceTemplateConfig,
  IInvoiceTemplate,
  IInvoiceSettings,
  IInvoiceTemplatesResponse,
  IInvoiceVariables,
};
