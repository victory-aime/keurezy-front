'use client';

import { BaseButton, BaseText, FormTextInput, Icons, BaseTag } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { useRouter } from 'next/navigation';
import { VStack, Box, Separator, HStack, Float } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '_hooks/useAuth';
import { Formik, FormikValues } from 'formik';
import { VALIDATION } from '_types/index';
import { useEffect, useState } from 'react';
import { AuthBoxContainer } from './AuthBoxContainer';
import { Navbar } from '_component/NavBar';
import { authClient } from '../../lib/auth-client';
import { handleApiError } from '_utils/handleApiError';

export const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const { login } = useAuth();
  const lastMethod = authClient.getLastUsedLoginMethod();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const isConditionalAvailable = PublicKeyCredential.isConditionalMediationAvailable?.();
    if (!isConditionalAvailable) return;
    void authClient.signIn.passkey({
      autoFill: true,
      fetchOptions: {
        onSuccess() {
          router.push(APP_ROUTES.REDIRECT);
        },
        onError(context) {
          const error = context.error;
          if (
            error.message?.includes('AuthCancelled') ||
            error.message?.includes('NotAllowedError')
          ) {
            handleApiError({
              message:
                "L'authentification par passkey n'est actuellement pas disponible. Veuillez utiliser votre email et mot de passe.",
              status: error.status,
            });
            return;
          }
          handleApiError({
            message: 'Authentification par passkey échouée',
            status: error.status,
          });
        },
      },
    });
  }, []);

  const handlePasswordSubmit = async (values: FormikValues) => {
    setIsLoading(true);
    await login({ email: values.email, password: values.password })
      .catch((error) => console.error('Login error:', error))
      .finally(() => setIsLoading(false));
  };

  const handlePasskeyClick = async () => {
    setIsPasskeyLoading(true);
    try {
      const result = await authClient.signIn.passkey({
        fetchOptions: {
          onSuccess(context) {
            if (context.data?.twoFactorRedirect) {
              router.replace(APP_ROUTES.AUTH._2FA);
              return;
            }
            router.replace(APP_ROUTES.REDIRECT);
          },
          onError(context) {
            const error = context.error;
            if (
              error.message?.includes('AuthCancelled') ||
              error.message?.includes('NotAllowedError')
            ) {
              handleApiError({
                message:
                  "L'authentification par passkey n'est actuellement pas disponible. Veuillez utiliser votre email et mot de passe.",
                status: error.status,
              });
              return;
            }
            handleApiError({
              message: 'Authentification par passkey échouée',
              status: error.status,
            });
          },
        },
      });
      if (result?.error) {
        console.error('Login error:', result?.error);
        handleApiError({
          status: result.error.status,
          message: 'Authentification par passkey échouée',
        });
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <AuthBoxContainer
        title={'Bienvenue !'}
        description={
          <BaseText>
            Vous n'avez pas de compte ?{' '}
            <Box
              as="span"
              cursor="pointer"
              color="primary.500"
              onClick={() => router.push(APP_ROUTES.AUTH.ONBOARD)}
            >
              S'inscrire
            </Box>
          </BaseText>
        }
      >
        <VStack width="full" gap={4}>
          <Box position="relative" width={'full'}>
            <BaseButton
              variant="outline"
              width="full"
              isLoading={isPasskeyLoading}
              leftIcon={<Icons.FingerPrint />}
              onClick={handlePasskeyClick}
            >
              Se connecter avec un passkey
            </BaseButton>
            {lastMethod === 'passkey' && (
              <Float offsetY="-3.5" placement={'top-start'} animation={'bounce'}>
                <BaseTag label={'recemment utilise'} color="blue" />
              </Float>
            )}
          </Box>
          <HStack gap={'4'} width={'full'} alignItems={'center'} justifyContent={'center'}>
            <Separator width={'full'} />
            ou
            <Separator width={'full'} />
          </HStack>
          <Formik
            initialValues={{ email: '', password: '' }}
            enableReinitialize
            onSubmit={handlePasswordSubmit}
            validationSchema={VALIDATION.AUTH.loginValidationSchema}
          >
            {({ values, handleSubmit }) => (
              <VStack width="full" gap={4}>
                <FormTextInput
                  name="email"
                  placeholder="FORM.EMAIL_PLACEHOLDER"
                  value={values.email}
                  leftAccessory={<Icons.Mail />}
                  autoComplete="username webauthn"
                />
                <FormTextInput
                  name="password"
                  type="password"
                  autoComplete="current-password webauthn"
                  placeholder="FORM.PASSWORD_PLACEHOLDER"
                  value={values.password}
                />
                <BaseButton
                  withGradient
                  isLoading={isLoading}
                  width="full"
                  colorType="primary"
                  onClick={() => handleSubmit()}
                >
                  {t('COMMON.LOGIN')}
                </BaseButton>
              </VStack>
            )}
          </Formik>
          <BaseText
            cursor="pointer"
            color="primary.500"
            onClick={() => router.push(APP_ROUTES.AUTH.RESET_PASSWORD)}
          >
            {t('FORM.FORGOT_PASSWORD')}
          </BaseText>
        </VStack>
      </AuthBoxContainer>
    </>
  );
};
