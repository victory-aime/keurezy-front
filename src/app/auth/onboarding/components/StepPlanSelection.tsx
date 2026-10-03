import { Box, Flex, Stack, VStack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import {
  BaseFormatNumber,
  BaseText,
  CustomSkeletonLoader,
  Icons,
  TextVariant,
} from '_components/custom';
import { CommonModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { isFreePlan } from '_utils/subscription';
import { PlanChooser, priceOn } from '../../../dashboard/subscription/components/PlanChooser';
import {
  PromoCodeField,
  promoErrorMessage,
} from '../../../dashboard/subscription/components/PromoCodeField';

type Plan = MODELS.COMMON.ISubscriptionPlan;

interface PlanValues {
  plan: { planId: string; paymentMode?: ENUM.BillingCycle };
  promoCode?: string;
  promoFree?: boolean;
}

const xof = (value: number) => (
  <BaseFormatNumber value={value} currencyCode={'XOF' as ENUM.COMMON.Currency} />
);

/**
 * Récapitulatif placé au-dessus des cartes (donc visible tout de suite) : plan choisi, prix, et
 * code promo vérifié par le backend. Le code accepté est gardé dans le formulaire et revérifié à
 * la création de l'agence.
 */
const PlanSummaryBar = ({ plan, cycle }: { plan: Plan | undefined; cycle: ENUM.BillingCycle }) => {
  const { setFieldValue } = useFormikContext<PlanValues>();
  const [applied, setApplied] = useState<{ code: string; discount: number; amount: number } | null>(
    null,
  );
  const { mutateAsync: check } = CommonModule.onboardingPromoMutation({});
  const pricing = plan ? priceOn(plan, cycle) : undefined;
  const free = isFreePlan(plan);

  // Autre plan ou autre cycle : le code est à revérifier
  useEffect(() => {
    setApplied(null);
    setFieldValue('promoCode', '');
    setFieldValue('promoFree', false);
  }, [plan?.id, cycle]);

  const clear = () => {
    setApplied(null);
    setFieldValue('promoCode', '');
    setFieldValue('promoFree', false);
  };

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
            ) : (
              pricing && (
                <>
                  {applied && (
                    <BaseText
                      variant={TextVariant.S}
                      color="fg.muted"
                      textDecoration="line-through"
                    >
                      {xof(pricing.price)}
                    </BaseText>
                  )}
                  <BaseText
                    key={applied?.amount ?? pricing.price}
                    fontWeight="bold"
                    color={applied ? 'success.fg' : undefined}
                    animationName="fade-in"
                    animationDuration="moderate"
                    _motionReduce={{ animation: 'none' }}
                  >
                    {xof(applied?.amount ?? pricing.price)}
                  </BaseText>
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

      {plan && !free && (
        <Box flexShrink={0} width={{ base: 'full', md: 'auto' }} minW={{ md: '320px' }}>
          <PromoCodeField
            compact
            applied={applied}
            discountLabel={applied ? 'appliqué' : undefined}
            onApply={async (promoCode) => {
              try {
                const result = await check({
                  payload: { planId: plan.id, billingCycle: cycle, promoCode },
                });
                setApplied({ ...result.promo, amount: result.amount });
                setFieldValue('promoCode', result.promo.code);
                setFieldValue('promoFree', result.amount === 0);
                return null;
              } catch (error) {
                return promoErrorMessage(error);
              }
            }}
            onRemove={clear}
          />
        </Box>
      )}
    </Flex>
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
          beforeCards={<PlanSummaryBar plan={selected} cycle={cycle} />}
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
