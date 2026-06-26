import * as Constants from './constants';
import { StatsServiceInstance } from './stats.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAgencyStats = (
  args: QUERIES.QueryPayload<MODELS.IAgencyStats, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { agencyId: string }, MODELS.IAgencyStats>({
    queryKey: [Constants.STATS_KEYS.GET_STATS, params],
    queryFn: () => StatsServiceInstance().stats_agency(params?.agencyId!),
    options: queryOptions,
  });
};
export { getAgencyStats };
