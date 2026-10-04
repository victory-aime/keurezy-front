import { Box, Flex, VStack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { BaseText, CustomSkeletonLoader, Icons } from '_components/custom';
import { CommonModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { PlanChooser, priceOn } from '../../../dashboard/subscription/components/PlanChooser';
import { promoErrorMessage } from '../../../dashboard/subscription/components/PromoCodeField';
import {
  type AppliedPromo,
  PlanSummaryBar,
} from '../../../dashboard/subscription/components/PlanSummaryBar';

type Plan = MODELS.COMMON.ISubscriptionPlan;

interface PlanValues {
  plan: { planId: string; paymentMode?: ENUM.BillingCycle };
  promoCode?: string;
  promoFree?: boolean;
}

/**
 * Barre récapitulative de l'inscription : composant partagé avec le changement de plan, avec ici
 * la vérification du code par la route d'onboarding. Le code accepté est gardé dans le
 * formulaire et revérifié à la création de l'agence.
 */
const OnboardingSummaryBar = ({
  plan,
  cycle,
}: {
  plan: Plan | undefined;
  cycle: ENUM.BillingCycle;
}) => {
  const { setFieldValue } = useFormikContext<PlanValues>();
  const [applied, setApplied] = useState<AppliedPromo | null>(null);
  const { mutateAsync: check } = CommonModule.onboardingPromoMutation({});

  const clear = () => {
    setApplied(null);
    setFieldValue('promoCode', '');
    setFieldValue('promoFree', false);
  };

  // Autre plan ou autre cycle : le code est à revérifier
  useEffect(clear, [plan?.id, cycle]);

  return (
    <PlanSummaryBar
      plan={plan}
      cycle={cycle}
      applied={applied}
      onRemovePromo={clear}
      onApplyPromo={async (promoCode) => {
        if (!plan) return 'Choisissez d’abord un plan.';
        try {
          const result = await check({
            payload: { planId: plan.id, billingCycle: cycle, promoCode },
          });
          setApplied({
            code: result.promo.code,
            amount: result.amount,
            amountBeforePromo: priceOn(plan, cycle)?.price ?? result.amount,
          });
          setFieldValue('promoCode', result.promo.code);
          setFieldValue('promoFree', result.amount === 0);
          return null;
        } catch (error) {
          return promoErrorMessage(error);
        }
      }}
    />
  );
};

/**
 * Étape 4 « Plan » : le même sélecteur que le changement de plan du tableau de bord (bascule
 * mensuel / annuel, une carte par plan), sans plan actuel, avec le récapitulatif et le code promo
 * au-dessus des cartes. Un plan peut venir de l'URL (lien « Commencer » d'une offre).
 */
export const StepPlanSelection = ({
  value,
  allPacks,
}: {
  value: { selectedPlanId: string | null; billingCycle?: ENUM.BillingCycle };
  allPacks: Plan[];
}) => {
  const { values, setFieldValue, errors, submitCount } = useFormikContext<PlanValues>();
  const [urlResolved, setUrlResolved] = useState(false);
  const cycle = values.plan?.paymentMode ?? 'MONTHLY';
  const selected = allPacks.find((p) => p.id === values.plan?.planId);

  // Plan passé dans l'URL : présélectionné une fois
  useEffect(() => {
    if (!allPacks.length || urlResolved) return;
    const fromUrl = allPacks.find((p) => p.id === value?.selectedPlanId);
    if (fromUrl) {
      setFieldValue('plan.planId', fromUrl.id);
      setFieldValue('plan.paymentMode', value.billingCycle ?? 'MONTHLY');
    }
    setUrlResolved(true);
  }, [allPacks, value, urlResolved]);

  // Un plan absent du nouveau cycle est désélectionné
  const changeCycle = (next: ENUM.BillingCycle) => {
    if (selected && !priceOn(selected, next)) setFieldValue('plan.planId', '');
    setFieldValue('plan.paymentMode', next);
  };

  return (
    <Box maxW="7xl" mx="auto" width="full">
      <VStack gap={2} mb={6} textAlign="center">
        <BaseText as="h2" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="bold">
          Choisissez votre plan
        </BaseText>
        <BaseText color="fg.muted" maxW="2xl">
          Commencez gratuitement ou choisissez l’offre adaptée à votre activité. Vous pourrez
          changer de plan à tout moment depuis votre tableau de bord.
        </BaseText>
      </VStack>

      {!allPacks.length ? (
        <CustomSkeletonLoader type="PRODUCT_LIST_CARD" tableRows={1} />
      ) : (
        <PlanChooser
          plans={allPacks}
          billingCycle={cycle}
          onCycleChange={changeCycle}
          selectedPlanId={values.plan?.planId || null}
          onSelect={(planId) => setFieldValue('plan.planId', planId)}
          beforeCards={<OnboardingSummaryBar plan={selected} cycle={cycle} />}
        />
      )}

      {submitCount > 0 && errors.plan?.planId && !values.plan?.planId && (
        <Flex gap={1} mt={3} justifyContent="center" color="danger.fg" role="alert">
          <Icons.InfoIcon aria-hidden />
          <BaseText color="inherit">{errors.plan.planId}</BaseText>
        </Flex>
      )}
    </Box>
  );
};
