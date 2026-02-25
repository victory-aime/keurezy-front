import * as Constants from "./constants";
import { rentalServiceInstance } from "./rental.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const rentalAgencyRequestListQueries = (
  args: QUERIES.QueryPayload<{ agencyId: string }>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IRentalAgencyListResponse[]>({
    queryKey: [Constants.RENTAL_KEYS.RENTAL_AGENCY_REQUEST_LIST],
    queryFn: () =>
      rentalServiceInstance().agencyRentalRequestList(params?.agencyId),
    options: args.queryOptions,
  });
};

const rentalUserRequestListQueries = (
  args: QUERIES.QueryPayload<{ userId: string }>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<any[]>({
    queryKey: [Constants.RENTAL_KEYS.RENTAL_USER_REQUEST_LIST],
    queryFn: () =>
      rentalServiceInstance().userRentalRequestList(params?.userId),
    options: args.queryOptions,
  });
};

const createRentalMutation = (
  args: QUERIES.MutationPayload<MODELS.IRentalRequest>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.RENTAL_KEYS.CREATE_RENTAL],
    mutationFn: ({ payload }) =>
      rentalServiceInstance().createRequest(payload!),
    options: args.mutationOptions,
  });
};

export {
  rentalAgencyRequestListQueries,
  rentalUserRequestListQueries,
  createRentalMutation,
};
