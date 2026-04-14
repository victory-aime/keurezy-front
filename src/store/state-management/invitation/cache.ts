import { QUERIES } from "rise-core-frontend";
import * as Constants from "./constants";

export const InvitationCache = {
  invalidateAllInvitationsCache: () =>
    QUERIES.QueryCache.invalidate([
      Constants.INVITE_KEYS.INVITATION_AGENCY_LIST,
    ]),
};
