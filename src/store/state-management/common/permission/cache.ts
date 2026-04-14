import { QUERIES } from "rise-core-frontend";
import * as Constants from "./constants";

export const PermissionsCache = {
  invalidateAllPermissionsCache: () =>
    QUERIES.QueryCache.invalidate([Constants.PERMS_KEYS.GET_ALL_PERMS]),
};
