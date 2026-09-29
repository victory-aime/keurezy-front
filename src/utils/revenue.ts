/** Ligne de `GET property/monthly-revenue` : mois `AAAA-MM`, montants en FCFA. */
export interface MonthlyRevenueRow {
  month: string;
  receivedAmount: number;
  remainingAmount: number;
}

const MONTH_FORMAT = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

/** « 2026-01 » → « janv. » (libellé court de l'axe du graphique). */
export function monthLabel(isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number);
  return MONTH_FORMAT.format(new Date(year, month - 1, 1));
}

/**
 * Montant attendu du mois de `now` (reçu et restant). Vaut 0 si ce mois n'est pas dans les
 * données, par exemple quand une autre année est affichée.
 */
export function currentMonthExpected(rows: MonthlyRevenueRow[], now = new Date()): number {
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const row = rows.find((item) => item.month === key);
  return row ? row.receivedAmount + row.remainingAmount : 0;
}
