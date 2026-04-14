"use client";

import {
  BaseContainer,
  BaseTag,
  ColumnsDataTable,
  DataTableContainer,
  DeleteModalAnimation,
} from "_components/custom";
import { DASHBOARD_ROUTES } from "../../routes";
import { useRouter } from "next/navigation";
import { InvitationModule } from "_store/state-management";
import { useUserContext } from "_context/user-context";
import { CONSTANTS, ENUM } from "_types/*";
import { formatDisplayDate } from "rise-core-frontend";
import { useState } from "react";

export const InvitationsList = () => {
  const [open, setOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<string | null>(
    null,
  );
  const { user } = useUserContext();
  const router = useRouter();

  const {
    data: allInvitations,
    isLoading: isInvitationLoad,
    refetch: refetchAllInvitations,
  } = InvitationModule.getAllInvitationByAgency({
    params: {
      agencyId: user?.owner?.agency?.id,
    },
    queryOptions: { enabled: !!user?.owner?.agency?.id },
  });

  const { mutateAsync: cancelInvitation, isPending: cancelLoading } =
    InvitationModule.cancelInvitationMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetchAllInvitations();
        },
      },
    });

  const invitationColumns: ColumnsDataTable[] = [
    {
      header: "Nom",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Rôle",
      accessor: "agencyRole",
      cell: (role) =>
        CONSTANTS.AGENCY_ROLE_LIST.find((r) => r.value === role)?.label || role,
    },
    {
      header: "Ajouter par",
      accessor: "invitedBy",
    },
    {
      header: "Créé le",
      accessor: "createdAt",
      cell: (date) => formatDisplayDate(date),
    },
    {
      header: "Statut",
      accessor: "status",
      cell: (status) => <BaseTag status={status} />,
    },
    {
      header: " Actions",
      accessor: "actions",
      actions: [
        {
          name: "delete",
          isDisabled(data) {
            return data.status === ENUM.COMMON.Status.CANCELLED;
          },
          handleClick(data) {
            setOpen(true);
            setSelectedInvitation(data.id);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      title={"Gestion des Invitations"}
      description={` ${allInvitations?.length || 0} Invitations `}
      border={"none"}
      withActionButtons
      actionsButtonProps={{
        validateTitle: "Invite un membre",
        onClick() {
          router.push(DASHBOARD_ROUTES.INVITATIONS.ADD);
        },
        onReload: async () => {
          await refetchAllInvitations();
        },
      }}
    >
      <DataTableContainer
        data={allInvitations}
        columns={invitationColumns}
        isLoading={isInvitationLoad}
        hidePagination={allInvitations?.length < 10}
      />
      <DeleteModalAnimation
        title={"Annuler l'invitation"}
        onChange={setOpen}
        isOpen={open}
        isLoading={cancelLoading}
        callback={async () => {
          await cancelInvitation({ params: { inviteId: selectedInvitation! } });
        }}
        ignoreFooter={false}
      >
        Etes vous sur de vouloir annuler cette invitation ? Cette action est
        irreversible.
      </DeleteModalAnimation>
    </BaseContainer>
  );
};
