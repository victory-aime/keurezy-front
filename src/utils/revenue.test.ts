import { describe, expect, it } from 'vitest';
import { currentMonthExpected, monthLabel } from './revenue';

describe('monthLabel', () => {
  it('libelle un mois AAAA-MM en français abrégé', () => {
    expect(monthLabel('2026-01')).toBe('janv.');
    expect(monthLabel('2026-08')).toBe('août');
  });
});

describe('currentMonthExpected', () => {
  const stats = [
    { month: '2026-09', receivedAmount: 100000, remainingAmount: 50000 },
    { month: '2026-10', receivedAmount: 20000, remainingAmount: 30000 },
  ];

  it('additionne reçu et restant du mois en cours', () => {
    expect(currentMonthExpected(stats, new Date(2026, 9, 12))).toBe(50000);
  });

  it('vaut 0 si le mois en cours manque (autre année affichée)', () => {
    expect(currentMonthExpected(stats, new Date(2027, 0, 5))).toBe(0);
  });
});
