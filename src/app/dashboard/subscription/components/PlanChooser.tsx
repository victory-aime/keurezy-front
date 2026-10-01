import { Box, Flex, RadioCard, SegmentGroup, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { useMemo } from 'react';
import { BaseBadge, BaseFormatNumber, BaseText, Icons, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { planDifferences, type PlanDifference, type PlanFeatureLimit } from '_utils/subscription';
import { getPricing } from '../../../components/pricing/functions/pricing';

type Plan = MODELS.COMMON.ISubscriptionPlan;

/** Fonctionnalités commerciales d'un plan, sous la forme comparée par `planDifferences`. */
const limitsOf = (plan: Plan | undefined): PlanFeatureLimit[] =>
  (plan?.planFeatures ?? [])
    .filter((pf) => pf.feature?.isCommercial)
    .map((pf) => ({ name: pf.feature!.name, limit: pf.limit ?? null }));

/** Prix du plan sur ce cycle exactement (pas de repli sur le mensuel). */
const priceOn = (plan: Plan, cycle: ENUM.BillingCycle) => {
  const pricing = getPricing(plan, cycle);
  return pricing?.billingCycle === cycle ? pricing : undefined;
};

/** Pastille d'un changement : gain en vert, perte en orange, avec une icône (pas seulement la couleur). */
const DifferenceChip = ({ change }: { change: PlanDifference }) => {
  const gain = change.tone === 'gain';
  return (
    <Flex
      as="li"
      alignItems="center"
      gap={1}
      px={2}
      py={0.5}
      rounded="full"
      fontSize="xs"
      bg={gain ? 'green.subtle' : 'orange.subtle'}
      color={gain ? 'green.fg' : 'orange.fg'}
    >
      <Box as="span" aria-hidden display="inline-flex" fontSize="0.85em">
        {gain ? <Icons.Check /> : <Icons.Minus />}
      </Box>
      {change.label}
    </Flex>
  );
};

/** Indicateur de sélection (rond plein quand coché), aux couleurs de l'agence. */
const SelectionDot = ({ checked }: { checked: boolean }) => (
  <Box
    aria-hidden
    flexShrink={0}
    mt="3px"
    boxSize="18px"
    rounded="full"
    borderWidth="2px"
    borderColor={checked ? 'primary.500' : 'border.emphasized'}
    display="grid"
    placeItems="center"
    transition="border-color 200ms ease"
  >
    <Box
      boxSize="8px"
      rounded="full"
      bg="primary.500"
      transform={checked ? 'scale(1)' : 'scale(0)'}
      transition="transform 200ms ease"
    />
  </Box>
);

interface PlanChooserProps {
  plans: Plan[];
  currentPlanId: string;
  currentCycle: ENUM.BillingCycle | null;
  billingCycle: ENUM.BillingCycle;
  onCycleChange: (cycle: ENUM.BillingCycle) => void;
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
}

/**
 * Étape « Choisir » : bascule mensuel / annuel, puis une carte par plan en vente, du moins cher
 * au plus cher. Chaque carte montre son prix et ce qui change par rapport au plan actuel ; le
 * montant réellement dû vient du devis à l'étape suivante. Groupe radio natif (flèches, Tab).
 */
export const PlanChooser = ({
  plans,
  currentPlanId,
  currentCycle,
  billingCycle,
  onCycleChange,
  selectedPlanId,
  onSelect,
}: PlanChooserProps) => {
  const currentLimits = limitsOf(plans.find((p) => p.id === currentPlanId));

  const offered = useMemo(
    () =>
      plans
        .filter((plan) => priceOn(plan, billingCycle))
        .sort((a, b) => priceOn(a, billingCycle)!.price - priceOn(b, billingCycle)!.price),
    [plans, billingCycle],
  );

  // Meilleure remise annuelle annoncée par le catalogue (aucun calcul de prix ici)
  const yearlyDiscount = plans.reduce<number | null>((best, plan) => {
    const discount = priceOn(plan, 'YEARLY')?.discountPercentage ?? null;
    return discount && (!best || discount > best) ? discount : best;
  }, null);

  return (
    <Stack gap={5}>
      <SegmentGroup.Root
        size="sm"
        width="full"
        value={billingCycle}
        onValueChange={(e) => e.value && onCycleChange(e.value as ENUM.BillingCycle)}
        aria-label="Cycle de facturation"
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items
          flex="1"
          justifyContent="center"
          items={[
            { value: 'MONTHLY', label: 'Mensuel' },
            {
              value: 'YEARLY',
              label: (
                <Flex alignItems="center" gap={1.5}>
                  Annuel
                  {yearlyDiscount ? (
                    <Box as="span" fontSize="xs" fontWeight="semibold" color="green.fg">
                      −{yearlyDiscount} %
                    </Box>
                  ) : null}
                </Flex>
              ),
            },
          ]}
        />
      </SegmentGroup.Root>

      <RadioCard.Root
        value={selectedPlanId}
        onValueChange={(e) => e.value && onSelect(e.value)}
        aria-label="Plans disponibles"
      >
        <Stack gap={3}>
          {offered.map((plan) => {
            const pricing = priceOn(plan, billingCycle)!;
            const checked = plan.id === selectedPlanId;
            const isCurrentPlan = plan.id === currentPlanId;
            const isCurrent = isCurrentPlan && billingCycle === currentCycle;
            const changes = isCurrentPlan ? [] : planDifferences(currentLimits, limitsOf(plan));

            return (
              <RadioCard.Item
                key={plan.id}
                value={plan.id}
                rounded="7px"
                borderWidth="1px"
                borderColor="border"
                bg="bg"
                cursor="pointer"
                transition="border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease"
                _hover={{ borderColor: checked ? 'primary.500' : 'border.emphasized' }}
                _checked={{
                  borderColor: 'primary.500',
                  bg: 'primary.500/5',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
                _focusVisible={{
                  outline: '2px solid',
                  outlineColor: 'primary.500',
                  outlineOffset: '2px',
                }}
              >
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl p={4} gap={3} alignItems="flex-start">
                  <SelectionDot checked={checked} />

                  <Stack gap={3} flex="1" minW={0}>
                    <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
                      <Stack gap={1} minW={0}>
                        <Flex alignItems="center" gap={2} wrap="wrap">
                          <RadioCard.ItemText fontWeight="semibold" fontSize="md">
                            {t(`SUBSCRIPTION.PLANS.${plan.name}`)}
                          </RadioCard.ItemText>
                          {isCurrent && (
                            <BaseBadge
                              status={ENUM.COMMON.Status.ACTIVE}
                              label="Plan actuel"
                              variant="subtle"
                              size="sm"
                            />
                          )}
                          {plan.popular && !isCurrent && (
                            <BaseBadge label="Populaire" variant="subtle" size="sm" />
                          )}
                        </Flex>
                        <RadioCard.ItemDescription fontSize="sm" color="fg.muted">
                          {t(`SUBSCRIPTION.PLANS.DESCRIPTIONS.${plan.name}`)}
                        </RadioCard.ItemDescription>
                      </Stack>

                      <Stack gap={0} alignItems="flex-end" flexShrink={0} textAlign="right">
                        <BaseText variant={TextVariant.L} fontWeight="bold" whiteSpace="nowrap">
                          <BaseFormatNumber
                            value={pricing.price}
                            currencyCode={pricing.currency as ENUM.COMMON.Currency}
                          />
                        </BaseText>
                        <BaseText variant={TextVariant.XS} color="fg.muted">
                          {billingCycle === 'YEARLY' ? 'par an' : 'par mois'}
                        </BaseText>
                      </Stack>
                    </Flex>

                    {changes.length > 0 ? (
                      <Flex
                        as="ul"
                        gap={1.5}
                        wrap="wrap"
                        listStyleType="none"
                        aria-label="Par rapport à votre plan actuel"
                      >
                        {changes.map((change) => (
                          <DifferenceChip key={change.label} change={change} />
                        ))}
                      </Flex>
                    ) : isCurrentPlan && !isCurrent ? (
                      <BaseText variant={TextVariant.XS} color="fg.muted">
                        Votre plan actuel, facturé{' '}
                        {billingCycle === 'YEARLY' ? 'à l’année' : 'au mois'}
                      </BaseText>
                    ) : null}
                  </Stack>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            );
          })}
        </Stack>
      </RadioCard.Root>
    </Stack>
  );
};
