"use client";

import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { VStack, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "_hooks/useAuth";
import { Formik, FormikValues } from "formik";
import { VALIDATION } from "_types/index";
import { useState } from "react";
import { CiMail, CiUser } from "react-icons/ci";
import { AuthBoxContainer } from "./AuthBoxContainer";

export const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true);
    await signUp({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <AuthBoxContainer
      title={"FORM.LOGIN_TITLE"}
      description={"FORM.LOGIN_DESC"}
    >
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        enableReinitialize
        onSubmit={async (values) => {
          await handleSubmit(values).then(() => {
            setIsLoading(false);
          });
        }}
        validationSchema={VALIDATION.AUTH.loginValidationSchema}
      >
        {({ values, handleSubmit }) => (
          <VStack width="full" mt={"20px"} gap={5}>
            <FormTextInput
              name="name"
              required
              label={"PROFILE.NAME"}
              placeholder={"FORM.NAME_PLACEHOLDER"}
              value={values.name}
              leftAccessory={<CiUser />}
            />
            <FormTextInput
              name="email"
              type={"email"}
              required
              label={"PROFILE.EMAIL"}
              placeholder={"FORM.EMAIL_PLACEHOLDER"}
              value={values.email}
              leftAccessory={<CiMail />}
            />
            <FormTextInput
              name="password"
              required
              type="password"
              label={"FORM.PASSWORD"}
              placeholder={"FORM.PASSWORD_PLACEHOLDER"}
              value={values.password}
            />

            <BaseButton
              mt={4}
              withGradient
              isLoading={isLoading}
              colorType={"primary"}
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("COMMON.SIGN_UP")}
            </BaseButton>

            <BaseText>
              Vous avez deja un compte ?{" "}
              <Box
                as="span"
                textDecoration="underline"
                cursor="pointer"
                color="primary.500"
                fontWeight="bold"
                onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
              >
                {t("COMMON.LOGIN")}
              </Box>
            </BaseText>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
