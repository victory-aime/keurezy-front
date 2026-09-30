'use client';

import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { BaseButton, BaseText, FormCheckbox, FormOtpInput } from '_components/custom';
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Link, VStack } from '@chakra-ui/react';
import { APP_ROUTES } from '_config/routes';
import { useRouter } from 'next/navigation';
import { AuthBoxContainer } from './AuthBoxContainer';
import { fetchTwoFactorStatus, TwoFactorStatus, useTotp } from '_hooks/useTotp';
import { authClient } from '../../lib/auth-client';
import { formatCountdown, useSecondsUntil } from '_hooks/useSecondsUntil';
import { VALIDATION } from '_types/';
import {
  ATTEMPTS_PER_SIGN_IN,
  BACKUP_LENGTH,
  BACKUP_SPLIT,
  toBackupCode,
  totpErrorMessage,
  totpFailureKind,
} from '_utils/totp';

type Mode = 'totp' | 'backup';

interface TotpFormValues {
  totpCode: string[];
  backupCode: string[];
  trustedDevice: boolean;
}

const EMPTY_CODE = Array(6).fill('');
/** Pause côté client après un 429 de la limite par IP (5 par minute). */
const PAUSE_AFTER_RATE_LIMIT_MS = 60_000;
/** Contact affiché à l'owner bloqué (optionnel) : personne d'autre ne peut réinitialiser sa 2FA. */
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

