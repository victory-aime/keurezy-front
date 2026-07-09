import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const IntegrationsProvidersCache = {
  invalidateAllTrashedFilesCache: () =>
    QUERIES.QueryCache.invalidate([Constants.INTEGRATIONS_KEYS.GET_TRASHED_FILES]),
};
