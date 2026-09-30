'use client';

import { Box, HStack, VStack } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';
import { BaseButton, BaseText, FormOtpInput, FormTextInput, Icons } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { formatCountdown, useSecondsUntil } from '_hooks/useSecondsUntil';
import { AuthModule } from '_store/state-management';
import { AuthBoxContainer } from './AuthBoxContainer';

type ApiError = AxiosError<{ errorCode?: string; message?: string }>;
type Step = 'credentials' | 'code' | 'scheduled';

const credentialsSchema = Yup.object({
  email: Yup.string().trim().email('Adresse e-mail invalide').required('E-mail requis'),
  password: Yup.string().required('Mot de passe requis'),
});

const codeSchema = Yup.object({
  code: Yup.array()
    .test(
      'code-complete',
      'Le code contient 6 chiffres',
      (value) => Array.isArray(value) && value.length === 6 && value.every((c) => /^\d$/.test(c)),
    )
    .required('Code requis'),
});

/**
 * Récupération d'un compte dont la 2FA est perdue (téléphone et codes de secours) : mot de
 * passe, code envoyé par e-mail, puis désactivation de la 2FA programmée dans 72 h. Le titulaire
 * peut annuler par le lien reçu ou en se connectant normalement : ce délai protège le compte si
 * quelqu'un d'autre connaît le mot de passe et la boîte mail.
 */
export const TwoFactorRecovery = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>('credentials');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [retryUntil, setRetryUntil] = useState(0);
  const [executeAt, setExecuteAt] = useState<string | null>(null);
  const retryIn = useSecondsUntil(retryUntil);

  const { mutateAsync: requestCode, isPending: isRequesting } =
    AuthModule.twoFactorRecoveryRequestMutation();
  const { mutateAsync: confirm } = AuthModule.twoFactorRecoveryConfirmMutation();

  const sendCode = async (values: typeof credentials) => {
    const sent = await requestCode({ payload: values });
    setCredentials(values);
    setRetryUntil(Date.now() + (sent?.retryIn ?? 120) * 1000);
    setStep('code');
  };

  const submitCredentials = async (
    values: typeof credentials,
    helpers: FormikHelpers<typeof credentials>,
  ) => {
    try {
      await sendCode(values);
    } catch (err) {
      const data = (err as ApiError).response?.data;
      const field = data?.errorCode === 'INVALID_CREDENTIALS' ? 'password' : 'email';
      helpers.setFieldError(field, data?.message ?? 'Une erreur est survenue');
    }
  };

  const submitCode = async (
    values: { code: string[] },
    helpers: FormikHelpers<{ code: string[] }>,
  ) => {
    try {
      const result = await confirm({ payload: { ...credentials, code: values.code.join('') } });
      setExecuteAt(result.executeAt);
      setStep('scheduled');
    } catch (err) {
      const data = (err as ApiError).response?.data;
      // Cases vidées : FormOtpInput remet le focus sur la première
      await helpers.setFieldValue('code', Array(6).fill(''), false);
      helpers.setFieldError('code', data?.message ?? 'Code invalide');
    }
  };

  if (step === 'scheduled') {
    const date = executeAt
      ? new Date(executeAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })
      : '';
    return (
      <AuthBoxContainer
        withAnimatedCheckmark
        title="Demande enregistrée"
        description={
          <BaseText>
            La double authentification de votre compte sera désactivée le <strong>{date}</strong>.
          </BaseText>
        }
      >
        <VStack gap={3} alignItems="stretch">
          <BaseText fontSize="sm">
            Ce délai protège votre compte. Un e-mail vous a été envoyé avec un lien pour annuler la
            demande si elle ne vient pas de vous. Une connexion réussie l’annule aussi.
          </BaseText>
          <BaseText fontSize="sm">
            À cette date, connectez-vous avec votre mot de passe, puis réactivez la double
            authentification depuis Sécurité.
          </BaseText>
          <BaseButton onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}>
            Retour à la connexion
          </BaseButton>
        </VStack>
      </AuthBoxContainer>
    );
  }

  return (
    <AuthBoxContainer
      title="Je n’ai plus accès à ma double authentification"
      description={
        <BaseText>
          {step === 'credentials'
            ? 'Téléphone et codes de secours perdus ? Confirmez votre identité : la double authentification sera désactivée après un délai de sécurité de 72 h.'
            : `Saisissez le code envoyé à ${credentials.email}.`}
        </BaseText>
      }
    >
      {step === 'credentials' ? (
        <Formik
          initialValues={credentials}
          validationSchema={credentialsSchema}
          onSubmit={submitCredentials}
        >
          {({ handleSubmit, isSubmitting }) => (
            <VStack gap={4} alignItems="stretch">
              <FormTextInput
                name="email"
                label="E-mail"
                placeholder="FORM.EMAIL_PLACEHOLDER"
                autoComplete="email"
              />
              <FormTextInput
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="FORM.PASSWORD_PLACEHOLDER"
                autoComplete="current-password"
              />
              <BaseButton width="full" isLoading={isSubmitting} onClick={() => handleSubmit()}>
                Recevoir un code
              </BaseButton>
              <BaseButton variant="plain" colorType="primary" onClick={() => router.back()}>
                Retour
              </BaseButton>
            </VStack>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ code: Array(6).fill('') }}
          validationSchema={codeSchema}
          onSubmit={submitCode}
        >
          {({ handleSubmit, isSubmitting }) => (
            <VStack gap={4} alignItems="stretch">
              <FormOtpInput
                name="code"
                isDisabled={isSubmitting}
                onChangeFunction={() => handleSubmit()}
              />
              {/* Décompte lisible (texte, pas un bouton grisé) ; le bouton revient à 0 */}
              <HStack justifyContent="center" minH="40px" aria-live="polite">
                {retryIn > 0 ? (
                  <BaseText fontSize="sm" color="fg.muted">
                    Nouveau code possible dans{' '}
                    <Box
                      as="span"
                      fontWeight="bold"
                      color="primary.500"
                      fontVariantNumeric="tabular-nums"
                    >
                      {formatCountdown(retryIn)}
                    </Box>
                  </BaseText>
                ) : (
                  <BaseButton
                    variant="outline"
                    colorType="primary"
                    size="sm"
                    isLoading={isRequesting}
                    leftIcon={<Icons.SendMail />}
                    onClick={() => sendCode(credentials).catch(() => undefined)}
                  >
                    Renvoyer le code
                  </BaseButton>
                )}
              </HStack>
              <BaseButton width="full" isLoading={isSubmitting} onClick={() => handleSubmit()}>
                Confirmer la demande
              </BaseButton>
            </VStack>
          )}
        </Formik>
      )}
    </AuthBoxContainer>
  );
};
