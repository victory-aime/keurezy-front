import * as Constants from './constants';
import { bookingsServiceInstance } from './bookings.service-instance';
import { BookingsCache } from './cache';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const agencyBookingsQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyBooking[], undefined, MODELS.IAgencyBookingsParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IAgencyBookingsParams, undefined, MODELS.IAgencyBooking[]>({
    queryKey: [Constants.BOOKINGS_KEYS.AGENCY_BOOKINGS, params],
    queryFn: () => bookingsServiceInstance().agencyBookings(params!),
    options: queryOptions,
  });
};

/** Confirmation : les autres demandes sur ces dates sont refusées par le backend. */
const confirmBookingMutation = (
  args: QUERIES.MutationPayload<
    undefined,
    { message: string; autoRejected: number },
    { id: string }
  > = {},
) => {
  return QUERIES.useCustomMutation<
    undefined,
    { message: string; autoRejected: number },
    { id: string }
  >({
    mutationKey: [Constants.BOOKINGS_KEYS.CONFIRM_BOOKING],
    mutationFn: ({ params }) => bookingsServiceInstance().confirmBooking(params!.id),
    options: {
      ...args.mutationOptions,
      onSuccess: (...result) => {
        BookingsCache.invalidateAgencyBookings();
        return args.mutationOptions?.onSuccess?.(...result);
      },
    },
  });
};

const rejectBookingMutation = (
  args: QUERIES.MutationPayload<
    MODELS.IRejectBookingPayload,
    { message: string },
    { id: string }
  > = {},
) => {
  return QUERIES.useCustomMutation<
    MODELS.IRejectBookingPayload,
    { message: string },
    { id: string }
  >({
    mutationKey: [Constants.BOOKINGS_KEYS.REJECT_BOOKING],
    mutationFn: ({ payload, params }) =>
      bookingsServiceInstance().rejectBooking(params!.id, payload!),
    options: {
      ...args.mutationOptions,
      onSuccess: (...result) => {
        BookingsCache.invalidateAgencyBookings();
        return args.mutationOptions?.onSuccess?.(...result);
      },
    },
  });
};

export { agencyBookingsQueries, confirmBookingMutation, rejectBookingMutation };
