"use client";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { Formik, FormikValues } from "formik";
import { VStack } from "@chakra-ui/react";
import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { VALIDATION } from "_types/";
import { authClient } from "../../lib/auth-client";
import { APP_ROUTES } from "_config/routes";
import { useState } from "react";
import { handleApiSuccess } from "_utils/handleApiSuccess";
import { SendEmailRecap } from "./SendEmailRecap";
import { useRouter } from "next/navigation";
import { handleApiError } from "_utils/handleApiError";

export const TokenExpired = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openRecap, setOpenRecap] = useState(false);
  const router = useRouter();

  const resendEmailVerification = async (values: FormikValues) => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.sendVerificationEmail({
        email: values?.email,
        callbackURL: APP_ROUTES.AUTH.VERIFIED_EMAIL,
      });
      if (data?.status) {
        setOpenRecap(true);
        handleApiSuccess({
          status: 201,
          message: "Le lien a été renvoyé",
        });
      }
      if (error) {
        handleApiError({ status: error.status, message: error?.message! });
      }
    } catch (e) {
      console.log("error resend link", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBoxContainer
      title={"Ce lien de vérification a expiré"}
      description={
        <BaseText>Aucun souci, vous pouvez en demander un nouveau.</BaseText>
      }
    >
      <Formik
        initialValues={{ email: "" }}
        onSubmit={resendEmailVerification}
        validationSchema={
          VALIDATION.AUTH.resetPasswordInitRequestValidationSchema
        }
      >
        {({ dirty, isValid, handleSubmit }) => (
          <VStack gap={2}>
            <FormTextInput
              name={"email"}
              placeholder={"FORM.EMAIL_PLACEHOLDER"}
            />
            <BaseButton
              isLoading={isLoading}
              width={"full"}
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
        data={{ title: "Lien renvoyé" }}
      />
    </AuthBoxContainer>
  );
};
