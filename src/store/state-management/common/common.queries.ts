import * as Constants from './constants';
import { commonServiceInstance } from './common.service-instance';
import { ENUM, MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllPacksQueries = (args: QUERIES.QueryPayload) => {
  const { queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.COMMON.ISubscriptionPlan[]>({
    queryKey: [Constants.COMMON_KEYS.GET_ALL_PACKS],
    queryFn: () => commonServiceInstance().getAllPacks(),
    options: queryOptions,
  });
};

const getPaymentStatusQueries = (args: QUERIES.QueryPayload<{ orderId: string }>) => {
  const { params } = args;
  return QUERIES.useCustomQuery<{
    order_id: string;
    local_status: string;
    naboo_status: string;
    data: {
      phone: string;
      planId: string;
      address: string;
      priceXOF: number;
      username: string;
      userEmail: string;
      password: string;
      description: string;
      documents: string[];
      pricingId: string;
      agencyName: string;
      acceptTerms: boolean;
      agencyEmail: string;
      pricingType: string;
      billingCycle: ENUM.BillingCycle;
      commissionRate: string;
    };
  }>({
    queryKey: [Constants.COMMON_KEYS.GET_PAYMENT_STATUS],
    queryFn: () => commonServiceInstance().getPaymentPollingStatus(params?.orderId),
    options: args.queryOptions,
  });
};

export { getAllPacksQueries, getPaymentStatusQueries };
