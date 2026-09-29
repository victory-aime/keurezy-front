'use client';

import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { BaseButton, BaseText, FormCheckbox, FormOtpInput, FormTextInput } from '_components/custom';
import React, { useRef, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { APP_ROUTES } from '_config/routes';
import { useRouter } from 'next/navigation';
import { AuthBoxContainer } from './AuthBoxContainer';
import { useAuth } from '_hooks/useAuth';
import { useTotp } from '_hooks/useTotp';
import { VALIDATION } from '_types/';
import { totpErrorMessage } from '_utils/totp';

type Mode = 'totp' | 'backup';

interface TotpFormValues {
  totpCode: string[];
  backupCode: string;
  trustedDevice: boolean;
}

const EMPTY_CODE = Array(6).fill('');

const backupCodeSchema = Yup.object({
  backupCode: Yup.string().trim().required('Code de secours requis'),
});

/**
 * Deuxième étape de connexion : code de l'application d'authentification, ou code de secours
 * quand le téléphone n'est plus disponible (sans ce recours, un téléphone perdu bloque le compte).
 */
export const TotpVerification = () => {
  const router = useRouter();
  const { logout, isLoading: logoutLoading } = useAuth();
  const { verifyTotp, verifyBackupCode, isLoading } = useTotp();
  const [mode, setMode] = useState<Mode>('totp');
  const otpRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (values: TotpFormValues, helpers: FormikHelpers<TotpFormValues>) => {
    const result =
      mode === 'totp'
        ? await verifyTotp(values.totpCode.join(''), values.trustedDevice)
        : await verifyBackupCode(values.backupCode, values.trustedDevice);

    if (!result || 'status' in result) {
      if (mode === 'totp') {
        // Cases vidées et focus sur la première : l'utilisateur ressaisit sans effacer
        await helpers.setFieldValue('totpCode', EMPTY_CODE, false);
        otpRef.current?.querySelector<HTMLInputElement>('[data-part="input"]')?.focus();
        helpers.setFieldError('totpCode', totpErrorMessage(result?.status));
      } else {
        helpers.setFieldError('backupCode', totpErrorMessage(result?.status));
      }
      return;
    }
    router.replace(APP_ROUTES.REDIRECT);
  };

  return (
    <Formik<TotpFormValues>
      initialValues={{ totpCode: EMPTY_CODE, backupCode: '', trustedDevice: false }}
      onSubmit={handleSubmit}
      validationSchema={
        mode === 'totp' ? VALIDATION.TOTP_VALIDATION.totpValidationSchema : backupCodeSchema
      }
    >
      {({ handleSubmit: submit, resetForm }) => {
        const switchMode = (next: Mode) => {
          resetForm();
          setMode(next);
        };

        return (
          <AuthBoxContainer
            title={'Vérification en deux étapes'}
            description={
              <BaseText>
                {mode === 'totp'
                  ? 'Pour sécuriser votre compte, saisissez le code à 6 chiffres généré par votre application d’authentification.'
                  : 'Saisissez l’un des codes de secours téléchargés lors de l’activation. Chaque code ne sert qu’une fois.'}
              </BaseText>
            }
          >
            <VStack gap={3} width={'full'}>
              {mode === 'totp' ? (
                <>
                  <Box ref={otpRef} width={'full'}>
                    <FormOtpInput
                      name="totpCode"
                      isDisabled={isLoading}
                      onChangeFunction={() => submit()}
                    />
                  </Box>
                  <BaseText color={'gray.400'}>
                    Entrez le code affiché dans votre application d’authentification (Google
                    Authenticator, Microsoft Authenticator…). La vérification démarre dès que les 6
                    chiffres sont saisis.
                  </BaseText>
                </>
              ) : (
                <>
                  <FormTextInput
                    name="backupCode"
                    label="Code de secours"
                    placeholder="xxxxx-xxxxx"
                    autoComplete="one-time-code"
                    autoFocus
                  />
                  <BaseButton width={'full'} isLoading={isLoading} onClick={() => submit()}>
                    Vérifier
                  </BaseButton>
                </>
              )}

              <BaseButton
                variant={'plain'}
                colorType={'primary'}
                onClick={() => switchMode(mode === 'totp' ? 'backup' : 'totp')}
                disabled={isLoading}
              >
                {mode === 'totp'
                  ? 'Téléphone indisponible ? Utiliser un code de secours'
                  : 'Utiliser le code de l’application'}
              </BaseButton>

              <FormCheckbox
                name="trustedDevice"
                label="Faire confiance à cet appareil"
                isReadOnly={isLoading}
              />
              <BaseText fontSize={'sm'} color={'gray.400'}>
                Si vous faites confiance à cet appareil, nous ne vous demanderons plus de code lors
                de vos prochaines connexions
              </BaseText>
              <BaseButton
                width={'full'}
                variant={'outline'}
                colorType={'danger'}
                onClick={() => logout()}
                isLoading={logoutLoading}
                disabled={isLoading || logoutLoading}
              >
                Se déconnecter
              </BaseButton>
            </VStack>
          </AuthBoxContainer>
        );
      }}
    </Formik>
  );
};
