import { describe, expect, it } from 'vitest';
import { invoicePdfUrl, invoiceTotals, isOverdue, isoDay } from './invoice';

describe('invoiceTotals', () => {
  it('arrondit chaque ligne puis la TVA, comme le backend', () => {
    const lines = [
      { description: 'Loyer', quantity: 1, unitPrice: 350_000 },
      { description: 'Ménage', quantity: 1.5, unitPrice: 10_001 },
    ];
    expect(invoiceTotals(lines, 18)).toEqual({ ht: 365_002, vat: 65_700, ttc: 430_702 });
  });

  it('ignore une saisie incomplète', () => {
    expect(invoiceTotals([{ description: '', quantity: NaN, unitPrice: 5 }], 0).ttc).toBe(0);
  });
});

describe('isOverdue', () => {
  it('émise et échéance passée seulement', () => {
    expect(isOverdue({ status: 'ISSUED', dueAt: '2026-10-01' }, '2026-10-02')).toBe(true);
    expect(isOverdue({ status: 'ISSUED', dueAt: '2026-10-02' }, '2026-10-02')).toBe(false);
    expect(isOverdue({ status: 'PAID', dueAt: '2026-10-01' }, '2026-10-02')).toBe(false);
  });
});

it('isoDay décale en jours calendaires', () => {
  expect(isoDay(15, new Date(2026, 9, 2))).toBe('2026-10-17');
});

it('invoicePdfUrl : téléchargement en option', () => {
  expect(invoicePdfUrl('A', 'i1')).toBe('/api/v1/secure/invoicing/invoices/pdf?agencyId=A&id=i1');
  expect(invoicePdfUrl('A', 'i1', true)).toContain('download=1');
});
