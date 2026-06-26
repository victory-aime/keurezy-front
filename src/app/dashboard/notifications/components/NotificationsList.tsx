'use client';
import { BaseTabs, Icons } from '_components/custom';
import { NotificationsModule } from '_store/state-management';
import { useMemo } from 'react';
import { RenderNotifications } from './RenderNotifications';
import { useUserContext } from '_context/user-context';

export const NotificationsList = () => {
  const { user } = useUserContext();

  const {
    data: notificationsList,
    isLoading,
    refetch: refetchNotificationList,
  } = NotificationsModule.getAllNotificationsQueries({
    params: { userId: user?.id! },
    queryOptions: { enabled: !!user?.id },
  });

  const { mutateAsync: readAll, isPending } = NotificationsModule.readAllNotificationsMutation({
    mutationOptions: {
      onSuccess: async () => {
        NotificationsModule.NotificationsCache.invalidateAllUnreadNotificationCache();
        await refetchNotificationList();
      },
    },
  });

  const onReadAll = async () => {
    await readAll({ params: { userId: user?.id! } });
  };

  const { allRequests, unreadRequests, readRequests } = useMemo(() => {
    const all = notificationsList ?? [];
    return {
      allRequests: all,
      unreadRequests: all?.filter((r: { isRead: boolean }) => !r.isRead),
      readRequests: all.filter((r: { isRead: boolean }) => r.isRead),
    };
  }, [notificationsList]);

  return (
    <BaseTabs
      title="Notifications"
      description="Listes des notifications reçues"
      withActionButtons
      actionsButtonProps={{
        withGradient: false,
        validateTitle: 'Marque tout comme lues',
        isEmailVerified: user?.emailVerified,
        validatePermission: unreadRequests.length > 0,
        icon: <Icons.DoubleCheck />,
        onClick: async () => {
          await onReadAll();
        },
      }}
      width={'full'}
      items={[
        {
          tabIndex: 0,
          content: (
            <RenderNotifications
              refetchNotificationList={refetchNotificationList}
              list={allRequests}
              isLoading={isLoading || isPending}
            />
          ),
          label: `Toutes ${allRequests.length}`,
        },
        {
          tabIndex: 1,
          icon: <Icons.Close />,
          content: (
            <RenderNotifications
              refetchNotificationList={refetchNotificationList}
              list={unreadRequests}
              isLoading={isLoading || isPending}
            />
          ),
          label: `Non lues ${unreadRequests.length}`,
        },
        {
          tabIndex: 2,
          icon: <Icons.Check />,
          content: (
            <RenderNotifications
              refetchNotificationList={refetchNotificationList}
              list={readRequests}
              isLoading={isLoading || isPending}
            />
          ),
          label: `Lues ${readRequests.length}`,
        },
      ]}
    />
  );
};
