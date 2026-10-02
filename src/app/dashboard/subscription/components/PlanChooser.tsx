import { Box, Flex, RadioCard, SegmentGroup, Separator, SimpleGrid, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { useMemo } from 'react';
import { BaseFormatNumber, BaseTag, BaseText, Icons, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import {
  formatFeatureLimit,
  isFreePlan,
  planDifferences,
  type PlanDifference,
  type PlanFeatureLimit,
} from '_utils/subscription';
import { getPricing } from '../../../components/pricing/functions/pricing';

type Plan = MODELS.COMMON.ISubscriptionPlan;

/** Fonctionnalités commerciales d'un plan, sous la forme comparée par `planDifferences`. */
export const limitsOf = (plan: Plan | undefined): PlanFeatureLimit[] =>
  (plan?.planFeatures ?? [])
    .filter((pf) => pf.feature?.isCommercial)
    .map((pf) => ({ name: pf.feature!.name, limit: pf.limit ?? null }));

/** Prix du plan sur ce cycle exactement (pas de repli sur le mensuel). */
export const priceOn = (plan: Plan, cycle: ENUM.BillingCycle) => {
  const pricing = getPricing(plan, cycle);
  return pricing?.billingCycle === cycle ? pricing : undefined;
};

/** Pastille d'un changement : gain en vert, perte en orange, avec une icône (pas seulement la couleur). */
export const DifferenceChip = ({ change }: { change: PlanDifference }) => {
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
        maxW="sm"
        alignSelf="center"
        value={billingCycle}
        onValueChange={(e) => e.value && onCycleChange(e.value as ENUM.BillingCycle)}
        aria-label="Cycle de facturation"
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items
          flex="1"
          justifyContent="center"
          _checked={{ bgColor: 'primary.500' }}
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
        <SimpleGrid columns={{ base: 1, md: 2, xl: Math.min(offered.length, 4) }} gap={4}>
          {offered.map((plan) => {
            const pricing = priceOn(plan, billingCycle)!;
            const checked = plan.id === selectedPlanId;
            const isCurrentPlan = plan.id === currentPlanId;
            const free = isFreePlan(plan);
            // Le Gratuit n'a pas de cycle : il est le plan actuel sur les deux
            const isCurrent = isCurrentPlan && (free || billingCycle === currentCycle);
            const limits = limitsOf(plan);
            const changes = isCurrentPlan ? [] : planDifferences(currentLimits, limits);

            return (
              <RadioCard.Item
                key={plan.id}
                value={plan.id}
                // Le plan actuel (même cycle) ne se rechoisit pas : le renouvellement a son bouton
                disabled={isCurrent}
                rounded="7px"
                borderWidth="1px"
                borderColor={isCurrent ? 'border.emphasized' : 'border'}
                bg="bg"
                cursor={isCurrent ? 'not-allowed' : 'pointer'}
                _disabled={{ opacity: 0.7 }}
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
                <RadioCard.ItemControl p={5} height="full">
                  <Stack gap={4} flex="1" minW={0} height="full">
                    <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
                      <Stack gap={1} minW={0}>
                        <Flex alignItems="center" gap={2} wrap="wrap">
                          <RadioCard.ItemText fontWeight="semibold" fontSize="lg">
                            {t(`SUBSCRIPTION.PLANS.${plan.name}`)}
                          </RadioCard.ItemText>
                          {isCurrentPlan && (
                            <BaseTag
                              status={ENUM.COMMON.Status.ACTIVE}
                              label={
                                isCurrent
                                  ? 'Plan actuel'
                                  : `Plan actuel (${currentCycle === 'YEARLY' ? 'annuel' : 'mensuel'})`
                              }
                              colorPalette="tertiary"
                            />
                          )}
                          {plan.popular && !isCurrentPlan && (
                            <BaseTag label="Populaire" colorPalette="primary" size="sm" />
                          )}
                        </Flex>
                        <RadioCard.ItemDescription fontSize="sm" color="fg.muted">
                          {t(`SUBSCRIPTION.PLANS.DESCRIPTIONS.${plan.name}`)}
                        </RadioCard.ItemDescription>
                      </Stack>
                      <SelectionDot checked={checked} />
                    </Flex>

                    <Flex alignItems="baseline" gap={1.5}>
                      <BaseText variant={TextVariant.XL} fontWeight="bold" whiteSpace="nowrap">
                        {free ? (
                          'Gratuit'
                        ) : (
                          <BaseFormatNumber
                            value={pricing.price}
                            currencyCode={pricing.currency as ENUM.COMMON.Currency}
                          />
                        )}
                      </BaseText>
                      <BaseText variant={TextVariant.S} color="fg.muted">
                        {free ? 'sans échéance' : billingCycle === 'YEARLY' ? '/ an' : '/ mois'}
                      </BaseText>
                    </Flex>

                    <Separator />

                    {/* Mobile : limites du plan choisi seulement (cartes courtes) ; écarts toujours visibles */}
                    <Stack
                      as="ul"
                      gap={2}
                      listStyleType="none"
                      aria-label="Inclus"
                      display={{ base: checked ? 'flex' : 'none', lg: 'flex' }}
                    >
                      {limits
                        .map((f) => formatFeatureLimit(f.name, f.limit))
                        .filter(Boolean)
                        .map((label) => (
                          <Flex as="li" key={label} alignItems="flex-start" gap={2}>
                            <Box color="primary.500" mt="2px" aria-hidden>
                              <Icons.Check />
                            </Box>
                            <BaseText variant={TextVariant.S}>{label}</BaseText>
                          </Flex>
                        ))}
                    </Stack>

                    {changes.length > 0 && (
                      <Stack gap={2} mt="auto" pt={2}>
                        <BaseText variant={TextVariant.XS} color="fg.muted">
                          Par rapport à votre plan actuel
                        </BaseText>
                        <Flex as="ul" gap={1.5} wrap="wrap" listStyleType="none">
                          {changes.map((change) => (
                            <DifferenceChip key={change.label} change={change} />
                          ))}
                        </Flex>
                      </Stack>
                    )}
                  </Stack>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            );
          })}
        </SimpleGrid>
      </RadioCard.Root>
    </Stack>
  );
};
