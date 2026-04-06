"use client";

import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { VStack, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { VALIDATION } from "_types/";
import React, { useState } from "react";
import { CiMail, CiUser } from "react-icons/ci";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { PasswordIndicator } from "_component/PasswordIndicator";
import { SendEmailRecap } from "./SendEmailRecap";
import { Navbar } from "_component/NavBar";
import { AuthModule } from "_store/state-management";

export const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [openModalLink, setOpenModalLink] = useState(false);
  const isValidPassword = (password: string) => {
    return VALIDATION.AUTH.passwordValidations(password)?.every((v) => v.test);
  };

  const { mutateAsync: registerUser, isPending: registerPending } =
    AuthModule.registerUserMutation({
      mutationOptions: {
        onSuccess: async () => {
          setOpenModalLink(true);
        },
      },
    });

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    await registerUser({ payload: values });
  };

  return (
    <>
      <Navbar />
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
              <BaseText color={"gray.400"}>
                En créant un compte, vous acceptez nos Conditions d'utilisation
                et notre Politique de confidentialité.
              </BaseText>
              <BaseButton
                withGradient
                width="full"
                isLoading={registerPending}
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
    </>
  );
};
