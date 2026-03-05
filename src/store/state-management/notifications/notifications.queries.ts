import * as Constants from "./constants";
import { notificationsServiceInstance } from "./notifications.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getAllNotificationsQueries = (
  args: QUERIES.QueryPayload<{ recipientId: string }>,
) => {
  return QUERIES.useCustomQuery<MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL],
    queryFn: () =>
      notificationsServiceInstance().getAllNotifications(
        args?.params?.recipientId!,
      ),
    options: args.queryOptions,
  });
};

const getAllUnreadNotificationsQueries = (
  args: QUERIES.QueryPayload<{ recipientId: string }>,
) => {
  return QUERIES.useCustomQuery<MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL_UNREAD],
    queryFn: () =>
      notificationsServiceInstance().getAllUnreadNotifications(
        args?.params?.recipientId!,
      ),
    options: args.queryOptions,
  });
};

const readAllNotificationsMutation = (
  args: QUERIES.MutationPayload<{ recipientId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.READ_ALL],
    mutationFn: ({ params }) =>
      notificationsServiceInstance().readAllNotifications(params!),
    options: args.mutationOptions,
  });
};

const readNotificationMutation = (
  args: QUERIES.MutationPayload<{
    notificationId: string;
    recipientId: string;
  }>,
) => {
  return QUERIES.useCustomMutation<
    { notificationId: string; recipientId: string },
    any
  >({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.READ_ONE],
    mutationFn: ({ params }) =>
      notificationsServiceInstance().readNotification(params),
    options: args.mutationOptions,
  });
};

export {
  getAllNotificationsQueries,
  getAllUnreadNotificationsQueries,
  readAllNotificationsMutation,
  readNotificationMutation,
};
