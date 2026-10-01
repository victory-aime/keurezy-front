'use client';

import { BaseContainer, BaseTag, ColumnsDataTable, DataTableContainer } from '_components/custom';
import { DASHBOARD_ROUTES } from '../../routes';
import { useRouter } from 'next/navigation';
import { InvitationModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { CONSTANTS, ENUM } from '_types/*';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateAuditCell } from '_utils/generateAdit.utils';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { invitationCancelImpact, invitationResendImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import { useFeatureGuard } from '_hooks/useFeatureGuard';

export const InvitationsList = () => {
  const { hasPermission } = usePermissions();
  const { user } = useUserContext();
  const router = useRouter();
  // Bouton « Inviter » : pop-up « limite atteinte » quand le plan est plein
  const { guard, limitModal } = useFeatureGuard('manage_users');
  const { t } = useTranslation();
  // Invitation dont on confirme l'annulation ou le renvoi (l'impact est montré avant)
  const [pending, setPending] = useState<{
    action: 'cancel' | 'resend';
    invitation: { id: string; email: string; name?: string };
  } | null>(null);

  const agencyId = user?.agencyId!;
  const userId = user?.ownerId! ?? user?.staffId!;

  const {
    data: allInvitations,
    isLoading: isInvitationLoad,
    refetch: refetchAllInvitations,
  } = InvitationModule.getAllInvitationByAgency({
    params: {
      agencyId: agencyId!,
    },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const afterAction = {
    mutationOptions: {
      onSuccess: async () => {
        setPending(null);
        await refetchAllInvitations();
      },
    },
  };
  const { mutateAsync: cancelInvitation, isPending: cancelLoading } =
    InvitationModule.cancelInvitationMutation(afterAction);
  const { mutateAsync: resendInvitation, isPending: resendLoading } =
    InvitationModule.resendInvitationMutation(afterAction);
  const isResend = pending?.action === 'resend';

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
          name: 'resend',
          title: "Renvoyer l'invitation",
          // Seule une invitation en attente peut être renvoyée (règle du backend)
          isDisabled: (data) =>
            !hasPermission(AppPermissions.INVITATIONS.RESEND) ||
            data.status !== ENUM.COMMON.Status.PENDING,
          handleClick(data) {
            setPending({ action: 'resend', invitation: data });
          },
        },
        {
          name: 'cancel',
          title: "Annuler l'invitation",
          isDisabled(data) {
            return (
              !hasPermission(AppPermissions.INVITATIONS.CANCEL) ||
              data.status === ENUM.COMMON.Status.CANCELLED ||
              data.status === ENUM.COMMON.Status.EXPIRED ||
              data.status === ENUM.COMMON.Status.ACCEPTED
            );
          },
          handleClick(data) {
            setPending({ action: 'cancel', invitation: data });
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
        // Point d'entrée masqué sans la permission d'inviter
        validatePermission: hasPermission(AppPermissions.INVITATIONS.SEND),
        onClick() {
          guard(() => router.push(DASHBOARD_ROUTES.INVITATIONS.ADD));
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
      <ActionImpactDialog
        isOpen={!!pending}
        onChange={(open: boolean) => !open && setPending(null)}
        title={isResend ? "Renvoyer l'invitation" : "Annuler l'invitation"}
        subject={pending?.invitation.name ?? pending?.invitation.email}
        summary={
          pending
            ? isResend
              ? invitationResendImpact(pending.invitation.email)
              : invitationCancelImpact(pending.invitation.email)
            : undefined
        }
        isSubmitting={cancelLoading || resendLoading}
        confirmTitle={isResend ? "Renvoyer l'invitation" : "Annuler l'invitation"}
        confirmColor={isResend ? 'primary' : 'danger'}
        onConfirm={async () => {
          if (!pending) return;
          const params = { inviteId: pending.invitation.id };
          if (isResend) await resendInvitation({ params });
          else await cancelInvitation({ params });
        }}
      />
      {limitModal}
    </BaseContainer>
  );
};
