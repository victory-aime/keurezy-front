'use client';

import { Box } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { BaseText, TextVariant } from '_components/custom';
import { CommonModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { isFreePlan } from '_utils/subscription';
import {
  PromoCodeField,
  promoErrorMessage,
} from '../../../dashboard/subscription/components/PromoCodeField';

const xof = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} F CFA`;

/**
 * Code promo à l'étape « Plan » (plan payant seulement). Le code accepté est gardé dans le
 * formulaire (`promoCode`) et renvoyé à la création de l'agence, où le backend le revérifie.
 */
export const OnboardingPromo = ({ allPacks }: { allPacks: MODELS.COMMON.ISubscriptionPlan[] }) => {
  const { values, setFieldValue } = useFormikContext<{
    plan: { planId: string; paymentMode?: string };
    promoCode?: string;
  }>();
  const [applied, setApplied] = useState<{ code: string; discount: number; amount: number } | null>(
    null,
  );
  const { mutateAsync: check } = CommonModule.onboardingPromoMutation({});
  const plan = allPacks.find((p) => p.id === values.plan?.planId);
  const cycle = values.plan?.paymentMode ?? 'MONTHLY';

  // Autre plan ou autre cycle : le code est à revérifier
  useEffect(() => {
    setApplied(null);
    setFieldValue('promoCode', '');
    setFieldValue('promoFree', false);
  }, [values.plan?.planId, cycle]);

  if (!plan || isFreePlan(plan)) return null;

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <PromoCodeField
        applied={applied}
        discountLabel={
          applied ? `- ${xof(applied.discount)} · à payer : ${xof(applied.amount)}` : undefined
        }
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
        onRemove={() => {
          setApplied(null);
          setFieldValue('promoCode', '');
          setFieldValue('promoFree', false);
        }}
      />
      {applied?.amount === 0 && (
        <BaseText variant={TextVariant.XS} color="fg.muted" mt={1}>
          Rien à payer : votre agence sera créée sans passer par le paiement.
        </BaseText>
      )}
    </Box>
  );
};
