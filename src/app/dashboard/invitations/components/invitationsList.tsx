'use client';

import {
  BaseContainer,
  BaseTag,
  ColumnsDataTable,
  DataTableContainer,
  DeleteModalAnimation,
} from '_components/custom';
import { DASHBOARD_ROUTES } from '../../routes';
import { useRouter } from 'next/navigation';
import { InvitationModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { CONSTANTS, ENUM } from '_types/*';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateAuditCell } from '_utils/generateAdit.utils';

export const InvitationsList = () => {
  const { user } = useUserContext();
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<string | null>(null);

  const agencyId = user?.agencyId!;
  const userId = user?.ownerId! ?? user?.staffId!;

  const {
    data: allInvitations,
    isLoading: isInvitationLoad,
    refetch: refetchAllInvitations,
  } = InvitationModule.getAllInvitationByAgency({
    params: {
      agencyId,
      userId,
    },
    queryOptions: { enabled: !!agencyId && !!userId },
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
      header: 'Nom',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Rôle',
      accessor: 'agencyRole',
      cell: (role) => CONSTANTS.AGENCY_ROLE_LIST.find((r) => r.value === role)?.label || role,
    },
    {
      header: 'Ajouter le',
      accessor: 'fullObject',
      cell: (value) =>
        generateAuditCell(t, { userId: value?.invitedBy, timestamp: value?.createdAt }, user?.id),
    },
    {
      header: 'Statut',
      accessor: 'status',
      cell: (status) => <BaseTag status={status} />,
    },
    {
      header: ' Actions',
      accessor: 'actions',
      actions: [
        {
          name: 'cancel',
          isDisabled(data) {
            return (
              data.status === ENUM.COMMON.Status.CANCELLED ||
              data.status === ENUM.COMMON.Status.EXPIRED ||
              data.status === ENUM.COMMON.Status.ACCEPTED
            );
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
      title={'Gestion des Invitations'}
      description={`${allInvitations?.length || 0} Invitations `}
      border={'none'}
      withActionButtons
      actionsButtonProps={{
        validateTitle: 'Invite un membre',
        onClick() {
          router.push(DASHBOARD_ROUTES.INVITATIONS.ADD);
        },
        onReload: async () => {
          await refetchAllInvitations();
        },
      }}
    >
      <DataTableContainer
        data={allInvitations ?? []}
        columns={invitationColumns}
        isLoading={isInvitationLoad}
        paginationData={{
          lazy: false,
          totalDataPerPage: 10,
        }}
        hidePagination={allInvitations && allInvitations?.length < 10}
      />
      <DeleteModalAnimation
        title={"Annuler l'invitation"}
        onChange={setOpen}
        isOpen={open}
        isLoading={cancelLoading}
        callback={async () => {
          await cancelInvitation({ params: { inviteId: selectedInvitation!, agencyId, userId } });
        }}
        ignoreFooter={false}
      >
        Etes vous sur de vouloir annuler cette invitation ? Cette action est irreversible.
      </DeleteModalAnimation>
    </BaseContainer>
  );
};
