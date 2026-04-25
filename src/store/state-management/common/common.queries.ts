import * as Constants from './constants';
import { commonServiceInstance } from './common.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllPacksQueries = (args: QUERIES.QueryPayload) => {
  const { queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.COMMON.ISubscriptionPlan[]>({
    queryKey: [Constants.COMMON_KEYS.GET_ALL_PACKS],
    queryFn: () => commonServiceInstance().getAllPacks(),
    options: queryOptions,
  });
};

export { getAllPacksQueries };
