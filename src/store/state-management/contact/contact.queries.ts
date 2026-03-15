import * as Constants from "./constants";
import { contactServiceInstance } from "./contact.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const agencyContactListQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyCommonParams>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IAgencyRequestList[]>({
    queryKey: [Constants.CONTACT_KEYS.AGENCY_CONTACT_LIST],
    queryFn: () =>
      contactServiceInstance().agencyContactList(
        params as MODELS.IAgencyCommonParams,
      ),
    options: args.queryOptions,
  });
};

const changeAgencyContactStatusMutation = (
  args: QUERIES.MutationPayload<MODELS.IAgencyCommonParams>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CONTACT_KEYS.AGENCY_CONTACT_UPDATE_STATUS],
    mutationFn: ({ params }) =>
      contactServiceInstance().agencyChangeContactStatus(
        params! as MODELS.IAgencyCommonParams,
      ),
    options: args.mutationOptions,
  });
};

const readAllAgencyContactMutation = (
  args: QUERIES.MutationPayload<MODELS.IAgencyCommonParams>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CONTACT_KEYS.AGENCY_CONTACT_READ_ALL],
    mutationFn: ({ params }) =>
      contactServiceInstance().readAllAgencyContact(params!),
    options: args.mutationOptions,
  });
};

const publicContactRequestMutation = (
  args: QUERIES.MutationPayload<MODELS.IContact>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.CONTACT_KEYS.PUBLIC_CONTACT_REQUEST],
    mutationFn: ({ payload }) =>
      contactServiceInstance().publicContact(payload!),
    options: args.mutationOptions,
  });
};

export {
  publicContactRequestMutation,
  agencyContactListQueries,
  changeAgencyContactStatusMutation,
  readAllAgencyContactMutation,
};
