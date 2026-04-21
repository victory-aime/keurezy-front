import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const LandCache = {
  invalidateAllLandsCache: () =>
    QUERIES.QueryCache.invalidate([Constants.LAND_KEYS.ALL_LAND_BY_AGENCY]),
};
