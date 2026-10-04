/**
 * Saisie libre d'une année : « 26 » → 2026 (siècle en cours), « 2024 » → 2024.
 * `null` si vide, illisible ou hors de [min, max].
 */
export const parseYearInput = (
  input: string | undefined,
  min: number,
  max: number,
  now = new Date(),
): number | null => {
  const digits = (input ?? '').replace(/\D/g, '');
  if (!digits) return null;
  const raw = Number(digits);
  const year = raw < 100 ? Math.floor(now.getFullYear() / 100) * 100 + raw : raw;
  return year >= min && year <= max ? year : null;
};
