'use client';

import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { BaseButton, BaseText, TextVariant } from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { subscriptionCancelImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import { isFreePlan } from '_utils/subscription';

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

  const { data: impact, isLoading: impactLoading } =
    AgencyModule.getSubscriptionCancelImpactQueries({
      params: { agencyId },
      queryOptions: { enabled: open && !!agencyId },
    });

  const { mutateAsync: cancel, isPending: cancelling } = AgencyModule.cancelSubscriptionMutation({
    mutationOptions: {
      onSuccess: async () => {
        setOpen(false);
        await onChanged();
      },
    },
  });
  const { mutateAsync: resume, isPending: resuming } = AgencyModule.resumeSubscriptionMutation({
    mutationOptions: { onSuccess: async () => await onChanged() },
  });

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
      <ActionImpactDialog
        isOpen={open}
        onChange={setOpen}
        title="Résilier votre abonnement"
        subject="L’abonnement reste actif jusqu’à la fin de la période en cours."
        summary={impact ? subscriptionCancelImpact(impact) : undefined}
        isLoadingImpact={impactLoading}
        isSubmitting={cancelling}
        confirmTitle="Résilier à la fin de la période"
        confirmColor="danger"
        onConfirm={() => cancel({ params: { agencyId } })}
      />
    </>
  );
};
