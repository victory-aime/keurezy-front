'use client';
import { AuthBoxContainer } from './AuthBoxContainer';
import { Formik, FormikValues } from 'formik';
import { VStack } from '@chakra-ui/react';
import { BaseButton, BaseText, FormTextInput } from '_components/custom';
import { VALIDATION } from '_types/';
import { APP_ROUTES } from '_config/routes';
import { useState } from 'react';
import { handleApiSuccess } from '_utils/handleApiSuccess';
import { SendEmailRecap } from './SendEmailRecap';
import { useRouter } from 'next/navigation';
import { AuthModule } from '_store/state-management';

export const TokenExpired = () => {
  const [openRecap, setOpenRecap] = useState(false);
  const router = useRouter();

  const { mutateAsync: checkEmail, isPending } = AuthModule.checkEmailMutation({});

  const { mutateAsync: sendEmailVerification, isPending: isSendingEmailVerification } =
    AuthModule.sendEmailVerificationMutation({
      mutationOptions: {
        onSuccess: () => {
          setOpenRecap(true);
        },
      },
    });

  const resendEmailVerification = async (values: FormikValues) => {
    await sendEmailVerification({
      payload: {
        email: values?.email,
        callbackURL: APP_ROUTES.AUTH.VERIFIED_EMAIL,
      },
    });
  };

  return (
    <AuthBoxContainer
      title={'Ce lien de vérification a expiré ou a deja eté utilisé'}
      description={<BaseText>Aucun souci, vous pouvez en demander un nouveau.</BaseText>}
    >
      <Formik
        initialValues={{ email: '' }}
        onSubmit={resendEmailVerification}
        validateOnChange={false}
        validateOnBlur
        validationSchema={VALIDATION.AUTH.resetPasswordInitRequestValidationSchema(
          async (email: string) => {
            const user = await checkEmail({ payload: { email } });
            return !!user;
          },
        )}
      >
        {({ dirty, isValid, handleSubmit }) => (
          <VStack gap={2}>
            <FormTextInput
              name={'email'}
              placeholder={'FORM.EMAIL_PLACEHOLDER'}
              isVerified={isPending}
            />
            <BaseButton
              isLoading={isSendingEmailVerification}
              width={'full'}
              onClick={() => handleSubmit()}
              isDisabled={!isValid || !dirty}
            >
              Renvoyer le lien
            </BaseButton>
          </VStack>
        )}
      </Formik>
      <SendEmailRecap
        onChange={() => {
          setOpenRecap(false);
          router.replace(APP_ROUTES.AUTH.SIGN_IN);
        }}
        isOpen={openRecap}
        data={{ title: 'Lien renvoyé' }}
      />
    </AuthBoxContainer>
  );
};
