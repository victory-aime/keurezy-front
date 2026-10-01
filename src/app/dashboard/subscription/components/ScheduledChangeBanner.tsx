'use client';

import { Flex } from '@chakra-ui/react';
import { t } from 'i18next';
import { BaseButton, BaseText, TextVariant } from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { formatLongDate } from '_utils/subscription';

type ScheduledChange = NonNullable<
  NonNullable<MODELS.IAgencySubscriptionOverview['subscription']>['scheduledChange']
>;

interface ScheduledChangeBannerProps {
  agencyId: string;
  change: ScheduledChange;
  /** Rouvre le choix des éléments gardés pour le même plan */
  onEdit: () => void;
  onChanged: () => void;
}

/** Downgrade programmé : date d'effet, puis « Modifier » (le choix) ou « Annuler ». */
export const ScheduledChangeBanner = ({
  agencyId,
  change,
  onEdit,
  onChanged,
}: ScheduledChangeBannerProps) => {
  const { mutate: cancel, isPending } = AgencyModule.cancelScheduledChangeMutation({
    mutationOptions: { onSuccess: () => onChanged() },
  });

  return (
    <Flex
      role="status"
      px={4}
      py={3}
      gap={3}
      rounded="7px"
      borderWidth="1px"
      borderColor="border"
      bg="bg.subtle"
      alignItems={{ base: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      direction={{ base: 'column', sm: 'row' }}
    >
      <BaseText variant={TextVariant.S}>
        Passage au plan <strong>{t(`SUBSCRIPTION.PLANS.${change.plan.name}`)}</strong> le{' '}
        {formatLongDate(change.effectiveAt)}. Rien ne change d’ici là.
      </BaseText>
      <Flex gap={2} flexShrink={0}>
        <BaseButton
          size="sm"
          variant="outline"
          colorType="neutral"
          disabled={isPending}
          onClick={onEdit}
        >
          Modifier
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          colorType="danger"
          isLoading={isPending}
          disabled={isPending}
          onClick={() => cancel({ params: { agencyId } })}
        >
          Annuler
        </BaseButton>
      </Flex>
    </Flex>
  );
};
