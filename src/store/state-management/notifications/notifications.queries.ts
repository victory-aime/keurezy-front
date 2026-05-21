import * as Constants from './constants';
import { notificationsServiceInstance } from './notifications.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllNotificationsQueries = (
  args: QUERIES.QueryPayload<{
    userId: string;
  }>,
) => {
  return QUERIES.useCustomQuery<MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL_NOTIFICATIONS],
    queryFn: () => notificationsServiceInstance().getAllNotifications(args?.params?.userId!),
    options: args.queryOptions,
  });
};

const getAllUnreadNotificationsQueries = (
  args: QUERIES.QueryPayload<{
    userId: string;
  }>,
) => {
  return QUERIES.useCustomQuery<MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL_UNREAD_NOTIFICATION],
    queryFn: () => notificationsServiceInstance().getAllUnreadNotifications(args?.params?.userId!),
    options: args.queryOptions,
  });
};

const readAllNotificationsMutation = (
  args: QUERIES.MutationPayload<any, any, { userId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.READ_ALL_NOTIFICATION],
    mutationFn: ({ params }) =>
      notificationsServiceInstance().readAllNotifications(params?.userId!),
    options: args.mutationOptions,
  });
};

const readNotificationMutation = (
  args: QUERIES.MutationPayload<
    any,
    any,
    {
      data: { notificationId: string; userId: string };
    }
  >,
) => {
  return QUERIES.useCustomMutation<any, any, { data: { notificationId: string; userId: string } }>({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.READ_ONE_NOTIFICATION],
    mutationFn: ({ params }) => notificationsServiceInstance().readNotification(params?.data!),
    options: args.mutationOptions,
  });
};

export {
  getAllNotificationsQueries,
  getAllUnreadNotificationsQueries,
  readAllNotificationsMutation,
  readNotificationMutation,
};
