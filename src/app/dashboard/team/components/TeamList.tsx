'use client';

import {
  BaseContainer,
  BaseSwitch,
  ColumnsDataTable,
  DataTableContainer,
} from '_components/custom';
import { useUserContext } from '_context/user-context';
import { TeamModule } from '_store/state-management';
import { CONSTANTS, MODELS, ENUM } from '_types/*';
import { formatDisplayDate } from 'rise-core-frontend';
import { TeamDetails } from './TeamDetails';
import { useState } from 'react';
import { useAuthContext } from '_context/auth-context';
import { UserRole } from '../../../../types/enum';
import { memberRemovalImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';

export const TeamList = () => {
  const { user } = useUserContext();
  const [selectedValues, setSelectedValues] = useState<MODELS.ITeam | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  // Retrait réservé à l'owner (le backend le refuse sinon) ; impact chargé à l'ouverture
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === UserRole.OWNER;
  const [memberToRemove, setMemberToRemove] = useState<MODELS.ITeam | null>(null);

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const {
    data: teamList,
    isLoading: isTeamLoading,
    refetch: reloadTeamList,
  } = TeamModule.getAllTeamByAgency({
    params: {
      agencyId: agencyId!,
    },
    queryOptions: {
      enabled: !!agencyId && !!userId,
    },
  });

  const { data: memberImpact, isLoading: isImpactLoading } = TeamModule.getMemberImpactQueries({
    params: { agencyId: agencyId ?? '', id: memberToRemove?.id ?? '' },
    queryOptions: { enabled: !!agencyId && !!memberToRemove?.id && isOwner },
  });

  const { mutate: removeMember, isPending: isRemoving } = TeamModule.removeMemberMutation({
    mutationOptions: { onSuccess: () => setMemberToRemove(null) },
  });

  const { mutateAsync: changeStatusTeam, isPending: isChangeStatusPending } =
    TeamModule.changeStatusTeamMutation({
      mutationOptions: {
        onSuccess: async () => await reloadTeamList(),
      },
    });

  const handleStatus = async (status: boolean, id: string, user: string) => {
    await changeStatusTeam({
      payload: { status, id },
      params: { agencyId: agencyId! },
    });
  };

  const teamsColumns: ColumnsDataTable[] = [
    {
      header: 'Nom',
      accessor: 'name',
    },
    {
      header: 'email',
      accessor: 'email',
    },
    {
      header: 'role',
      accessor: 'role',
      cell: (role) => CONSTANTS.AGENCY_ROLE_LIST.find((r) => r.value === role)?.label || role,
    },
    {
      header: 'Status',
      accessor: 'fullObject',
      cell: (values) => (
        <BaseSwitch
          isChecked={values.status === ENUM.COMMON.Status.ACTIVE}
          isLoading={isChangeStatusPending}
          onSwitchChange={async (item) => {
            await handleStatus(item, values.id, values.userId);
          }}
        />
      ),
    },
    {
      header: 'Ajouter le',
      accessor: 'createdAt',
      cell: (createdAt) => formatDisplayDate(createdAt),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        {
          name: 'view',
          handleClick(data) {
            setOpenDetails(true);
            setSelectedValues(data);
          },
        },
        {
          name: 'delete',
          title: "Retirer de l'équipe",
          isDisabled: () => !isOwner,
          handleClick(data) {
            setMemberToRemove(data);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      title={"Gestion de l'équipe"}
      description={" Gérez les membres de votre équipe et leurs rôles au sein de l'agence."}
      border={'none'}
      withActionButtons
      actionsButtonProps={{
        onReload: async () => await reloadTeamList(),
      }}
    >
      <DataTableContainer
        data={teamList ?? []}
        columns={teamsColumns}
        isLoading={isTeamLoading}
        hidePagination={teamList ? teamList.length < 100 : true}
      />
      <TeamDetails
        data={selectedValues}
        onChange={setOpenDetails}
        isOpen={openDetails}
        onUpdated={setSelectedValues}
        callback={() => {
          // Bascule : un membre actif est désactivé, et inversement
          handleStatus(
            selectedValues?.status !== ENUM.COMMON.Status.ACTIVE,
            selectedValues?.id!,
            selectedValues?.userId!,
          );
          setOpenDetails(false);
        }}
      />
      <ActionImpactDialog
        isOpen={!!memberToRemove}
        onChange={(open: boolean) => !open && setMemberToRemove(null)}
        title="Retirer ce membre de l'équipe"
        subject={memberToRemove ? `${memberToRemove.name} · ${memberToRemove.email}` : undefined}
        summary={memberImpact ? memberRemovalImpact(memberImpact) : undefined}
        isLoadingImpact={isImpactLoading}
        isSubmitting={isRemoving}
        confirmTitle="Retirer de l'équipe"
        onConfirm={() =>
          memberToRemove?.id &&
          agencyId &&
          removeMember({ params: { agencyId, id: memberToRemove.id } })
        }
      />
    </BaseContainer>
  );
};
