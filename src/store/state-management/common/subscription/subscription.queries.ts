import * as Constants from "./constants";
import { subscriptionServiceInstance } from "./subscription-service-instance";
import { QUERIES } from "rise-core-frontend";
import { MODELS } from "_types/";

const getAllPlansQueries = (args: QUERIES.QueryPayload) => {
  return QUERIES.useCustomQuery<
    MODELS.COMMON.SUBSCRIPTION.ISubscription[],
    any
  >({
    queryKey: [Constants.SUBSCRIPTION_KEYS.GET_ALL_PLANS],
    queryFn: () => subscriptionServiceInstance().get_plans(),
    options: args.queryOptions,
  });
};

const onboardingOwnerMutation = (
  args: QUERIES.MutationPayload<MODELS.COMMON.SUBSCRIPTION.ICreateSimpleUserDto>,
) => {
  return QUERIES.useCustomMutation<any, any>({
    mutationKey: [Constants.SUBSCRIPTION_KEYS.GET_ALL_PLANS],
    mutationFn: ({ payload }) =>
      subscriptionServiceInstance().onboarding_owner(payload!),
    options: args.mutationOptions,
  });
};

export { getAllPlansQueries, onboardingOwnerMutation };
