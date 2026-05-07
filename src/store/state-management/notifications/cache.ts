import { QUERIES } from 'rise-core-frontend';
import * as Constants from './constants';

export const NotificationsCache = {
  invalidateAllUnreadNotificationCache: () =>
    QUERIES.QueryCache.invalidate([Constants.NOTIFICATIONS_KEYS.GET_ALL_UNREAD_NOTIFICATION]),
};
