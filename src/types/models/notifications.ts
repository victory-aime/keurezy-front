import { ENUM } from "..";

interface INotificationListResponse {
  id: string;
  recipientId: string;
  senderId: string;
  agencyId: string;
  type: ENUM.NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export type { INotificationListResponse };
