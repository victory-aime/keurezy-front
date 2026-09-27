import { BookingStatus, PropertyType, RentalType } from '../enum';

/** Réservation telle que renvoyée par l'API (dates AAAA-MM-JJ, montants en nombres). */
export interface IAgencyBooking {
  id: string;
  status: BookingStatus;
  rentalType: RentalType;
  startDate: string;
  /** Dernier jour occupé (inclus) */
  endDate: string;
  /** Jour de libération du bien */
  checkOutDate: string;
  duration: number;
  totalAmount: number;
  depositAmount: number;
  notes: string | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  property: {
    id: string;
    title: string;
    type: PropertyType;
    city: string | null;
    district: string | null;
    address: string | null;
    annonceId: string | null;
    coverImage: string | null;
  };
  agency: { id: string; name: string; phone: string | null };
  client: { name: string; email: string; phone: string | null } | null;
}

export interface IAgencyBookingsParams {
  agencyId: string;
  status?: BookingStatus;
}

export interface IRejectBookingPayload {
  reason: string;
}
