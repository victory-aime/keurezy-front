"use client";

import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { VStack, HStack, Box, Separator } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "_hooks/useAuth";
import { Formik, FormikValues } from "formik";
import { VALIDATION } from "_types/index";
import { useState } from "react";
import { CiCloudOn, CiMail } from "react-icons/ci";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { VariablesColors } from "_theme/variables";

export const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const callbackUrl =
    useSearchParams()?.get("callbackUrl") || APP_ROUTES.REDIRECT;
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setGoogleIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true);
    await login({
      email: values.email,
      password: values.password,
      callbackUrl,
    })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  };

  const handleGoogleLogin = async () => {
    setGoogleIsLoading(true);
    await login({
      providerType: "google",
      callbackUrl,
    })
      .catch((error) => console.log("error", error))
      .finally(() => setGoogleIsLoading(false));
  };

  return (
    <AuthBoxContainer
      title={"Bienvenue !"}
      description={
        <BaseText>
          Vous n'avez pas de compte ?{" "}
          <Box
            as="span"
            cursor="pointer"
            color="primary.500"
            onClick={() => router.push(APP_ROUTES.AUTH.SIGN_UP)}
          >
            S'inscrire
          </Box>
        </BaseText>
      }
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={VALIDATION.AUTH.loginValidationSchema}
      >
        {({ values, handleSubmit }) => (
          <VStack width="full" gap={4}>
            <BaseButton
              variant={"outline"}
              width={"full"}
              colorType={"neutral"}
              isLoading={isGoogleLoading}
              leftIcon={<CiCloudOn color={VariablesColors.black} />}
              onClick={async () => {
                await handleGoogleLogin().then(() => setIsLoading(false));
              }}
            >
              <BaseText color={"black"}>Continuer avec le SSO</BaseText>
            </BaseButton>
            <HStack
              gap={"4"}
              width={"full"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Separator width={"full"} />
              ou
              <Separator width={"full"} />
            </HStack>
            <FormTextInput
              name="email"
              placeholder={"FORM.EMAIL_PLACEHOLDER"}
              value={values.email}
              leftAccessory={<CiMail />}
            />
            <FormTextInput
              name="password"
              type="password"
              placeholder={"FORM.PASSWORD_PLACEHOLDER"}
              value={values.password}
            />
            <BaseButton
              withGradient
              isLoading={isLoading}
              width={"full"}
              colorType={"primary"}
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("COMMON.LOGIN")}
            </BaseButton>
            <BaseText
              cursor="pointer"
              color={"primary.500"}
              onClick={() => router.push(APP_ROUTES.AUTH.RESET_PASSWORD)}
            >
              {t("FORM.FORGOT_PASSWORD")}
            </BaseText>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
