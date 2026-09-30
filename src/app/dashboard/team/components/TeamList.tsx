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
import { memberDisableImpact, memberRemovalImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';

export const TeamList = () => {
  const { user } = useUserContext();
  const [selectedValues, setSelectedValues] = useState<MODELS.ITeam | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  // Retrait réservé à l'owner (le backend le refuse sinon) ; impact chargé à l'ouverture
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === UserRole.OWNER;
  const [memberToRemove, setMemberToRemove] = useState<MODELS.ITeam | null>(null);
  // Désactivation confirmée après l'impact ; la réactivation reste immédiate
  const [memberToDisable, setMemberToDisable] = useState<MODELS.ITeam | null>(null);
  const impactMember = memberToRemove ?? memberToDisable;

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
    params: { agencyId: agencyId ?? '', id: impactMember?.id ?? '' },
    queryOptions: { enabled: !!agencyId && !!impactMember?.id && isOwner },
  });

  const { mutate: removeMember, isPending: isRemoving } = TeamModule.removeMemberMutation({
    mutationOptions: { onSuccess: () => setMemberToRemove(null) },
  });

  const { mutateAsync: changeStatusTeam, isPending: isChangeStatusPending } =
    TeamModule.changeStatusTeamMutation({
      mutationOptions: {
        onSuccess: async () => {
          setMemberToDisable(null);
          await reloadTeamList();
        },
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
          // Réservé à l'owner, comme côté backend
          isDisabled={!isOwner}
          // L'interrupteur suit l'état serveur : il ne bascule qu'après confirmation
          onSwitchChange={async (item) => {
            if (item) await handleStatus(true, values.id, values.userId);
            else setMemberToDisable(values);
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
        isOpen={!!memberToDisable}
        onChange={(open: boolean) => !open && setMemberToDisable(null)}
        title="Désactiver ce membre"
        subject={memberToDisable ? `${memberToDisable.name} · ${memberToDisable.email}` : undefined}
        summary={memberImpact && memberToDisable ? memberDisableImpact(memberImpact) : undefined}
        isLoadingImpact={isImpactLoading}
        isSubmitting={isChangeStatusPending}
        confirmTitle="Désactiver"
        onConfirm={() => memberToDisable?.id && handleStatus(false, memberToDisable.id, '')}
      />
      <ActionImpactDialog
        isOpen={!!memberToRemove}
        onChange={(open: boolean) => !open && setMemberToRemove(null)}
        title="Retirer ce membre de l'équipe"
        subject={memberToRemove ? `${memberToRemove.name} · ${memberToRemove.email}` : undefined}
        summary={memberImpact && memberToRemove ? memberRemovalImpact(memberImpact) : undefined}
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
