import { CONSTANTS, ENUM, MODELS } from '_types/index';

/**
 * Présentation des réservations (dates, durées, statuts).
 * Disponibilités, prix et chevauchements restent vérifiés par le backend.
 */

export const getRentalTypeMeta = (rentalType: ENUM.RentalType) =>
  CONSTANTS.rentalTypes.find((type) => type.value === rentalType);

/** « lun. 5 oct. 2026 » depuis une date calendaire AAAA-MM-JJ (sans décalage de fuseau). */
export const formatBookingDate = (value?: string | null, withWeekday = false) => {
  if (!value) return '-';
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`).toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
    ...(withWeekday && { weekday: 'short' }),
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/** « 1 mois », « 3 nuits » */
export const formatRentalDuration = (count: number, rentalType: ENUM.RentalType) => {
  const meta = getRentalTypeMeta(rentalType);
  if (!meta) return `${count}`;
  return `${count} ${count > 1 ? meta.unitPlural : meta.unit}`;
};

/** Statut de pastille correspondant (couleurs et libellés partagés de BaseTag). */
export const toTagStatus = (status: ENUM.BookingStatus): ENUM.COMMON.Status =>
  status === ENUM.BookingStatus.COMPLETED
    ? ENUM.COMMON.Status.DONE
    : (status as unknown as ENUM.COMMON.Status);

/** Demandes en attente d'autres clients sur des dates qui chevauchent celles-ci (information). */
export const countOverlappingPending = (
  booking: MODELS.IAgencyBooking,
  bookings: MODELS.IAgencyBooking[],
) =>
  bookings.filter(
    (other) =>
      other.id !== booking.id &&
      other.property.id === booking.property.id &&
      other.status === ENUM.BookingStatus.PENDING &&
      other.startDate <= booking.endDate &&
      other.endDate >= booking.startDate,
  ).length;

const BOOKING_STATUS_LABELS: Record<ENUM.BookingStatus, string> = {
  [ENUM.BookingStatus.PENDING]: 'En attente',
  [ENUM.BookingStatus.CONFIRMED]: 'Confirmée',
  [ENUM.BookingStatus.CANCELLED]: 'Annulée',
  [ENUM.BookingStatus.REJECTED]: 'Refusée',
  [ENUM.BookingStatus.COMPLETED]: 'Terminée',
};

/** Libellé court d'un statut de réservation (textes hors pastille). */
export const getBookingStatusLabel = (status: ENUM.BookingStatus) =>
  BOOKING_STATUS_LABELS[status] ?? status;
