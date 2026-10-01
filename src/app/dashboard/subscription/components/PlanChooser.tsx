import { Box, Flex, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { BaseBadge, BaseFormatNumber, BaseText, Icons, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { planDifferences, type PlanFeatureLimit } from '_utils/subscription';
import { BillingCycleToggle } from '../../../components/pricing/BillingCycleToggle';
import { getPricing } from '../../../components/pricing/functions/pricing';

type Plan = MODELS.COMMON.ISubscriptionPlan;

/** Fonctionnalités commerciales d'un plan, sous la forme comparée par `planDifferences`. */
const limitsOf = (plan: Plan | undefined): PlanFeatureLimit[] =>
  (plan?.planFeatures ?? [])
    .filter((pf) => pf.feature?.isCommercial)
    .map((pf) => ({ name: pf.feature!.name, limit: pf.limit ?? null }));

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
 * Étape « Choisir » : plans en vente, cartes légères sans ombre. Le plan actuel est marqué ;
 * chaque carte dit ce qui change par rapport à lui. Prix affichés tels que le catalogue les donne.
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

  return (
    <Stack gap={4}>
      <Box>
        <BillingCycleToggle value={billingCycle} onChange={onCycleChange} />
      </Box>
      <Stack gap={3} role="radiogroup" aria-label="Plans disponibles">
        {plans.map((plan) => {
          const pricing = getPricing(plan, billingCycle);
          if (!pricing || pricing.billingCycle !== billingCycle) return null;
          const selected = plan.id === selectedPlanId;
          const isCurrent = plan.id === currentPlanId && billingCycle === currentCycle;
          const changes = planDifferences(currentLimits, limitsOf(plan));
          return (
            <Box
              key={plan.id}
              as="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(plan.id)}
              textAlign="left"
              width="full"
              p={4}
              rounded="7px"
              borderWidth="1px"
              borderColor={selected ? 'primary.500' : 'border'}
              bg={selected ? 'primary.500/8' : 'transparent'}
              transition="border-color 200ms ease, background-color 200ms ease"
              _hover={{ borderColor: selected ? 'primary.500' : 'border.emphasized' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'primary.500',
                outlineOffset: '2px',
              }}
            >
              <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
                <Stack gap={1}>
                  <Flex alignItems="center" gap={2} wrap="wrap">
                    <BaseText variant={TextVariant.M} fontWeight="semibold">
                      {t(`SUBSCRIPTION.PLANS.${plan.name}`)}
                    </BaseText>
                    {isCurrent && (
                      <BaseBadge
                        status={ENUM.COMMON.Status.ACTIVE}
                        label="Plan actuel"
                        variant="subtle"
                        size="sm"
                      />
                    )}
                  </Flex>
                  <BaseText variant={TextVariant.S} fontWeight="semibold">
                    <BaseFormatNumber
                      value={pricing.price}
                      currencyCode={pricing.currency as ENUM.COMMON.Currency}
                    />{' '}
                    <BaseText
                      as="span"
                      variant={TextVariant.S}
                      color="fg.muted"
                      fontWeight="normal"
                    >
                      {billingCycle === 'YEARLY' ? '/ an' : '/ mois'}
                    </BaseText>
                  </BaseText>
                </Stack>
                {selected && (
                  <Box color="primary.500" aria-hidden>
                    <Icons.Check />
                  </Box>
                )}
              </Flex>
              {changes.length > 0 && plan.id !== currentPlanId && (
                <Stack as="ul" gap={0.5} mt={2} listStyleType="none">
                  {changes.map((change) => (
                    <BaseText as="li" key={change} variant={TextVariant.XS} color="fg.muted">
                      {change}
                    </BaseText>
                  ))}
                </Stack>
              )}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};
