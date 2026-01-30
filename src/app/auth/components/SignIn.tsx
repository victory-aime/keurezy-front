"use client";

import {
  BaseButton,
  BaseText,
  CheckboxForm,
  FormTextInput,
} from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { Flex, VStack, HStack, Box, Separator } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "_hooks/useAuth";
import { Formik, FormikValues } from "formik";
import { VALIDATION } from "_types/index";
import { useEffect, useState } from "react";
import { StorageKey } from "_constants/StorageKeys";
import { CiMail } from "react-icons/ci";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { FcGoogle } from "react-icons/fc";

export const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const callbackUrl = useSearchParams()?.get("callbackUrl") || APP_ROUTES.HOME;
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setGoogleIsLoading] = useState(false);
  const { login } = useAuth();
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isRemember = localStorage.getItem(StorageKey.REMEMBER_ME);

      if (isRemember) {
        setInitialValues({
          email: localStorage.getItem(StorageKey.EMAIL) || "",
          password: localStorage.getItem(StorageKey.PASSWORD) || "",
          rememberMe: isRemember === "true",
        });
      }
    }
  }, []);

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true);
    if (values.rememberMe) {
      localStorage.setItem(StorageKey.REMEMBER_ME, "true");
      localStorage.setItem(StorageKey.EMAIL, values.email);
      localStorage.setItem(StorageKey.PASSWORD, values.password);
    } else {
      localStorage.removeItem(StorageKey.REMEMBER_ME);
      localStorage.removeItem(StorageKey.EMAIL);
      localStorage.removeItem(StorageKey.PASSWORD);
    }

    await login({
      email: values.email,
      password: values.password,
      callbackUrl,
    });
  };

  const handleGoogleLogin = async () => {
    setGoogleIsLoading(true);
    await login({
      providerType: "google",
      callbackUrl,
    });
  };

  return (
    <AuthBoxContainer
      title={"FORM.LOGIN_TITLE"}
      description={"FORM.LOGIN_DESC"}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values) => {
          await handleSubmit(values).then(() => setIsLoading(false));
        }}
        validationSchema={VALIDATION.AUTH.loginValidationSchema}
      >
        {({ values, handleSubmit }) => (
          <VStack width="full" mt={"20px"} gap={5}>
            <FormTextInput
              name="email"
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

            <HStack
              width="full"
              alignItems="center"
              mt={2}
              mb={2}
              justifyContent="space-between"
            >
              <CheckboxForm
                name="rememberMe"
                size="md"
                label={t("FORM.REMEMBER_ME")}
              />
              <Flex justifyContent={"flex-end"} width={"full"}>
                <BaseText
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={() => router.push(APP_ROUTES.AUTH.RESET_PASSWORD)}
                >
                  {t("FORM.FORGOT_PASSWORD")}
                </BaseText>
              </Flex>
            </HStack>

            <BaseButton
              mt={4}
              withGradient
              isLoading={isLoading}
              colorType={"primary"}
              onClick={() => {
                handleSubmit();
              }}
            >
              {t("COMMON.LOGIN")}
            </BaseButton>
            <HStack
              gap={"4"}
              width={"full"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Separator width={"full"} />
              OR
              <Separator width={"full"} />
            </HStack>

            <BaseButton
              variant={"outline"}
              width={"full"}
              colorType={"secondary"}
              isLoading={isGoogleLoading}
              leftIcon={<FcGoogle />}
              onClick={async () => {
                await handleGoogleLogin().then(() => setIsLoading(false));
              }}
            >
              Se connecter avec Google
            </BaseButton>

            <BaseText>
              Vous n'avez pas de compte ?{" "}
              <Box
                as="span"
                textDecoration="underline"
                cursor="pointer"
                color="primary.500"
                fontWeight="bold"
                onClick={() => router.push(APP_ROUTES.AUTH.SIGN_UP)}
              >
                {t("FORM.SIGN_UP")}
              </Box>
            </BaseText>
          </VStack>
        )}
      </Formik>
    </AuthBoxContainer>
  );
};
