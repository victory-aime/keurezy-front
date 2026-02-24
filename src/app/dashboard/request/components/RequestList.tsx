"use client";
import { BaseTabs, Icons } from "_components/custom";
import { ContactModule, UserModule } from "_store/state-management";
import { useMemo } from "react";
import { ENUM } from "_types/*";
import { RenderRequests } from "./RenderRequests";

export const RequestList = () => {
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const {
    data: resquestList,
    isLoading,
    refetch: refetchRequestList,
  } = ContactModule.agencyRequestListQueries({
    params: { agencyId: user?.propertyOwner?.propertyAgency?.id },
    queryOptions: { enabled: !!user?.propertyOwner?.propertyAgency?.id },
  });

  const { mutateAsync: readAll, isPending } =
    ContactModule.readAllRequestsMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetchRequestList();
        },
      },
    });

  const onReadAll = async () => {
    await readAll({ params: user?.propertyOwner?.propertyAgency?.id });
  };

  const { allRequests, unreadRequests, readRequests } = useMemo(() => {
    const all = resquestList ?? [];
    return {
      allRequests: all,
      unreadRequests: all.filter(
        (r) => r.status === ENUM.COMMON.Status.PENDING,
      ),
      readRequests: all.filter((r) => r.status === ENUM.COMMON.Status.READ),
    };
  }, [resquestList]);

  return (
    <BaseTabs
      title="Demandes"
      variant={"enclosed"}
      description="Listes des demandes de contact reçues"
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
            <RenderRequests
              refetchRequestList={refetchRequestList}
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
            <RenderRequests
              refetchRequestList={refetchRequestList}
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
            <RenderRequests
              refetchRequestList={refetchRequestList}
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
