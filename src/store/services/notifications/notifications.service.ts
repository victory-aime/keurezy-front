import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * NotificationsService provides methods for handling Notifications-related operations
 * such as fetching all rental and creating a new notif through API endpoints.
 */
export class NotificationsService extends BaseApi {
  getAllNotifications(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.GET_ALL,
      {},
      { params: { userId } },
    );
  }

  getAllUnreadNotifications(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.GET_ALL_UNREAD,
      {},
      { params: { userId } },
    );
  }

  readAllNotifications(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.READ_ALL,
      {},
      { params: { userId } },
    );
  }
  readNotification(data: { notificationId: string; userId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.READ_ONE,
      {},
      { params: data },
    );
  }
}
