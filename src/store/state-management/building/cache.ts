import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const BuildingCache = {
  invalidateAllBuildingCache: () =>
    QUERIES.QueryCache.invalidate([Constants.BUILDING_KEYS.ALL_BUILDING_BY_AGENCY]),
};
