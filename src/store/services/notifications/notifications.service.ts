import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * NotificationsService provides methods for handling Notifications-related operations
 * such as fetching all rental and creating a new notif through API endpoints.
 */
export class NotificationsService extends BaseApi {
  getAllNotifications(recipientId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.GET_ALL,
      {},
      { params: { recipientId } },
    );
  }

  getAllUnreadNotifications(recipientId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.GET_ALL_UNREAD,
      {},
      { params: { recipientId } },
    );
  }

  readAllNotifications(recipientId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.READ_ALL,
      {},
      { params: { recipientId } },
    );
  }
  readNotification(data: { notificationId: string; recipientId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().NOTIFICATION.READ_ONE,
      {},
      { params: data },
    );
  }
}
