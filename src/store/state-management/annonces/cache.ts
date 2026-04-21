import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const AnnonceCache = {
  invalidateAllAnnoncesCache: () =>
    QUERIES.QueryCache.invalidate([Constants.ANNONCES_KEY.ANNONCES_LIST_BY_AGENCY]),
};
