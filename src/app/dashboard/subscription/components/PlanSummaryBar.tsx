'use client';

import { Box, Flex, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { BaseFormatNumber, BaseText, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { isFreePlan } from '_utils/subscription';
import { priceOn } from './PlanChooser';
import { PromoCodeField } from './PromoCodeField';

/** Code accepté par le serveur, avec le montant à payer avant et après la remise. */
export interface AppliedPromo {
  code: string;
  amount: number;
  amountBeforePromo: number;
}

const xof = (value: number) => (
  <BaseFormatNumber value={value} currencyCode={'XOF' as ENUM.COMMON.Currency} />
);

/**
 * Récapitulatif placé au-dessus des cartes de plans (inscription et changement de plan) : plan
 * choisi, prix, et code promo vérifié par le serveur. Code accepté : montant d'origine barré et
 * montant à payer en vert (ce dernier vient toujours du backend).
 */
export const PlanSummaryBar = ({
  plan,
  cycle,
  applied,
  onApplyPromo,
  onRemovePromo,
}: {
  plan: MODELS.COMMON.ISubscriptionPlan | undefined;
  cycle: ENUM.BillingCycle;
  applied: AppliedPromo | null;
  /** Message d'erreur, ou `null` si le code est accepté. Absent : pas de champ promo */
  onApplyPromo?: (code: string) => Promise<string | null>;
  onRemovePromo: () => void;
}) => {
  const pricing = plan ? priceOn(plan, cycle) : undefined;
  const free = isFreePlan(plan);

  return (
    <Flex
      position="sticky"
      top="72px"
      zIndex={2}
      gap={4}
      p={4}
      rounded="7px"
      borderWidth="1px"
      borderColor={plan ? 'primary.solid' : 'border'}
      bg="bg"
      boxShadow={plan ? 'md' : 'none'}
      alignItems={{ base: 'stretch', md: 'center' }}
      justifyContent="space-between"
      flexDirection={{ base: 'column', md: 'row' }}
      transition="border-color 0.2s, box-shadow 0.2s"
      _motionReduce={{ transition: 'none' }}
    >
      <Stack gap={0} minW={0}>
        <BaseText variant={TextVariant.XS} color="fg.muted">
          {plan ? 'Plan choisi' : 'Aucun plan choisi'}
        </BaseText>
        {plan ? (
          <Flex alignItems="baseline" gap={2} wrap="wrap">
            <BaseText fontWeight="semibold">{t(`SUBSCRIPTION.PLANS.${plan.name}`)}</BaseText>
            <BaseText variant={TextVariant.S} color="fg.muted">
              ·
            </BaseText>
            {free ? (
              <BaseText fontWeight="semibold">Gratuit, sans paiement</BaseText>
            ) : applied ? (
              <>
                <BaseText variant={TextVariant.S} color="fg.muted" textDecoration="line-through">
                  {xof(applied.amountBeforePromo)}
                </BaseText>
                <BaseText
                  key={applied.amount}
                  fontWeight="bold"
                  color="success.fg"
                  animationName="fade-in"
                  animationDuration="moderate"
                  _motionReduce={{ animation: 'none' }}
                >
                  {xof(applied.amount)}
                </BaseText>
                <BaseText variant={TextVariant.S} color="fg.muted">
                  à payer
                </BaseText>
              </>
            ) : (
              pricing && (
                <>
                  <BaseText fontWeight="bold">{xof(pricing.price)}</BaseText>
                  <BaseText variant={TextVariant.S} color="fg.muted">
                    {cycle === 'YEARLY' ? '/ an' : '/ mois'}
                  </BaseText>
                </>
              )
            )}
          </Flex>
        ) : (
          <BaseText variant={TextVariant.S}>Sélectionnez une offre ci-dessous.</BaseText>
        )}
      </Stack>

      {plan && !free && onApplyPromo && (
        <Box flexShrink={0} width={{ base: 'full', md: 'auto' }} minW={{ md: '320px' }}>
          <PromoCodeField
            compact
            applied={applied}
            discountLabel={applied ? 'appliqué' : undefined}
            onApply={onApplyPromo}
            onRemove={onRemovePromo}
          />
        </Box>
      )}
    </Flex>
  );
};
