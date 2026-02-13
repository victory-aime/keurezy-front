import * as Constants from "./constants";
import { agencyServiceInstance } from "./agency.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getAgencyInfo = (args: QUERIES.QueryPayload<{ agencyId: string }>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IAgency>({
    queryKey: [Constants.AGENCY_KEYS.AGENCY_INFO],
    queryFn: () => agencyServiceInstance().agency_info(params?.agencyId),
    options: queryOptions,
  });
};

const createAgencyMutation = (
  args: QUERIES.MutationPayload<MODELS.ICreateAgency>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CREATE_AGENCY],
    mutationFn: ({ payload }) =>
      agencyServiceInstance().create_agency(payload!),
    options: args.mutationOptions,
  });
};

const updateAgencyMutation = (
  args: QUERIES.MutationPayload<MODELS.IUpdateAgency>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.UPDATE_AGENCY],
    mutationFn: ({ payload }) =>
      agencyServiceInstance().update_agency(payload!),
    options: args.mutationOptions,
  });
};

const closeAgencyMutation = (
  args: QUERIES.MutationPayload<MODELS.ICloseAgency>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CLOSE_AGENCY],
    mutationFn: ({ params }) => agencyServiceInstance().close_agency(params!),
    options: args.mutationOptions,
  });
};

const checkNameMutation = (args: QUERIES.MutationPayload<{ name: string }>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CHECK_NAME],
    mutationFn: ({ payload }) =>
      agencyServiceInstance().check_name(payload?.name!),
    options: args.mutationOptions,
  });
};

export {
  createAgencyMutation,
  checkNameMutation,
  getAgencyInfo,
  updateAgencyMutation,
  closeAgencyMutation,
};
