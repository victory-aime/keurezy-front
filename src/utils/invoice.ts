import type { MODELS } from '_types/*';
import { Status } from '../types/enum/common/status';

/** Libellé et couleur du badge de chaque statut de facture. */
export const INVOICE_STATUS: Record<
  MODELS.InvoiceStatus,
  { label: string; plural: string; status: Status }
> = {
  DRAFT: { label: 'Brouillon', plural: 'Brouillons', status: Status.INFO },
  ISSUED: { label: 'Émise', plural: 'Émises', status: Status.PENDING },
  PAID: { label: 'Payée', plural: 'Payées', status: Status.ACTIVE },
  CANCELLED: { label: 'Annulée', plural: 'Annulées', status: Status.INACTIVE },
};

export const PAYMENT_METHODS: { value: MODELS.InvoicePaymentMethod; label: string }[] = [
  { value: 'BANK_TRANSFER', label: 'Virement bancaire' },
  { value: 'MOBILE_MONEY', label: 'Wave / Orange Money' },
  { value: 'CASH', label: 'Espèces' },
  { value: 'CHECK', label: 'Chèque' },
  { value: 'CARD', label: 'Carte bancaire' },
  { value: 'OTHER', label: 'Autre' },
];

/** Totaux d'un brouillon, calculés comme le backend (arrondi au franc par ligne puis sur la TVA). */
export function invoiceTotals(lines: MODELS.IInvoiceLine[], vatRate: number) {
  const ht = lines.reduce(
    (sum, l) => sum + Math.round((Number(l.quantity) || 0) * (Number(l.unitPrice) || 0)),
    0,
  );
  const vat = Math.round((ht * vatRate) / 100);
  return { ht, vat, ttc: ht + vat };
}

/** Date du jour AAAA-MM-JJ, décalée de `days` jours. */
export function isoDay(days = 0, from = new Date()) {
  const d = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate() + days));
  return d.toISOString().slice(0, 10);
}

/** Émise, non payée, échéance dépassée. */
export const isOverdue = (
  invoice: { status: MODELS.InvoiceStatus; dueAt: string },
  today = isoDay(),
) => invoice.status === 'ISSUED' && invoice.dueAt.slice(0, 10) < today;

/** PDF d'une facture (même origine : le cookie de session part avec). */
export const invoicePdfUrl = (agencyId: string, id: string, download = false) =>
  `/api/v1/secure/invoicing/invoices/pdf?${new URLSearchParams({
    agencyId,
    id,
    ...(download ? { download: '1' } : {}),
  })}`;

/** « 2 oct. 2026 » */
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
