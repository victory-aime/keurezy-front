import * as Constants from './constants';
import { notificationsServiceInstance } from './notifications.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllNotificationsQueries = (
  args: QUERIES.QueryPayload<
    MODELS.INotificationListResponse[],
    undefined,
    {
      userId: string;
    }
  >,
) => {
  return QUERIES.useCustomQuery<undefined, { userId: string }, MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL_NOTIFICATIONS],
    queryFn: () => notificationsServiceInstance().getAllNotifications(args?.params?.userId!),
    options: args.queryOptions,
  });
};

const getAllUnreadNotificationsQueries = (
  args: QUERIES.QueryPayload<
    MODELS.INotificationListResponse[],
    undefined,
    {
      userId: string;
    }
  >,
) => {
  return QUERIES.useCustomQuery<undefined, { userId: string }, MODELS.INotificationListResponse[]>({
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
const registerFcmTokenMutation = (
  args: QUERIES.MutationPayload<
    { token: string },
    any,
    {
      userId: string;
    }
  >,
) => {
  return QUERIES.useCustomMutation<{ token: string; deviceKey: string }, any, { userId: string }>({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.REGISTER_TOKEN],
    mutationFn: ({ params, payload }) =>
      notificationsServiceInstance().register_fcm_token(params?.userId!, payload!),
    options: args.mutationOptions,
  });
};
const removeFcmTokenMutation = (args: QUERIES.MutationPayload<any, any, { token: string }>) => {
  return QUERIES.useCustomMutation<any, any, { token: string }>({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.REMOVE_TOKEN],
    mutationFn: ({ params }) => notificationsServiceInstance().remove_fcm_token(params?.token!),
    options: args.mutationOptions,
  });
};

export {
  getAllNotificationsQueries,
  getAllUnreadNotificationsQueries,
  readAllNotificationsMutation,
  readNotificationMutation,
  registerFcmTokenMutation,
  removeFcmTokenMutation,
};
