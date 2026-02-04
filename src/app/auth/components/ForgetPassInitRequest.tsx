"use client";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { Formik, FormikValues } from "formik";
import { Box, VStack } from "@chakra-ui/react";
import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { VALIDATION } from "_types/";
import { APP_ROUTES } from "_config/routes";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { useState } from "react";
import { handleApiSuccess } from "_utils/handleApiSuccess";
import { handleApiError } from "_utils/handleApiError";

export const ForgetPassInitRequest = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const router = useRouter();

  const resetPasswordInit = async (values: FormikValues) => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.requestPasswordReset({
        email: values?.email,
        redirectTo: APP_ROUTES.AUTH.RESET_PASSWORD_VALIDATE,
      });
      if (data?.status) {
        setStatus(data?.status);
        handleApiSuccess({
          status: 201,
          message: data?.message!,
        });
      }
      if (error) {
        handleApiError({ status: error.status, message: error?.message! });
      }
    } catch (e) {
      console.log("error", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBoxContainer
      title={"Mot de passe oublié"}
      description={
        <BaseText>
          Vous vous rappeler de votre mot de passe ?{" "}
          <Box
            as="span"
            cursor="pointer"
            color="primary.500"
            onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
          >
            {t("COMMON.LOGIN")}
          </Box>
        </BaseText>
      }
    >
      {status ? (
        <BaseText>Email sent</BaseText>
      ) : (
        <Formik
          initialValues={{ email: "" }}
          onSubmit={resetPasswordInit}
          validationSchema={
            VALIDATION.AUTH.resetPasswordInitRequestValidationSchema
          }
        >
          {({ handleSubmit, isValid, dirty }) => (
            <VStack gap={2}>
              <FormTextInput
                name={"email"}
                placeholder={"FORM.EMAIL_PLACEHOLDER"}
              />

              <BaseButton
                width={"full"}
                onClick={() => handleSubmit()}
                isLoading={isLoading}
                mt={2}
                isDisabled={!isValid || !dirty}
              >
                Envoyer-moi le lien
              </BaseButton>
            </VStack>
          )}
        </Formik>
      )}
    </AuthBoxContainer>
  );
};
