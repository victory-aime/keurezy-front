import * as Constants from "./constants";
import { contactServiceInstance } from "./contact.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const agencyRequestListQueries = (
  args: QUERIES.QueryPayload<{ agencyId: string }>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IAgencyRequestList[]>({
    queryKey: [Constants.CONTACT_KEYS.AGENCY_REQUEST_LIST],
    queryFn: () => contactServiceInstance().agencyRequestList(params?.agencyId),
    options: args.queryOptions,
  });
};

const changeRequestStatusMutation = (
  args: QUERIES.MutationPayload<{ requestId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CONTACT_KEYS.CHANGE_REQUEST_STATUS],
    mutationFn: ({ params }) =>
      contactServiceInstance().changeRequestStatus(params!),
    options: args.mutationOptions,
  });
};

const readAllRequestsMutation = (
  args: QUERIES.MutationPayload<{ agencyId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CONTACT_KEYS.READ_ALL_REQUESTS],
    mutationFn: ({ params }) =>
      contactServiceInstance().readAllRequests(params!),
    options: args.mutationOptions,
  });
};

const publicContactRequestMutation = (
  args: QUERIES.MutationPayload<MODELS.IContact>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CONTACT_KEYS.PUBLIC_REQUEST],
    mutationFn: ({ payload }) =>
      contactServiceInstance().publicRequest(payload!),
    options: args.mutationOptions,
  });
};

export {
  publicContactRequestMutation,
  agencyRequestListQueries,
  changeRequestStatusMutation,
  readAllRequestsMutation,
};
