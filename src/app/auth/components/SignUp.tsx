"use client";

import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { VStack, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "_hooks/useAuth";
import { Formik } from "formik";
import { VALIDATION } from "_types/";
import React, { useState } from "react";
import { CiMail, CiUser } from "react-icons/ci";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { PasswordIndicator } from "_component/PasswordIndicator";

export const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isValidPassword = (password: string) => {
    return VALIDATION.AUTH.passwordValidations(password)?.every((v) => v.test);
  };

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    await signUp(values)
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  };

  return (
    <AuthBoxContainer
      title="FORM.LOGIN_TITLE"
      description={
        <BaseText>
          Vous avez déjà un compte ?{" "}
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
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={VALIDATION.AUTH.createUserValidationSchema}
        validateOnBlur={false}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit }) => (
          <VStack width="full" gap={5}>
            <FormTextInput
              name="name"
              required
              placeholder="FORM.NAME_PLACEHOLDER"
              leftAccessory={<CiUser />}
            />
            <FormTextInput
              name="email"
              type="email"
              required
              placeholder="FORM.EMAIL_PLACEHOLDER"
              leftAccessory={<CiMail />}
            />
            <FormTextInput
              name="password"
              type="password"
              required
              placeholder="FORM.PASSWORD_PLACEHOLDER"
              autoComplete="new-password"
            />

            <PasswordIndicator password={values.password} />

            <BaseButton
              withGradient
              width="full"
              isLoading={isLoading}
              disabled={!isValidPassword(values.password)}
              onClick={() => handleSubmit()}
            >
              {t("COMMON.SIGN_UP")}
            </BaseButton>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
