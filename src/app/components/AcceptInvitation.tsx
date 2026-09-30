'use client';

import { Avatar, Box, Center, HStack, VStack, Wrap } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Confetti from 'react-confetti';
import * as Yup from 'yup';
import {
  BaseButton,
  BaseTag,
  BaseText,
  FormOtpInput,
  FormTextInput,
  Icons,
  KeurezyLogoAnimation,
} from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { useWindowSize } from '_hooks/useWindowSize';
import { formatCountdown, useSecondsUntil } from '_hooks/useSecondsUntil';
import { InvitationModule } from '_store/state-management';
import { CONSTANTS, MODELS, VALIDATION } from '_types/';
import { PasswordIndicator } from '_component/PasswordIndicator';
import {
  INVITATION_CODE_ERRORS,
  INVITATION_ERROR_COPY,
  invitationErrorState,
} from '_utils/invitation';
import { MotionBox } from '_constants/motion';
import { AuthBoxContainer } from '../auth/components/AuthBoxContainer';
import { AnimatedCheckmark } from '../auth/onboarding/components/AnimatedCheck';
import { confettiColors } from '../auth/onboarding/components/FinalStep';
import { authClient } from '../lib/auth-client';

type Step = 'preview' | 'verify' | 'success';

interface VerifyValues {
  code: string[];
  newPassword: string;
  confirmPassword: string;
}

type ApiError = AxiosError<{ errorCode?: string; message?: string }>;

const verifySchema = VALIDATION.AUTH.resetPasswordValidationSchema.concat(
  Yup.object({
    code: Yup.array()
      .test(
        'code-complete',
        'Le code contient 6 chiffres',
        (value) => Array.isArray(value) && value.length === 6 && value.every((c) => /^\d$/.test(c)),
      )
      .required('Code requis'),
  }),
);

/**
 * Acceptation d'une invitation, en trois temps : aperçu (lecture seule, rien n'est consommé à
 * l'ouverture du lien), code reçu par e-mail et mot de passe choisi, puis succès. Le compte est
 * créé avec l'e-mail vérifié ; l'invité est connecté avec le mot de passe qu'il vient de saisir.
 */
