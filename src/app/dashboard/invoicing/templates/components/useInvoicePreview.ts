'use client';

import { MODELS } from '_types/*';
import { invoicePreviewUrl } from '_utils/invoice-template';
import { usePdfDocument, type PdfDocument } from '../../components/usePdfDocument';

export type InvoicePreview = PdfDocument;

/**
 * Aperçu PDF d'une configuration de modèle, rendu par le backend (même moteur que les factures
 * émises), recalculé après chaque modification.
 */
export function useInvoicePreview(
  agencyId: string,
  config: MODELS.IInvoiceTemplateConfig | null,
  enabled = true,
): InvoicePreview {
  return usePdfDocument(
    agencyId && config ? { url: invoicePreviewUrl(agencyId), body: { config } } : null,
    enabled,
  );
}
