'use client';

import { Flex, HStack, Stack } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  BaseBadge,
  BaseButton,
  BaseIconButton,
  BaseText,
  FormTextInput,
  Icons,
  TextVariant,
} from '_components/custom';

type ApiError = AxiosError<{ errorCode?: string; message?: string }>;

/** Message du backend (refus explicite du code), sinon générique. */
export const promoErrorMessage = (error: unknown) =>
  (error as ApiError)?.response?.data?.message ?? 'Ce code promo ne peut pas être appliqué.';

const SCHEMA = Yup.object({
  code: Yup.string()
    .trim()
    .required('Saisissez un code')
    .matches(/^[A-Za-z0-9 -]{3,40}$/, 'Lettres, chiffres ou tirets'),
});

/**
 * Saisie d'un code promo : « Appliquer » le vérifie côté serveur (le montant affiché et facturé
 * vient toujours du backend). Code accepté : pastille avec la remise, et « Retirer ».
 */
export const PromoCodeField = ({
  applied,
  onApply,
  onRemove,
  discountLabel,
  compact = false,
}: {
  applied?: { code: string } | null;
  /** Renvoie un message d'erreur, ou `null` si le code est accepté */
  onApply: (code: string) => Promise<string | null>;
  onRemove: () => void;
  /** Remise formatée (« - 5 000 F CFA ») */
  discountLabel?: string;
  /** Sur une ligne, sans libellé visible (barre de récapitulatif) */
  compact?: boolean;
}) => {
  if (applied) {
    return (
      <Flex
        alignItems="center"
        gap={2}
        mt={compact ? 0 : 2}
        animationName="fade-in"
        animationDuration="moderate"
        _motionReduce={{ animation: 'none' }}
      >
        <BaseBadge variant="subtle" color="success" size="sm" p={1.5}>
          <Icons.Check aria-hidden />
          <BaseText variant={TextVariant.XS} fontWeight="semibold">
            {applied.code}
          </BaseText>
        </BaseBadge>
        {discountLabel && (
          <BaseText variant={TextVariant.S} color="success.fg">
            {discountLabel}
          </BaseText>
        )}
        <BaseIconButton label="Retirer le code promo" variant="ghost" size="xs" onClick={onRemove}>
          <Icons.Close aria-hidden />
        </BaseIconButton>
      </Flex>
    );
  }

  return (
    <Formik
      initialValues={{ code: '' }}
      validationSchema={SCHEMA}
      onSubmit={async ({ code }, { setFieldError }) => {
        const error = await onApply(code.trim());
        if (error) setFieldError('code', error);
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Stack gap={1} mt={compact ? 0 : 2} maxW="sm" width="full">
          <HStack alignItems="flex-start" gap={2}>
            <FormTextInput
              name="code"
              label={compact ? undefined : 'Code promo'}
              aria-label="Code promo"
              placeholder={compact ? 'Code promo' : 'Ex. BIENVENUE'}
              leftAccessory={compact ? <Icons.Ticket /> : undefined}
            />
            <BaseButton
              mt={compact ? 0 : '26px'}
              variant="outline"
              colorType="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
            >
              Appliquer
            </BaseButton>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};