/** Défi 2FA terminé : on ferme la session en silence, sans action demandée à l'utilisateur. */
const silentSignOut = () => authClient.signOut().catch(() => undefined);

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
  const { verifyTotp, verifyBackupCode, isLoading } = useTotp();
  const [mode, setMode] = useState<Mode>('totp');
  // État lu en base (verrou, essais restants, recours) : identique quel que soit l'appareil
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  // Défi 2FA terminé (verrou levé mais défi expiré, ou détruit) : plus de saisie possible
  const [ended, setEnded] = useState(false);
  // Limite par IP (429 sans code) : pause d'une minute, propre à ce navigateur
  const [rateLimitedUntil, setRateLimitedUntil] = useState(0);
  const lockedUntil = status?.lockedUntil ? Date.parse(status.lockedUntil) : 0;
  const lockedFor = useSecondsUntil(lockedUntil);
  const rateLimitedFor = useSecondsUntil(rateLimitedUntil);
  const pausedFor = Math.max(lockedFor, rateLimitedFor);
  const blocked = ended || pausedFor > 0;
  const remaining = status?.remainingAttempts ?? ATTEMPTS_PER_SIGN_IN;

  const end = useCallback(() => {
    setEnded(true);
    void silentSignOut();
  }, []);

  /**
   * Relit l'état serveur. Sans défi valide dès l'arrivée (page ouverte sans connexion en cours),
   * retour discret à la connexion ; en cours de route, l'écran passe à « compte bloqué ».
   */
  const refresh = useCallback(
    async (initial = false) => {
      const next = await fetchTwoFactorStatus();
      if (next) return setStatus(next);
      if (!initial) return end();
      await silentSignOut();
      router.replace(APP_ROUTES.ROOT);
    },
    [end, router],
  );

  useEffect(() => {
    void refresh(true);
  }, [refresh]);

  // Fin du décompte : le défi a en général expiré entre-temps, l'état serveur tranche
  useEffect(() => {
    if (lockedUntil && lockedFor === 0) void refresh();
  }, [lockedUntil, lockedFor, refresh]);

  const handleSubmit = async (values: TotpFormValues, helpers: FormikHelpers<TotpFormValues>) => {
    const result =
      mode === 'totp'
        ? await verifyTotp(values.totpCode.join(''), values.trustedDevice)
        : await verifyBackupCode(toBackupCode(values.backupCode), values.trustedDevice);

    if (!result || 'status' in result) {
      const kind = totpFailureKind(result?.status, result?.code);
      // Échec compté ou verrou : essais restants et fin du verrou relus en base
      if (kind === 'invalid' || kind === 'locked') await refresh();
      if (kind === 'challenge-expired') end();
      if (kind === 'rate-limited') setRateLimitedUntil(Date.now() + PAUSE_AFTER_RATE_LIMIT_MS);
      // Cases vidées : FormOtpInput remet alors le focus sur la première
      const field = mode === 'totp' ? 'totpCode' : 'backupCode';
      await helpers.setFieldValue(field, mode === 'totp' ? EMPTY_CODE : EMPTY_BACKUP, false);
      // Verrou et blocage ont leur propre message sous le formulaire
      if (kind === 'invalid' || kind === 'rate-limited' || kind === 'unknown')
        helpers.setFieldError(field, totpErrorMessage(result?.status, result?.code));
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
                    isDisabled={isLoading || blocked}
                    onChangeFunction={() => submit()}
                  />
                ) : (
                  <FormOtpInput
                    key="backup"
                    name="backupCode"
                    count={BACKUP_LENGTH}
                    charset="alphanumeric"
                    separatorAt={BACKUP_SPLIT}
                    isDisabled={isLoading || blocked}
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
                disabled={isLoading || blocked}
              >
                {mode === 'totp'
                  ? 'Téléphone indisponible ? Utiliser un code de secours'
                  : 'Utiliser le code de l’application'}
              </BaseButton>

              {!blocked && remaining > 0 && remaining < ATTEMPTS_PER_SIGN_IN && (
                <BaseText fontSize="sm" color="orange.500" aria-live="polite">
                  {remaining > 1
                    ? `Encore ${remaining} essais avant un blocage de 15 minutes`
                    : 'Dernier essai avant un blocage de 15 minutes'}
                </BaseText>
              )}

              {!ended && pausedFor > 0 && (
                <BaseText
                  fontSize="sm"
                  color="orange.500"
                  textAlign="center"
                  aria-live="polite"
                  mb={2}
                  mt={2}
                >
                  Trop d’échecs : vérification bloquée pour protéger votre compte. Réessayez dans{' '}
                  <Box as="span" fontWeight="bold" fontVariantNumeric="tabular-nums">
                    {formatCountdown(pausedFor)}
                  </Box>
                </BaseText>
              )}

              {ended && (
                <VStack gap={2} width={'full'} my={2} aria-live="polite">
                  <BaseText fontSize="sm" color="orange.500" textAlign="center">
                    Votre compte est bloqué : la vérification en deux étapes n’est plus possible.
                  </BaseText>
                  {status?.recovery === 'support' ? (
                    <BaseText fontSize="sm" textAlign="center">
                      En tant que propriétaire de l’agence, contactez le support pour débloquer
                      votre compte
                      {SUPPORT_EMAIL ? (
                        <>
                          {' '}
                          :{' '}
                          <Link
                            href={`mailto:${SUPPORT_EMAIL}`}
                            color="primary.500"
                            fontWeight="bold"
                          >
                            {SUPPORT_EMAIL}
                          </Link>
                        </>
                      ) : (
                        '.'
                      )}
                    </BaseText>
                  ) : (
                    <BaseButton
                      width={'full'}
                      colorType={'primary'}
                      onClick={() => router.push(APP_ROUTES.AUTH.TWO_FACTOR_RECOVERY)}
                    >
                      Récupérer mon compte
                    </BaseButton>
                  )}
                </VStack>
              )}

              <FormCheckbox
                name="trustedDevice"
                label="Faire confiance à cet appareil"
                isReadOnly={isLoading}
              />
              <BaseText fontSize={'sm'} color={'gray.400'}>
                Si vous faites confiance à cet appareil, nous ne vous demanderons plus de code lors
                de vos prochaines connexions
              </BaseText>
            </VStack>
          </AuthBoxContainer>
        );
      }}
    </Formik>
  );
};
