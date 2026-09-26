// Import direct de l'enum : ce module est utilisé par les schémas de validation de _types
import { RentalType } from '../types/enum/type';

/**
 * Durée minimale d'une période de disponibilité (miroir de MIN_AVAILABILITY_SPAN côté backend,
 * qui reste la source de vérité) : la date de fin doit être au moins à « début + 1 unité ».
 */
const MIN_AVAILABILITY_SPAN: Record<RentalType, { days?: number; months?: number }> = {
  [RentalType.DAILY]: { days: 1 },
  [RentalType.NIGHTLY]: { days: 1 },
  [RentalType.MONTHLY]: { months: 1 },
  [RentalType.YEARLY]: { months: 12 },
};

/** Date de fin minimale (AAAA-MM-JJ) d'une période commençant à `startDate`, ou null si invalide. */
export const minAvailabilityEndDate = (
  rentalType: RentalType,
  startDate?: string | null,
): string | null => {
  const [year, month, day] = (startDate ?? '').slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return null;

  const { days = 0, months = 0 } = MIN_AVAILABILITY_SPAN[rentalType];
  const targetMonth = month - 1 + months;
  // 31/01 + 1 mois → 28/02 : on ramène au dernier jour du mois
  const lastDayOfMonth = new Date(Date.UTC(year, targetMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, targetMonth, Math.min(day, lastDayOfMonth) + days))
    .toISOString()
    .slice(0, 10);
};
