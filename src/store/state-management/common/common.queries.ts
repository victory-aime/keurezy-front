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
    queryKey: [Constants.COMMON_KEYS.GET_PAYMENT_STATUS],
    queryFn: () => commonServiceInstance().getPaymentPollingStatus(params?.orderId!),
    options: args.queryOptions,
  });
};

export { getAllPacksQueries, getPaymentStatusQueries };
