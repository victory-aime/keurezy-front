import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const StatsCache = {
  invalidateAllStatsCache: () =>
    QUERIES.QueryCache.invalidate([Constants.STATS_KEYS.GET_STATS]),
};
