"use client";
import { BaseTabs, Icons } from "_components/custom";
import { NotificationsModule, UserModule } from "_store/state-management";
import { useMemo } from "react";
import { RenderNotifications } from "./RenderNotifications";

export const NotificationsList = () => {
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });

  const {
    data: notificationsList,
    isLoading,
    refetch: refetchNotificationList,
  } = NotificationsModule.getAllNotificationsQueries({
    params: { recipientId: user?.id },
    queryOptions: { enabled: !!user?.id },
  });

  const { mutateAsync: readAll, isPending } =
    NotificationsModule.readAllNotificationsMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetchNotificationList();
        },
      },
    });

  const onReadAll = async () => {
    await readAll({ params: user?.id });
  };

  const { allRequests, unreadRequests, readRequests } = useMemo(() => {
    const all = notificationsList ?? [];
    return {
      allRequests: all,
      unreadRequests: all.filter((r) => r.isRead === false),
      readRequests: all.filter((r) => r.isRead === true),
    };
  }, [notificationsList]);

  return (
    <BaseTabs
      title="Notifications"
      variant={"enclosed"}
      description="Listes des notifications reçues"
      withActionButtons
      actionsButtonProps={{
        withGradient: false,
        validateTitle: "Marque tout comme lues",
        validatePermission: unreadRequests.length > 0,
        icon: <Icons.DoubleCheck />,
        onClick: async () => {
          await onReadAll();
        },
      }}
      width={"full"}
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
