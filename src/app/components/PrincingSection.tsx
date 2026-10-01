'use client';

import { BaseText, BaseToast, TextVariant } from '_components/custom';
import { Container, SimpleGrid, VStack } from '@chakra-ui/react';
import { MotionBox } from '_constants/motion';
import { CommonModule } from '_store/state-management';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ENUM, MODELS } from '_types/*';
import { BillingCycleToggle } from './pricing/BillingCycleToggle';
import { PlanCard } from './pricing/PlanCard';
import { APP_ROUTES } from '_config/routes';
import { getBestYearlySavings, getFilteredPlans } from '_component/pricing/functions/pricing';
import { t } from 'i18next';
import { isFreePlan } from '_utils/subscription';

export const PricingSection = () => {
  const navigate = useRouter();
  const [billingCycle, setBillingCycle] = useState<ENUM.BillingCycle>('MONTHLY');

  const { data: allPacks } = CommonModule.getAllPacksQueries({});

  const filteredPlans = getFilteredPlans(allPacks);

  const handleSelect = ({
    planId,
    billingCycle: cycle,
  }: {
    planId: string;
    billingCycle?: ENUM.BillingCycle;
  }) => {
    const plan = allPacks?.find((p: MODELS.COMMON.ISubscriptionPlan) => p.id === planId);
    if (!plan) return;
    const safeCycle: ENUM.BillingCycle = cycle ?? 'MONTHLY';
    BaseToast({
      title: `Plan ${t(`SUBSCRIPTION.PLANS.${plan.name}`)} sélectionné`,
      description: isFreePlan(plan)
        ? 'Sans paiement ni engagement'
        : `Facturation ${safeCycle === 'YEARLY' ? 'annuelle' : 'mensuelle'}`,
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
          <BillingCycleToggle
            value={billingCycle}
            onChange={setBillingCycle}
            yearlySavings={getBestYearlySavings(filteredPlans)}
          />
        </VStack>

        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          gap={6}
          mt={'45px'}
          mx={'auto'}
          maxW={'6xl'}
        >
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
