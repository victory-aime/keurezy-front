import { describe, expect, it } from 'vitest';
import { parseYearInput } from './year';

const now = new Date('2026-10-04');

describe('parseYearInput', () => {
  it('lit une année complète dans les bornes', () => {
    expect(parseYearInput('2024', 2020, 2026, now)).toBe(2024);
  });

  it('complète deux chiffres avec le siècle en cours', () => {
    expect(parseYearInput('26', 2020, 2026, now)).toBe(2026);
  });

  it('refuse une année hors bornes', () => {
    expect(parseYearInput('2027', 2020, 2026, now)).toBeNull();
    expect(parseYearInput('2019', 2020, 2026, now)).toBeNull();
  });

  it('ignore une saisie vide ou sans chiffre', () => {
    expect(parseYearInput('', 2020, 2026, now)).toBeNull();
    expect(parseYearInput('abc', 2020, 2026, now)).toBeNull();
    expect(parseYearInput(undefined, 2020, 2026, now)).toBeNull();
  });
});
