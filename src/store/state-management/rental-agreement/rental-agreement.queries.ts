import * as Constants from "./constants";
import { rentalAgreementServiceInstance } from "./rental-agreement.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getRentalAgreementListByAgencyQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyFilters>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IResponseRentalAgreementByAgency>({
    queryKey: [
      Constants.RENTAL_AGREEMENT_KEYS.RENTAL_AGREEMENT_AGENCY_LIST,
      params,
    ],
    queryFn: () =>
      rentalAgreementServiceInstance().getRentalAgreementByAgency(
        params as MODELS.IAgencyFilters,
      ),
    options: args.queryOptions,
  });
};

const approveRentalAgreementMutation = (
  args: QUERIES.MutationPayload<MODELS.IAgencyCommonParams>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.RENTAL_AGREEMENT_KEYS.APPROVE],
    mutationFn: ({ params }) =>
      rentalAgreementServiceInstance().approveRequest(params!),
    options: args.mutationOptions,
  });
};
const rejectRentalAgreementMutation = (
  args: QUERIES.MutationPayload<MODELS.IAgencyCommonParams>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.RENTAL_AGREEMENT_KEYS.REJECT],
    mutationFn: ({ params }) =>
      rentalAgreementServiceInstance().rejectRequest(params!),
    options: args.mutationOptions,
  });
};
const terminateRentalAgreementMutation = (
  args: QUERIES.MutationPayload<MODELS.IAgencyCommonParams>,
) => {
  return QUERIES.useCustomMutation({
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