export const AcceptInvitation = ({ params: token }: { params: string }) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [step, setStep] = useState<Step>('preview');
  const [retryUntil, setRetryUntil] = useState(0);
  const retryIn = useSecondsUntil(retryUntil);

  const {
    data: preview,
    isLoading,
    error,
  } = InvitationModule.getInvitationPreview({
    params: { token },
    queryOptions: { enabled: !!token && step !== 'success' },
  });

  const { mutateAsync: sendCode, isPending: isSending } =
    InvitationModule.sendInvitationCodeMutation({
      mutationOptions: {
        onSuccess: (data) => {
          setRetryUntil(Date.now() + (data?.retryIn ?? 120) * 1000);
          setStep('verify');
        },
      },
    });
  const { mutateAsync: accept } = InvitationModule.acceptInvitationMutation();

  const requestCode = () => sendCode({ payload: { token } }).catch(() => undefined);

  const submit = async (values: VerifyValues, helpers: FormikHelpers<VerifyValues>) => {
    try {
      const { email } = await accept({
        payload: { token, code: values.code.join(''), password: values.newPassword },
      });
      // Connexion avec le mot de passe choisi (cookie posé via la route /api/auth du front)
      const { error: signInError } = await authClient.signIn.email({
        email,
        password: values.newPassword,
      });
      if (signInError) {
        router.replace(APP_ROUTES.AUTH.SIGN_IN);
        return;
      }
      setStep('success');
    } catch (err) {
      const data = (err as ApiError).response?.data;
      if (data?.errorCode && INVITATION_CODE_ERRORS.includes(data.errorCode)) {
        // Cases vidées : FormOtpInput remet le focus sur la première
        await helpers.setFieldValue('code', Array(6).fill(''), false);
        helpers.setFieldError('code', data.message ?? 'Code invalide');
      }
    }
  };

  if (!token || error) {
    const copy =
      INVITATION_ERROR_COPY[invitationErrorState((error as ApiError)?.response?.data?.errorCode)];
    return (
      <Center minH="100vh" px={4}>
        <VStack gap={4} maxW="md" textAlign="center">
          <AnimatedCheckmark type="error" />
          <BaseText fontSize="2xl" fontWeight="bold">
            {copy.title}
          </BaseText>
          <BaseText>{copy.text}</BaseText>
        </VStack>
      </Center>
    );
  }

  if (isLoading || !preview) {
    return <KeurezyLogoAnimation isExiting={false} onAnimationComplete={() => {}} />;
  }

  if (step === 'success') {
    return (
      <Center minH="100vh" px={4}>
        <Box position="fixed" inset={0} pointerEvents="none" zIndex={50}>
          <Confetti width={width} height={height} recycle={false} colors={confettiColors} />
        </Box>
        <VStack gap={6} maxW="lg" textAlign="center">
          <AnimatedCheckmark />
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BaseText fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="bold">
              Bienvenue chez {preview.agency.name} !
            </BaseText>
            <BaseText mt={2}>Votre compte est prêt et votre adresse e-mail est vérifiée.</BaseText>
          </MotionBox>
          <BaseButton onClick={() => router.push(APP_ROUTES.REDIRECT)} rightIcon={<Icons.Rocket />}>
            Accéder au tableau de bord
          </BaseButton>
        </VStack>
      </Center>
    );
  }

  const roleLabel =
    CONSTANTS.AGENCY_ROLE_LIST.find((role) => role.value === preview.role)?.label ?? preview.role;
  const expiresOn = new Date(preview.expiresAt).toLocaleDateString('fr-FR');

  return (
    <AuthBoxContainer
      title={step === 'preview' ? `Rejoindre ${preview.agency.name}` : 'Confirmez votre adresse'}
      description={
        <BaseText>
          {step === 'preview'
            ? 'Vérifiez l’invitation, puis recevez un code pour la confirmer.'
            : `Saisissez le code envoyé à ${preview.maskedEmail} et choisissez votre mot de passe.`}
        </BaseText>
      }
    >
      {step === 'preview' ? (
        <VStack gap={5} alignItems="stretch">
          <HStack gap={3}>
            <Avatar.Root size="lg">
              <Avatar.Fallback name={preview.agency.name} />
              {preview.agency.logo && <Avatar.Image src={preview.agency.logo} />}
            </Avatar.Root>
            <BaseText>
              <strong>{preview.invitedBy}</strong> vous invite à rejoindre{' '}
              <strong>{preview.agency.name}</strong> en tant que <strong>{roleLabel}</strong>.
            </BaseText>
          </HStack>

          {preview.permissions.length > 0 && (
            <VStack alignItems="flex-start" gap={2}>
              <BaseText fontWeight="semibold">Vos accès</BaseText>
              <Wrap gap={2}>
                {preview.permissions.map((permission) => (
                  <BaseTag key={permission} label={permission} variant="subtle" />
                ))}
              </Wrap>
            </VStack>
          )}

          <VStack alignItems="flex-start" gap={1} color="fg.muted" fontSize="sm">
            <BaseText>Adresse invitée : {preview.maskedEmail}</BaseText>
            <BaseText>Invitation valable jusqu’au {expiresOn}</BaseText>
          </VStack>

          <BaseButton width="full" isLoading={isSending} onClick={requestCode}>
            Recevoir mon code
          </BaseButton>
        </VStack>
      ) : (
        <Formik<VerifyValues>
          initialValues={{ code: Array(6).fill(''), newPassword: '', confirmPassword: '' }}
          validationSchema={verifySchema}
          onSubmit={submit}
        >
          {({ handleSubmit, values, isSubmitting }) => (
            <VStack gap={4} alignItems="stretch">
              <FormOtpInput name="code" label="Code reçu par e-mail" isDisabled={isSubmitting} />
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
                    isLoading={isSending}
                    leftIcon={<Icons.SendMail />}
                    onClick={requestCode}
                  >
                    Renvoyer le code
                  </BaseButton>
                )}
              </HStack>
              <FormTextInput
                name="newPassword"
                type="password"
                label="Mot de passe"
                placeholder="Choisissez votre mot de passe"
                autoComplete="new-password"
              />
              <FormTextInput
                name="confirmPassword"
                type="password"
                label="Confirmez le mot de passe"
                placeholder="Confirmez le mot de passe"
                autoComplete="new-password"
              />
              <PasswordIndicator password={values.newPassword} />
              <BaseButton width="full" isLoading={isSubmitting} onClick={() => handleSubmit()}>
                Rejoindre l’équipe
              </BaseButton>
            </VStack>
          )}
        </Formik>
      )}
    </AuthBoxContainer>
  );
};
