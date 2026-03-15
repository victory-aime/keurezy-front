"use client";
import { BaseTabs, Icons } from "_components/custom";
import { ContactModule, UserModule } from "_store/state-management";
import { useMemo } from "react";
import { ENUM } from "_types/*";
import { RenderAgencyContactRequestsList } from "./RenderAgencyContactRequest";

export const AgencyContactList = () => {
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const {
    data: resquestList,
    isLoading,
    refetch: refetchAgencyContactList,
  } = ContactModule.agencyContactListQueries({
    params: {
      agencyId: user?.propertyOwner?.propertyAgency?.id,
      ownerId: user?.propertyOwner?.id,
    },
    queryOptions: { enabled: !!user?.propertyOwner?.propertyAgency?.id },
  });

  const { mutateAsync: readAll, isPending } =
    ContactModule.readAllAgencyContactMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetchAgencyContactList();
        },
      },
    });

  const onReadAll = async () => {
    await readAll({
      params: {
        agencyId: user?.propertyOwner?.propertyAgency?.id,
        ownerId: user?.propertyOwner?.id,
      },
    });
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
      description="Listes des demandes de contact reçues"
      withActionButtons
      actionsButtonProps={{
        withGradient: false,
        validateTitle: "Marque tout comme lues",
        isEmailVerified: user?.emailVerified,
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
            <RenderAgencyContactRequestsList
              refetchAgencyContactList={refetchAgencyContactList}
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
            <RenderAgencyContactRequestsList
              refetchAgencyContactList={refetchAgencyContactList}
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
            <RenderAgencyContactRequestsList
              refetchAgencyContactList={refetchAgencyContactList}
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
