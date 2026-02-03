"use client";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { Formik } from "formik";
import { Box, VStack } from "@chakra-ui/react";
import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { VALIDATION } from "_types/";
import { APP_ROUTES } from "_config/routes";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export const ForgetPass = () => {
  const { t } = useTranslation();
  const router = useRouter();
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
      <Formik
        initialValues={{ email: "" }}
        onSubmit={() => {}}
        validationSchema={VALIDATION.AUTH.resetPasswordValidationSchema}
      >
        {({ handleSubmit, isValid }) => (
          <VStack gap={2}>
            <FormTextInput
              name={"email"}
              placeholder={"FORM.EMAIL_PLACEHOLDER"}
            />
            <BaseButton
              width={"full"}
              onClick={handleSubmit}
              mt={2}
              disabled={!isValid}
            >
              Envoyer-moi le lien
            </BaseButton>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
