'use client';
import { Formik } from 'formik';

import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import {
  BaseButton,
  BaseModal,
  BaseText,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { subscriptionCancelImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import { isFreePlan } from '_utils/subscription';
import {
  EXIT_FEEDBACK_INITIAL,
  ExitFeedbackFields,
  toExitFeedback,
} from '../../components/ExitFeedbackFields';

type Subscription = NonNullable<MODELS.IAgencySubscriptionOverview['subscription']>;

interface CancelSubscriptionProps {
  agencyId: string;
  subscription: Subscription;
  /** Recharge l'abonnement après résiliation ou réactivation */
  onChanged: () => Promise<unknown> | void;
}

/**
 * Résiliation et réactivation, sous le plan actuel. La résiliation (bouton rouge en contour)
 * est précédée de son impact ; une fois programmée, « Réactiver » devient l'action
 * principale. Un abonnement expiré se réactive par paiement (module checkout) : rien ici.
 */
export const CancelSubscription = ({
  agencyId,
  subscription,
  onChanged,
}: CancelSubscriptionProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'impact' | 'feedback'>('impact');
  const closeDialog = () => {
    setOpen(false);
    setStep('impact');
  };

  const { data: impact, isLoading: impactLoading } =
    AgencyModule.getSubscriptionCancelImpactQueries({
      params: { agencyId },
      queryOptions: { enabled: open && !!agencyId },
    });

  const { mutateAsync: cancel, isPending: cancelling } = AgencyModule.cancelSubscriptionMutation({
    mutationOptions: {
      onSuccess: async () => {
        closeDialog();
        await onChanged();
      },
    },
  });
  const { mutateAsync: resume, isPending: resuming } = AgencyModule.resumeSubscriptionMutation({
    mutationOptions: { onSuccess: async () => await onChanged() },
  });

  // Fermeture (croix, Échap) : on repart de l'étape 1
  const onDialogChange = ((isOpen: boolean) => {
    if (!isOpen) closeDialog();
  }) as ModalOpenProps['onChange'];

  const confirmCancel = (answers: MODELS.IExitFeedback | undefined) =>
    cancel({ params: { agencyId, feedback: answers } });

  // Le Gratuit n'a pas d'échéance : rien à résilier
  if (subscription.status !== 'ACTIVE' || isFreePlan(subscription.plan)) return null;

  if (subscription.cancelAtPeriodEnd) {
    return (
      <Flex
        mt={4}
        gap={3}
        alignItems={{ base: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        direction={{ base: 'column', sm: 'row' }}
      >
        <BaseText variant={TextVariant.S} color="fg.muted">
          Vous avez changé d’avis ? La réactivation est immédiate et sans frais.
        </BaseText>
        <BaseButton
          colorType="primary"
          isLoading={resuming}
          disabled={resuming}
          onClick={() => resume({ params: { agencyId } })}
        >
          Réactiver mon abonnement
        </BaseButton>
      </Flex>
    );
  }

  return (
    <>
      <Flex mt={4} justifyContent="flex-end">
        <BaseButton variant="outline" colorType="danger" size="sm" onClick={() => setOpen(true)}>
          Résilier mon abonnement
        </BaseButton>
      </Flex>
      {/* Étape 1 : ce que la résiliation entraîne */}
      <ActionImpactDialog
        isOpen={open && step === 'impact'}
        onChange={(isOpen: boolean) => !isOpen && closeDialog()}
        title="Résilier votre abonnement"
        subject="Étape 1 sur 2 · L’abonnement reste actif jusqu’à la fin de la période en cours."
        summary={impact ? subscriptionCancelImpact(impact) : undefined}
        isLoadingImpact={impactLoading}
        confirmTitle="Continuer"
        confirmColor="primary"
        onConfirm={() => setStep('feedback')}
      />
      {/* Étape 2 : questionnaire facultatif, puis résiliation */}
      {open && step === 'feedback' && (
        <Formik
          initialValues={EXIT_FEEDBACK_INITIAL}
          onSubmit={(values) => confirmCancel(toExitFeedback(values))}
        >
          {({ values, handleSubmit }) => (
            <BaseModal
              isOpen
              onChange={onDialogChange}
              title="Avant de partir"
              description="Étape 2 sur 2 · Facultatif : vos réponses nous aident à nous améliorer."
              size="md"
              icon={<Icons.Chat />}
              buttonCancelTitle=""
              buttonRejectTitle="Passer et résilier"
              colorRejectButton="neutral"
              onReject={() => confirmCancel(undefined)}
              buttonSaveTitle="Envoyer et résilier"
              colorSaveButton="danger"
              saveDisabled={!toExitFeedback(values)}
              onClick={() => handleSubmit()}
              isLoading={cancelling}
            >
              <ExitFeedbackFields />
            </BaseModal>
          )}
        </Formik>
      )}
    </>
  );
};
