import { describe, expect, it } from 'vitest';
import { visibleRange } from './agenda';

// Octobre 2026 commence un jeudi et se termine un samedi
const oct15 = new Date(2026, 9, 15);
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

describe('visibleRange', () => {
  it('mois : couvre les semaines complètes de la grille', () => {
    const { from, to } = visibleRange('month', oct15);
    expect(iso(from)).toBe('2026-09-28');
    expect(iso(to)).toBe('2026-11-01');
  });

  it('liste : même plage que le mois', () => {
    expect(visibleRange('agenda', oct15)).toEqual(visibleRange('month', oct15));
  });

  it('semaine : du lundi au dimanche', () => {
    const { from, to } = visibleRange('week', oct15);
    expect(iso(from)).toBe('2026-10-12');
    expect(iso(to)).toBe('2026-10-18');
  });

  it('jour : le jour seul', () => {
    const { from, to } = visibleRange('day', oct15);
    expect(iso(from)).toBe('2026-10-15');
    expect(iso(to)).toBe('2026-10-15');
  });
});
