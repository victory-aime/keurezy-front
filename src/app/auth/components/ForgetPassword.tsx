"use client";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { Formik, FormikValues } from "formik";
import { VStack } from "@chakra-ui/react";
import { BaseButton, FormTextInput } from "_components/custom";
import { VALIDATION } from "_types/";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { PasswordIndicator } from "_component/PasswordIndicator";
import { APP_ROUTES } from "_config/routes";
import { AuthModule } from "_store/state-management";

export const ForgetPassword = ({ token }: { token: string }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const isValidPassword = (password: string) => {
    return VALIDATION.AUTH.passwordValidations(password)?.every((v) => v.test);
  };

  const { mutateAsync: resetPasswordMutation, isPaused: isLoading } =
    AuthModule.resetPasswordMutation({
      mutationOptions: {
        onSuccess: () => {
          setTimeout(() => router.replace(APP_ROUTES.AUTH.SIGN_IN), 2000);
        },
      },
    });

  const resetPassword = async (values: FormikValues) => {
    await resetPasswordMutation({
      payload: {
        newPassword: values?.newPassword,
        token,
      },
    });
  };

  return (
    <AuthBoxContainer title={t("FORM.RESET_PASSWORD")}>
      <Formik
        initialValues={{ confirmPassword: "", newPassword: "" }}
        onSubmit={resetPassword}
        validationSchema={VALIDATION.AUTH.resetPasswordValidationSchema}
      >
        {({ handleSubmit, isValid, values }) => (
          <VStack gap={4}>
            <FormTextInput
              name={"newPassword"}
              label={"PROFILE.NEW_PASSWORD"}
              type={"password"}
              placeholder={"PROFILE.NEW_PASSWORD"}
            />
            <FormTextInput
              name={"confirmPassword"}
              type={"password"}
              label={"PROFILE.CONFIRM_NEW_PASSWORD"}
              placeholder={"PROFILE.CONFIRM_NEW_PASSWORD"}
            />
            <PasswordIndicator password={values.newPassword} />

            <BaseButton
              width={"full"}
              onClick={() => handleSubmit()}
              mt={2}
              isLoading={isLoading}
              isDisabled={!isValid || !isValidPassword(values?.newPassword)}
            >
              {t("COMMON.VALIDATE")}
            </BaseButton>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
