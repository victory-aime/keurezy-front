'use client';

import { Box, VStack } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useState } from 'react';
import { BaseButton, BaseText, FormTextInput } from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { agencyCloseImpact } from '_utils/impact';
import { UserRole } from '../../../../types/enum';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import {
  EXIT_FEEDBACK_INITIAL,
  ExitFeedbackFields,
  toExitFeedback,
} from '../../components/ExitFeedbackFields';

/**
 * Fermeture de l'agence, partagée par Sécurité (« Supprimer mon compte ») et Agence : l'impact
 * s'affiche sur place, la fermeture est programmée (délai de grâce du backend) et reste
 * annulable jusqu'à sa date. Réservée à l'owner, comme côté backend ; rien pour le staff.
 */
export const AgencyClosureControl = ({ label }: { label: string }) => {
  const { user } = useUserContext();
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === UserRole.OWNER;
  const agencyId = user?.agencyId ?? '';
  const [open, setOpen] = useState(false);

  // Même clé de cache que la page Agence : la date programmée est partagée
  const { data: agency, refetch: refetchAgency } = AgencyModule.getAgencyInfo({
    params: { agencyId },
    queryOptions: { enabled: !!agencyId && isOwner },
  });
  const { data: impact, isLoading: impactLoading } = AgencyModule.getCloseImpactQueries({
    params: { agencyId },
    queryOptions: { enabled: open && !!agencyId && isOwner },
  });

  const close = () => {
    setOpen(false);
  };
  const { mutateAsync: scheduleClose, isPending: scheduling } = AgencyModule.closeAgencyMutation({
    mutationOptions: {
      onSuccess: async () => {
        close();
        await refetchAgency();
      },
    },
  });
  const { mutateAsync: cancelClose, isPending: cancelling } = AgencyModule.cancelCloseMutation({
    mutationOptions: { onSuccess: async () => await refetchAgency() },
  });

  if (!isOwner) return null;

  if (agency?.closeScheduledAt) {
    const date = new Date(agency.closeScheduledAt).toLocaleDateString('fr-FR');
    return (
      <VStack
        alignItems="flex-start"
        gap={3}
        p={3}
        rounded="lg"
        borderLeftWidth="4px"
        borderColor="orange.500"
        role="status"
      >
        <BaseText fontWeight="semibold">Fermeture de l’agence programmée le {date}</BaseText>
        <BaseText fontSize="sm">
          Rien ne change d’ici là. Passé cette date, l’agence, son équipe et son abonnement seront
          fermés définitivement.
        </BaseText>
        <BaseButton
          variant="outline"
          colorType="primary"
          isLoading={cancelling}
          onClick={() => cancelClose({ params: { agencyId } })}
        >
          Annuler la fermeture
        </BaseButton>
      </VStack>
    );
  }

  return (
    <Box>
      <BaseButton colorType="danger" onClick={() => setOpen(true)}>
        {label}
      </BaseButton>
      {/* Remonté à chaque ouverture : nom et questionnaire repartent de zéro */}
      {open && (
        <Formik
          initialValues={{ confirmName: '', ...EXIT_FEEDBACK_INITIAL }}
          onSubmit={(values) =>
            scheduleClose({ params: { agencyId, feedback: toExitFeedback(values) } })
          }
        >
          {({ values, handleSubmit }) => (
            <ActionImpactDialog
              isOpen
              onChange={(isOpen: boolean) => !isOpen && close()}
              title="Fermer l’agence et supprimer le compte"
              subject={agency?.name}
              summary={impact ? agencyCloseImpact(impact) : undefined}
              isLoadingImpact={impactLoading}
              isSubmitting={scheduling}
              confirmTitle="Programmer la fermeture"
              confirmDisabled={!agency?.name || values.confirmName.trim() !== agency.name}
              onConfirm={() => handleSubmit()}
            >
              <FormTextInput
                name="confirmName"
                label={`Pour confirmer, saisissez le nom de l’agence : ${agency?.name ?? ''}`}
                autoComplete="off"
              />
              <ExitFeedbackFields />
            </ActionImpactDialog>
          )}
        </Formik>
      )}
    </Box>
  );
};
