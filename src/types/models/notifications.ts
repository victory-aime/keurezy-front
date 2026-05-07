import { ENUM } from '..';

interface INotificationListResponse {
  id: string;
  isRead: boolean;
  notificationId: string;
  userId: string;
  notification: {
    id: string;
    type: ENUM.NotificationType;
    title: string;
    content: string;
    scope: string;
    createdAt: string;
  };
}

export type { INotificationListResponse };
