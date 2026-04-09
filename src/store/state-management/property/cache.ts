import { QUERIES } from "rise-core-frontend";
import * as Constants from "./constants";

export const PropertyCache = {
  invalidateAllPropertyCache: () =>
    QUERIES.QueryCache.invalidate([
      Constants.PROPERTIES_KEYS.ALL_PROPERTIES_BY_AGENCY,
    ]),
};
