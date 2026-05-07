import {
  Badge,
  SimpleGrid,
  Box,
  Flex,
  For,
  List,
  Span,
  VStack,
  HStack,
  FieldRoot,
  FieldErrorIcon,
} from '@chakra-ui/react';
import { BillingCycleToggle } from '_component/pricing/BillingCycleToggle';
import { PlanSelectorMode } from '_component/pricing/PlanSelectMode';
import { ENUM, MODELS } from '_types/*';
import { useState, useEffect } from 'react';
import { PricingType, BillingCycle } from '../../../../types/enum';
import {
  BaseButton,
  BaseFormatNumber,
  BaseText,
  CustomSkeletonLoader,
  Icons,
  TextVariant,
  TextWeight,
} from '_components/custom';
import { BaseCheckBoxCard } from '_components/custom/checkbox-card/BaseCheckBoxCard';
import {
  formatLimit,
  getBestYearlySavings,
  getFilteredPlans,
  getPricing,
} from '_component/pricing/functions/pricing';
import { MotionBox } from '_constants/motion';
import { useFormikContext } from 'formik';
import axios from 'axios';
import {t} from "i18next";

type PlanSelectionState = {
  selectedPlanId: string | null;
  billingCycle?: ENUM.BillingCycle;
};

interface StepPlanSelectionProps {
  value: PlanSelectionState;
  allPacks: MODELS.COMMON.ISubscriptionPlan[];
}

export const StepPlanSelection = ({ value, allPacks }: StepPlanSelectionProps) => {
  const [mode, setMode] = useState<PricingType>('SUBSCRIPTION');
  const [urlPlanResolved, setUrlPlanResolved] = useState(false);

  const { values, setFieldValue, errors } = useFormikContext<{
    plan: {
      planId: string;
      paymentMode?: ENUM.BillingCycle;
    };
  }>();

  // ✅ Resolve plan depuis URL
  useEffect(() => {
    if (!allPacks || urlPlanResolved) return;

    const plan = allPacks.find((p) => p.id === value?.selectedPlanId);

    if (!plan) {
      setUrlPlanResolved(true);
      return;
    }

    setMode(plan.pricingType);

    setFieldValue('plan.planId', plan.id);
    setFieldValue(
      'plan.paymentMode',
      plan.pricingType === 'SUBSCRIPTION' ? (value.billingCycle ?? 'MONTHLY') : undefined,
    );

    setUrlPlanResolved(true);
  }, [allPacks, value, urlPlanResolved]);

  const filteredPlans = getFilteredPlans(allPacks, mode);
  const selectedPlan = allPacks?.find((p) => p.id === values.plan?.planId);
  const billingCycle = values.plan?.paymentMode ?? 'MONTHLY';

  // ✅ Change mode
  const handleModeChange = (nextMode: PricingType) => {
    setMode(nextMode);

    if (selectedPlan?.pricingType !== nextMode) {
      setFieldValue('plan.planId', '');
      setFieldValue('plan.paymentMode', undefined);
    }
  };

  // ✅ Sélection plan
  const handleSelect = ({
    planId,
    billingCycle,
  }: {
    planId: string;
    billingCycle?: BillingCycle;
  }) => {
    const plan = allPacks?.find((p) => p.id === planId);
    if (!plan) return;

    setFieldValue('plan.planId', planId);

    if (plan.pricingType === 'SUBSCRIPTION') {
      setFieldValue('plan.paymentMode', billingCycle ?? 'MONTHLY');
    } else {
      setFieldValue('plan.paymentMode', undefined);
    }
  };

  // ✅ Change billing cycle
  const handleBillingCycleChange = (cycle: BillingCycle) => {
    setFieldValue('plan.paymentMode', cycle);
  };

  return (
    <Box maxW={'7xl'} mx={'auto'} spaceY={8}>
      <VStack>
        <BaseText variant={TextVariant.H3}>Choisissez votre plan</BaseText>

        <BaseText mx={'auto'} maxW={'2xl'} textAlign={'center'}>
          Sélectionnez une offre adaptée à votre activité
        </BaseText>

        <HStack flexDir={'column'} gap={2} mt={2}>
          <PlanSelectorMode value={mode} onChange={handleModeChange} />

          {mode === 'SUBSCRIPTION' && (
            <BillingCycleToggle
              value={billingCycle}
              onChange={handleBillingCycleChange}
              yearlySavings={getBestYearlySavings(mode, filteredPlans)}
            />
          )}
        </HStack>
      </VStack>

      {/* Loading */}
      {!allPacks && (
        <Box width={'full'}>
          {[0, 1, 2].map((i) => (
            <CustomSkeletonLoader key={i} tableRows={1} type="PRODUCT_LIST_CARD" />
          ))}
        </Box>
      )}

      {/* Plans */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={6} mt={'45px'}>
        {filteredPlans.map((plan, index) => {
          const pricing =
            plan.pricingType === 'SUBSCRIPTION' ? getPricing(plan, billingCycle) : null;

          return (
            <BaseCheckBoxCard
              key={plan.id}
              checked={values.plan?.planId === plan.id}
              onCheckedChange={() =>
                handleSelect({
                  planId: plan.id,
                  billingCycle,
                })
              }
              label={plan.name}
            >
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                p={2}
                width={'full'}
              >
                <VStack gap={2}>
                  <BaseText variant={TextVariant.L} weight={TextWeight.SemiBold}>
                    {plan.name}
                  </BaseText>

                  {/* 💰 PRIX */}
                  {plan.pricingType === 'COMMISSION' ? (
                    <Box>
                      <Span fontSize={'xl'} fontWeight={'bold'}>
                        <BaseFormatNumber
                          value={(plan.commissionRate ?? 0) / 100}
                          style="percent"
                        />
                      </Span>
                      <Span fontSize={'sm'} ml={1}>
                        par acquisition
                      </Span>
                    </Box>
                  ) : pricing ? (
                    <Flex alignItems={'baseline'} gap={1}>
                      <Span fontSize={'xl'} fontWeight={'bold'}>
                        <BaseFormatNumber
                          value={pricing.price}
                          currencyCode={pricing.currency as ENUM.COMMON.Currency}
                        />
                      </Span>
                      <Span fontSize={'sm'}>{billingCycle === 'YEARLY' ? '/an' : '/mois'}</Span>

                      {billingCycle === 'YEARLY' && pricing.discountPercentage && (
                        <Badge colorPalette={'teal'}>-{pricing.discountPercentage}%</Badge>
                      )}
                    </Flex>
                  ) : null}
                </VStack>

                {/* Features */}
                <For each={plan.planFeatures}>
                  {(features, i) => (
                    <List.Root key={i} gap="2" variant="plain" align="center" mt={4} spaceY={1}>
                      <List.Item key={features.label} alignItems={'center'} gap={0} fontSize={'sm'}>
                        <List.Indicator asChild color="tertiary.500">
                          <Icons.Check size={20} />
                        </List.Indicator>
                        {formatLimit(features, t)}
                      </List.Item>
                    </List.Root>
                  )}
                </For>
              </MotionBox>
            </BaseCheckBoxCard>
          );
        })}
      </SimpleGrid>

      {errors?.plan?.planId && !values?.plan?.planId && (
        <FieldRoot>
          <Flex gap={1} mt={1} alignItems={'center'} justifyContent={'center'} color={'red.500'}>
            <FieldErrorIcon width={2.5} height={2.5} />
            <BaseText>{errors?.plan?.planId}</BaseText>
          </Flex>
        </FieldRoot>
      )}
    </Box>
  );
};
