import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const BookingsCache = {
  /** Toutes les listes de réservations de l'agence (tous filtres de statut). */
  invalidateAgencyBookings: () =>
    QUERIES.QueryCache.invalidate([Constants.BOOKINGS_KEYS.AGENCY_BOOKINGS]),
};
