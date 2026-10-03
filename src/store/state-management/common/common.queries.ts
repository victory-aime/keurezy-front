import * as Constants from './constants';
import { commonServiceInstance } from './common.service-instance';
import { ENUM, MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllPacksQueries = (args: QUERIES.QueryPayload<MODELS.COMMON.ISubscriptionPlan[]>) => {
  const { queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, undefined, MODELS.COMMON.ISubscriptionPlan[]>({
    queryKey: [Constants.COMMON_KEYS.GET_ALL_PACKS],
    queryFn: () => commonServiceInstance().getAllPacks(),
    options: queryOptions,
  });
};

const getPaymentStatusQueries = (
  args: QUERIES.QueryPayload<MODELS.COMMON.IPaymentStatus, undefined, { orderId: string }>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<undefined, { orderId: string }, MODELS.COMMON.IPaymentStatus>({
    queryKey: [Constants.COMMON_KEYS.GET_PAYMENT_STATUS, params],
    queryFn: () => commonServiceInstance().getPaymentPollingStatus(params?.orderId!),
    options: args.queryOptions,
  });
};

/** Aperçu d'un code promo à l'inscription (étape « Plan »). */
const onboardingPromoMutation = (
  args: QUERIES.MutationPayload<
    { planId: string; billingCycle: string; promoCode: string },
    { amount: number; amountBeforePromo: number; promo: { code: string; discount: number } }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.COMMON_KEYS.GET_PAYMENT_STATUS, 'promo'],
    mutationFn: ({ payload }) => commonServiceInstance().onboardingPromo(payload!),
    options: args.mutationOptions,
  });

export { getAllPacksQueries, getPaymentStatusQueries, onboardingPromoMutation };
