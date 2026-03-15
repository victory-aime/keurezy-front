import * as Constants from "./constants";
import { applicationServiceInstance } from "./application.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const agencyApplicationListQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyFilters>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IApplicationAgencyListResponse>({
    queryKey: [Constants.RENTAL_KEYS.AGENCY_APPLICATION_LIST, params],
    queryFn: () =>
      applicationServiceInstance().agencyApplicationList(
        params as MODELS.IAgencyFilters,
      ),
    options: args.queryOptions,
  });
};

const userApplicationListQueries = (
  args: QUERIES.QueryPayload<{ userId: string }>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<any[]>({
    queryKey: [Constants.RENTAL_KEYS.USER_APPLICATION_LIST],
    queryFn: () =>
      applicationServiceInstance().userApplicationList(params?.userId),
    options: args.queryOptions,
  });
};

const createApplicationMutation = (
  args: QUERIES.MutationPayload<MODELS.IApplicationRequest>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.RENTAL_KEYS.CREATE_APPLICATION],
    mutationFn: ({ payload }) =>
      applicationServiceInstance().createApplicationRequest(payload!),
    options: args.mutationOptions,
  });
};

export {
  agencyApplicationListQueries,
  userApplicationListQueries,
  createApplicationMutation,
};
