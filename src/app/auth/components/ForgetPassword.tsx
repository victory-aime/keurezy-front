'use client';
import { AuthBoxContainer } from './AuthBoxContainer';
import { Formik, FormikValues } from 'formik';
import { VStack } from '@chakra-ui/react';
import { BaseButton, BaseText, FormTextInput } from '_components/custom';
import { VALIDATION } from '_types/';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PasswordIndicator } from '_component/PasswordIndicator';
import { APP_ROUTES } from '_config/routes';
import { AuthModule } from '_store/state-management';

/** `expired` : le backend refuse le jeton (expiré, déjà utilisé ou invalide). */
type ResetState = 'form' | 'success' | 'expired';

export const ForgetPassword = ({ token }: { token: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, setState] = useState<ResetState>('form');

  const isValidPassword = (password: string) => {
    return VALIDATION.AUTH.passwordValidations(password)?.every((v) => v.test);
  };

  const { mutateAsync: resetPasswordMutation, isPending } = AuthModule.resetPasswordMutation({
    mutationOptions: {
      onSuccess: () => setState('success'),
      onError: () => setState('expired'),
    },
  });

  const resetPassword = async (values: FormikValues) => {
    await resetPasswordMutation({
      payload: {
        newPassword: values?.newPassword,
        token,
      },
    }).catch(() => undefined);
  };

  if (state === 'success') {
    return (
      <AuthBoxContainer
        withAnimatedCheckmark
        title={'Mot de passe modifié'}
        description={
          <BaseText>
            Vos autres sessions ont été fermées. Connectez-vous avec votre nouveau mot de passe.
          </BaseText>
        }
      >
        <BaseButton width={'full'} onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}>
          {t('COMMON.LOGIN')}
        </BaseButton>
      </AuthBoxContainer>
    );
  }

  if (state === 'expired') {
    return (
      <AuthBoxContainer
        withAnimatedCheckmark
        animatedType={'error'}
        title={'Ce lien a expiré ou a déjà été utilisé'}
        description={<BaseText>Aucun souci, vous pouvez en demander un nouveau.</BaseText>}
      >
        <BaseButton
          width={'full'}
          onClick={() => router.replace(APP_ROUTES.AUTH.RESET_PASSWORD)}
        >
          Recevoir un nouveau lien
        </BaseButton>
      </AuthBoxContainer>
    );
  }

  return (
    <AuthBoxContainer title={t('FORM.RESET_PASSWORD')}>
      <Formik
        initialValues={{ confirmPassword: '', newPassword: '' }}
        onSubmit={resetPassword}
        validationSchema={VALIDATION.AUTH.resetPasswordValidationSchema}
      >
        {({ handleSubmit, isValid, values }) => (
          <VStack gap={4}>
            <FormTextInput
              name={'newPassword'}
              label={'PROFILE.NEW_PASSWORD'}
              type={'password'}
              placeholder={'PROFILE.NEW_PASSWORD'}
            />
            <FormTextInput
              name={'confirmPassword'}
              type={'password'}
              label={'PROFILE.CONFIRM_NEW_PASSWORD'}
              placeholder={'PROFILE.CONFIRM_NEW_PASSWORD'}
            />
            <PasswordIndicator password={values.newPassword} />

            <BaseButton
              width={'full'}
              onClick={() => handleSubmit()}
              mt={2}
              isLoading={isPending}
              isDisabled={isPending || !isValid || !isValidPassword(values?.newPassword)}
            >
              {t('COMMON.VALIDATE')}
            </BaseButton>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
