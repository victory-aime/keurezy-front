import * as Constants from "./constants";
import { rentalAgreementServiceInstance } from "./rental-agreement.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getRentalAgreementListByAgencyQueries = (
  args: QUERIES.QueryPayload<{ agencyId: string }>,
) => {
  return QUERIES.useCustomQuery<MODELS.IRentalAgencyListResponse[]>({
    queryKey: [Constants.RENTAL_AGREEMENT_KEYS.RENTAL_AGREEMENT_AGENCY_LIST],
    queryFn: () =>
      rentalAgreementServiceInstance().getRentalAgreementByAgency(
        args?.params?.agencyId!,
      ),
    options: args.queryOptions,
  });
};

const approveRentalAgreementMutation = (
  args: QUERIES.MutationPayload<{ agencyId: string; requestId: string }>,
) => {
  return QUERIES.useCustomMutation<
    { agencyId: string; requestId: string },
    any
  >({
    mutationKey: [Constants.RENTAL_AGREEMENT_KEYS.APPROVE],
    mutationFn: ({ params }) =>
      rentalAgreementServiceInstance().approveRequest(params!),
    options: args.mutationOptions,
  });
};
const rejectRentalAgreementMutation = (
  args: QUERIES.MutationPayload<{ agencyId: string; requestId: string }>,
) => {
  return QUERIES.useCustomMutation<
    { agencyId: string; requestId: string },
    any
  >({
    mutationKey: [Constants.RENTAL_AGREEMENT_KEYS.REJECT],
    mutationFn: ({ params }) =>
      rentalAgreementServiceInstance().rejectRequest(params!),
    options: args.mutationOptions,
  });
};
const terminateRentalAgreementMutation = (
  args: QUERIES.MutationPayload<{ agencyId: string; propertyId: string }>,
) => {
  return QUERIES.useCustomMutation<
    { agencyId: string; propertyId: string },
    any
  >({
    mutationKey: [Constants.RENTAL_AGREEMENT_KEYS.TERMINATE],
    mutationFn: ({ params }) =>
      rentalAgreementServiceInstance().terminateRental(params),
    options: args.mutationOptions,
  });
};

export {
  terminateRentalAgreementMutation,
  approveRentalAgreementMutation,
  rejectRentalAgreementMutation,
  getRentalAgreementListByAgencyQueries,
};
