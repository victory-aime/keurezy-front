'use client';

import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { BaseButton, BaseText, FormCheckbox, FormOtpInput } from '_components/custom';
import React, { useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { APP_ROUTES } from '_config/routes';
import { useRouter } from 'next/navigation';
import { AuthBoxContainer } from './AuthBoxContainer';
import { useAuth } from '_hooks/useAuth';
import { useTotp } from '_hooks/useTotp';
import { formatCountdown, useSecondsUntil } from '_hooks/useSecondsUntil';
import { VALIDATION } from '_types/';
import {
  ACCOUNT_LOCK_MS,
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
/**
 * Fin du verrouillage, gardée dans le navigateur : quitter la page puis revenir ne doit ni
 * remettre le décompte à zéro, ni rouvrir la saisie avant la levée du verrou serveur.
 * ponytail: clé unique par navigateur (aucun utilisateur connu à cette étape) ; le serveur reste
 * la référence, un autre compte sur ce navigateur attendrait au pire la fin du décompte.
 */
const LOCK_STORAGE_KEY = 'keurezy.two-factor-locked-until';

const readStoredLock = () => {
  try {
    return Number(localStorage.getItem(LOCK_STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
};

const storeLock = (until: number) => {
  try {
    if (until) localStorage.setItem(LOCK_STORAGE_KEY, String(until));
    else localStorage.removeItem(LOCK_STORAGE_KEY);
  } catch {
    // Stockage indisponible (navigation privée) : le décompte reste en mémoire
  }
};
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
  // Codes refusés sur cette page : au 5e, le serveur verrouille la 2FA du compte pour 15 min
  const [failures, setFailures] = useState(0);
  // Compte verrouillé 15 min (persisté) ou limite par IP d'une minute : saisie suspendue
  const [lockedUntil, setLockedUntil] = useState(0);
  const [rateLimitedUntil, setRateLimitedUntil] = useState(0);
  const lockedFor = useSecondsUntil(lockedUntil);
  const rateLimitedFor = useSecondsUntil(rateLimitedUntil);
  const pausedFor = Math.max(lockedFor, rateLimitedFor);
  const blocked = pausedFor > 0;
  const remaining = ATTEMPTS_PER_SIGN_IN - failures;

  // Lu après le montage : localStorage n'existe pas au rendu serveur
  useEffect(() => setLockedUntil(readStoredLock()), []);

  /** Démarre le décompte, sans jamais repousser un verrou déjà en cours. */
  const lock = () => {
    if (lockedUntil > Date.now()) return;
    const until = Date.now() + ACCOUNT_LOCK_MS;
    setLockedUntil(until);
    storeLock(until);
  };

  const handleSubmit = async (values: TotpFormValues, helpers: FormikHelpers<TotpFormValues>) => {
    const result =
      mode === 'totp'
        ? await verifyTotp(values.totpCode.join(''), values.trustedDevice)
        : await verifyBackupCode(toBackupCode(values.backupCode), values.trustedDevice);

    if (!result || 'status' in result) {
      const kind = totpFailureKind(result?.status, result?.code);
      if (kind === 'invalid') {
        const count = failures + 1;
        setFailures(count);
        // Le 5e échec verrouille le compte côté serveur (`accountLockout`) : on l'affiche sans attendre
        if (count >= ATTEMPTS_PER_SIGN_IN) lock();
      }
      if (kind === 'locked') lock();
      if (kind === 'rate-limited') setRateLimitedUntil(Date.now() + PAUSE_AFTER_RATE_LIMIT_MS);
      // Cases vidées : FormOtpInput remet alors le focus sur la première
      const field = mode === 'totp' ? 'totpCode' : 'backupCode';
      await helpers.setFieldValue(field, mode === 'totp' ? EMPTY_CODE : EMPTY_BACKUP, false);
      helpers.setFieldError(field, totpErrorMessage(result?.status, result?.code));
      return;
    }
    storeLock(0);
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

              {!blocked && failures > 0 && remaining > 0 && (
                <BaseText fontSize="sm" color="orange.500" aria-live="polite">
                  {remaining > 1
                    ? `Encore ${remaining} essais avant un blocage de 15 minutes`
                    : 'Dernier essai avant un blocage de 15 minutes'}
                </BaseText>
              )}

              {blocked && (
                <BaseText fontSize="sm" color="orange.500" textAlign="center" aria-live="polite">
                  Trop d’échecs : vérification bloquée pour protéger votre compte. Réessayez dans{' '}
                  <Box as="span" fontWeight="bold" fontVariantNumeric="tabular-nums">
                    {formatCountdown(pausedFor)}
                  </Box>
                </BaseText>
              )}

              {/* Masqué pendant le décompte : l'aller-retour vers la récupération ne doit pas
                  servir à rouvrir la saisie */}
              {!blocked && (failures >= ATTEMPTS_PER_SIGN_IN || lockedUntil > 0) && (
                <BaseButton
                  variant={'plain'}
                  colorType={'primary'}
                  onClick={() => router.push(APP_ROUTES.AUTH.TWO_FACTOR_RECOVERY)}
                  disabled={isLoading}
                >
                  Plus accès à votre application ni à vos codes ? Récupérer mon compte
                </BaseButton>
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
              {!blocked && (
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
              )}
            </VStack>
          </AuthBoxContainer>
        );
      }}
    </Formik>
  );
};
