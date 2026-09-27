import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/** Réservations côté agence : liste, confirmation et refus. */
export class BookingsService extends BaseApi {
  agencyBookings(params: MODELS.IAgencyBookingsParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().BOOKINGS.AGENCY_BOOKINGS,
      {},
      { params },
    );
  }

  confirmBooking(id: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().BOOKINGS.CONFIRM,
      {},
      { params: { id } },
    );
  }

  rejectBooking(id: string, data: MODELS.IRejectBookingPayload) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().BOOKINGS.REJECT, data, {
      params: { id },
    });
  }
}
