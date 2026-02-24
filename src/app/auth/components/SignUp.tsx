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
import { authClient } from "../../lib/auth-client";
import { SendEmailRecap } from "./SendEmailRecap";
import { useAuthContext } from "_context/auth-context";

export const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp } = useAuth();
  const { refetchSession } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [openModalLink, setOpenModalLink] = useState(false);

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
      .then(async (result) => {
        if (result?.data?.user) {
          // await authClient
          //   .sendVerificationEmail({
          //     email: result?.data?.user?.email,
          //     callbackURL: APP_ROUTES.AUTH.VERIFIED_EMAIL,
          //   })
          //   .then(async () => {
          //     await refetchSession?.().then(() => {
          //       setOpenModalLink(true);
          //     });
          //   });
          //router.push(APP_ROUTES.AUTH.SIGN_IN);
        }
      })
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
        {({ values, handleSubmit, isValid }) => (
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
              isDisabled={!isValidPassword(values.password) || !isValid}
              onClick={() => handleSubmit()}
            >
              {t("COMMON.SIGN_UP")}
            </BaseButton>
          </VStack>
        )}
      </Formik>
      <SendEmailRecap
        onChange={() => {
          router.push(APP_ROUTES.AUTH.SIGN_IN);
          setOpenModalLink(false);
        }}
        isOpen={openModalLink}
        data={{ title: "Encore une dernière étape 👋" }}
      />
    </AuthBoxContainer>
  );
};
