import * as Constants from "./constants";
import { contactServiceInstance } from "./contact.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

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

export { publicContactRequestMutation };
