'use client';

import { BaseText, BaseToast, TextVariant } from '_components/custom';
import { Container, SimpleGrid, VStack } from '@chakra-ui/react';
import { MotionBox } from '_constants/motion';
import { CommonModule } from '_store/state-management';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { ENUM, MODELS } from '_types/*';
import { BillingCycleToggle } from './pricing/BillingCycleToggle';
import { PlanSelectorMode } from './pricing/PlanSelectMode';
import { PlanCard } from './pricing/PlanCard';
import { APP_ROUTES } from '_config/routes';
import { getBestYearlySavings, getFilteredPlans } from '_component/pricing/functions/pricing';
import { t } from 'i18next';

export const PricingSection = () => {
  const navigate = useRouter();
  const [mode, setMode] = useState<ENUM.PricingType>('SUBSCRIPTION');
  const [billingCycle, setBillingCycle] = useState<ENUM.BillingCycle>('MONTHLY');

  const { data: allPacks } = CommonModule.getAllPacksQueries({});

  const filteredPlans = getFilteredPlans(allPacks, mode);

  const handleSelect = ({
    planId,
    billingCycle: cycle,
  }: {
    planId: string;
    billingCycle?: ENUM.BillingCycle;
  }) => {
    const plan = allPacks?.find((p: MODELS.COMMON.ISubscriptionPlan) => p.id === planId);
    if (!plan) return;
    const safeCycle: ENUM.BillingCycle | undefined =
      plan.pricingType === 'SUBSCRIPTION' ? (cycle ?? 'MONTHLY') : undefined;
    BaseToast({
      title: `Plan ${t(`SUBSCRIPTION.PLANS.${plan.name}`)} sélectionné`,
      description:
        plan.pricingType === 'SUBSCRIPTION'
          ? `Facturation ${safeCycle === 'YEARLY' ? 'annuelle' : 'mensuelle'}`
          : `Commission de ${plan.commissionRate}% par loyer`,
    });
    navigate.push(`${APP_ROUTES.AUTH.ONBOARD}?planId=${planId}&billingCycle=${safeCycle}`);
  };

  return (
    <Container mx="auto" px={{ base: 6, sm: 8 }}>
      <VStack width={'full'} gap={5}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          maxW={'2xl'}
          mx={'auto'}
          textAlign={'center'}
        >
          <BaseText color={'primary.500'} textTransform={'uppercase'} fontWeight={'semibold'}>
            Tarifs
          </BaseText>

          <BaseText fontWeight={'bold'} variant={TextVariant.H2} lineHeight={1.2}>
            Modèle de tarification
          </BaseText>
          <BaseText variant={TextVariant.L} mb={2} mt={1} color={'gray.400'}>
            Souscrivez à un abonnement. Vous restez libre.
          </BaseText>
        </MotionBox>

        <VStack textAlign={'center'}>
          {mode === 'SUBSCRIPTION' && (
            <BillingCycleToggle
              value={billingCycle}
              onChange={setBillingCycle}
              yearlySavings={getBestYearlySavings(mode, filteredPlans)}
            />
          )}
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={6} mt={'45px'} mx={'auto'} maxW={'5xl'}>
          {filteredPlans?.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};
