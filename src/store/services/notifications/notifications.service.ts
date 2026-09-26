import { BaseApi } from 'rise-core-frontend';

/**
 * NotificationsService provides methods for handling Notifications-related operations
 * such as fetching all rental and creating a new notif through API endpoints.
 */
export class NotificationsService extends BaseApi {
  getAllNotifications() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().NOTIFICATION.GET_ALL);
  }

  getAllUnreadNotifications() {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.GET_ALL_UNREAD,
    );
  }

  readAllNotifications() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().NOTIFICATION.READ_ALL);
  }
  readNotification(data: { notificationId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.READ_ONE,
      {},
      { params: data },
    );
  }

  register_fcm_token(data: { token: string; deviceKey: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.REGISTER_TOKEN,
      data,
    );
  }
  remove_fcm_token(token: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.REMOVE_TOKEN,
      {},
      { params: { token } },
    );
  }
}
