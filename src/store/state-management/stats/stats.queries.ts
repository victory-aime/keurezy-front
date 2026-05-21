import * as Constants from './constants';
import { StatsServiceInstance } from './stats.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAgencyStats = (args: QUERIES.QueryPayload<{ agencyId: string }>) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<{
    properties: {
      total: 0;
      available: 0;
      rented: 0;
      occupancyRate: 0;
    };
    leads: {
      total: 0;
      new: 0;
      contacted: 0;
      visitPlanned: 0;
      converted: 0;
      conversionRate: 0;
    };
    visits: {
      total: 0;
      planned: 0;
      confirmed: 0;
      done: 0;
      cancelled: 0;
    };
    tenants: {
      total: 0;
      active: 0;
      inactive: 0;
    };
    staff: {
      total: 0;
      active: 0;
      inactive: 0;
    };
    tickets: {
      total: 0;
      open: 0;
      inProgress: 0;
      resolved: 0;
    };
  }>({
    queryKey: [Constants.STATS_KEYS.GET_STATS, params],
    queryFn: () => StatsServiceInstance().stats_agency(params?.agencyId),
    options: queryOptions,
  });
};
export { getAgencyStats };
