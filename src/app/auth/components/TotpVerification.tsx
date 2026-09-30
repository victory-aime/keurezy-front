'use client';

import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { BaseButton, BaseText, FormCheckbox, FormOtpInput } from '_components/custom';
import React, { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { APP_ROUTES } from '_config/routes';
import { useRouter } from 'next/navigation';
import { AuthBoxContainer } from './AuthBoxContainer';
import { useAuth } from '_hooks/useAuth';
import { useTotp } from '_hooks/useTotp';
import { VALIDATION } from '_types/';
import { BACKUP_LENGTH, BACKUP_SPLIT, toBackupCode, totpErrorMessage } from '_utils/totp';

type Mode = 'totp' | 'backup';

interface TotpFormValues {
  totpCode: string[];
  backupCode: string[];
  trustedDevice: boolean;
}

const EMPTY_CODE = Array(6).fill('');
const EMPTY_BACKUP = Array(BACKUP_LENGTH).fill('');

const backupCodeSchema = Yup.object({
  backupCode: Yup.array()
    .test(
      'backup-complete',
      'Le code de secours contient 10 caractères',
      (value) =>
        Array.isArray(value) &&
        value.length === BACKUP_LENGTH &&
        value.every((c) => /^[a-zA-Z0-9]$/.test(c)),
    )
    .required('Code de secours requis'),
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

  const handleSubmit = async (values: TotpFormValues, helpers: FormikHelpers<TotpFormValues>) => {
    const result =
      mode === 'totp'
        ? await verifyTotp(values.totpCode.join(''), values.trustedDevice)
        : await verifyBackupCode(toBackupCode(values.backupCode), values.trustedDevice);

    if (!result || 'status' in result) {
      // Cases vidées : FormOtpInput remet alors le focus sur la première
      const field = mode === 'totp' ? 'totpCode' : 'backupCode';
      await helpers.setFieldValue(field, mode === 'totp' ? EMPTY_CODE : EMPTY_BACKUP, false);
      helpers.setFieldError(field, totpErrorMessage(result?.status));
      return;
    }
    router.replace(APP_ROUTES.REDIRECT);
  };

  return (
    <Formik<TotpFormValues>
      initialValues={{ totpCode: EMPTY_CODE, backupCode: EMPTY_BACKUP, trustedDevice: false }}
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
              <Box width={'full'}>
                {mode === 'totp' ? (
                  // `key` : une instance par mode, le PinInput ne relit pas `count` après son montage
                  <FormOtpInput
                    key="totp"
                    name="totpCode"
                    isDisabled={isLoading}
                    onChangeFunction={() => submit()}
                  />
                ) : (
                  <FormOtpInput
                    key="backup"
                    name="backupCode"
                    count={BACKUP_LENGTH}
                    charset="alphanumeric"
                    separatorAt={BACKUP_SPLIT}
                    isDisabled={isLoading}
                    onChangeFunction={() => submit()}
                  />
                )}
              </Box>
              {mode === 'totp' ? (
                <>
                  <BaseText color={'gray.400'}>
                    Entrez le code affiché dans votre application d’authentification (Google
                    Authenticator, Microsoft Authenticator…). La vérification démarre dès que les 6
                    chiffres sont saisis.
                  </BaseText>
                </>
              ) : (
                <BaseText color={'gray.400'}>
                  Respectez les majuscules et minuscules. Vous pouvez coller le code complet, tiret
                  compris : la vérification démarre dès que les 10 caractères sont saisis.
                </BaseText>
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
