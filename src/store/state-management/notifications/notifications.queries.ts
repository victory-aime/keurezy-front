import * as Constants from './constants';
import { notificationsServiceInstance } from './notifications.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

// Notifications de l'utilisateur connecté (identité déduite de la session côté serveur)
const getAllNotificationsQueries = (
  args: QUERIES.QueryPayload<MODELS.INotificationListResponse[]>,
) => {
  return QUERIES.useCustomQuery<undefined, undefined, MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL_NOTIFICATIONS],
    queryFn: () => notificationsServiceInstance().getAllNotifications(),
    options: args.queryOptions,
  });
};

const getAllUnreadNotificationsQueries = (
  args: QUERIES.QueryPayload<MODELS.INotificationListResponse[]>,
) => {
  return QUERIES.useCustomQuery<undefined, undefined, MODELS.INotificationListResponse[]>({
    queryKey: [Constants.NOTIFICATIONS_KEYS.GET_ALL_UNREAD_NOTIFICATION],
    queryFn: () => notificationsServiceInstance().getAllUnreadNotifications(),
    options: args.queryOptions,
  });
};

const readAllNotificationsMutation = (args: QUERIES.MutationPayload) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.READ_ALL_NOTIFICATION],
    mutationFn: () => notificationsServiceInstance().readAllNotifications(),
    options: args.mutationOptions,
  });
};

const readNotificationMutation = (
  args: QUERIES.MutationPayload<any, any, { data: { notificationId: string } }>,
) => {
  return QUERIES.useCustomMutation<any, any, { data: { notificationId: string } }>({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.READ_ONE_NOTIFICATION],
    mutationFn: ({ params }) => notificationsServiceInstance().readNotification(params?.data!),
    options: args.mutationOptions,
  });
};
const registerFcmTokenMutation = (
  args: QUERIES.MutationPayload<{ token: string; deviceKey: string }>,
) => {
  return QUERIES.useCustomMutation<{ token: string; deviceKey: string }, unknown>({
    mutationKey: [Constants.NOTIFICATIONS_KEYS.REGISTER_TOKEN],
    mutationFn: ({ payload }) => notificationsServiceInstance().register_fcm_token(payload!),
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
