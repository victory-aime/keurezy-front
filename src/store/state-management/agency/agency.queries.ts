import * as Constants from "./constants";
import { agencyServiceInstance } from "./agency.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getAgencyInfo = (args: QUERIES.QueryPayload<{ agencyId: string }>) => {
  const { params, queryOptions } = args;

  // return QUERIES.useCustomQuery<MODELS.IUser, any>({
  //   queryKey: [Constants.USERS_KEYS.GET_USER_INFO],
  //   queryFn: () => usersServiceInstance().user_info(params?.userId),
  //   options: queryOptions,
  // });
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

const checkNameMutation = (args: QUERIES.MutationPayload<{ name: string }>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CHECK_NAME],
    mutationFn: ({ payload }) =>
      agencyServiceInstance().check_name(payload?.name!),
    options: args.mutationOptions,
  });
};

export { createAgencyMutation, checkNameMutation, getAgencyInfo };
