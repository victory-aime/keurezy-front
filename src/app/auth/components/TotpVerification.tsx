"use client";

import { Formik, FormikValues } from "formik";
import { BaseButton, FormOtpInput } from "_components/custom";
import React, { useState } from "react";
import { Flex, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { authClient } from "../../lib/auth-client";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { handleApiError } from "_utils/handleApiError";

export const TotpVerification = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const responsiveMode = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (value: FormikValues) => {
    try {
      setIsLoading(true);
      const { data } = await authClient.twoFactor.verifyTotp({
        code: value?.totpCode.join(""),
      });
      if (data?.token) {
        router.replace(APP_ROUTES.HOME);
      }
    } catch (e) {
      console.log("error", e);
      handleApiError({
        status: 400,
        message: "Impossible de verifier le code fournie veuillez ressayer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik initialValues={{ otpCode: "" }} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <AuthBoxContainer
          title={"FORM.RESET_PASSWORD"}
          description={"FORM.RESET_PASSWORD_OTP_DESC"}
        >
          <VStack gap={3} width={"full"}>
            <FormOtpInput name="totpCode" isDisabled={isLoading} />
            <Flex
              gap={4}
              alignItems={"center"}
              justifyContent={"center"}
              flexDir={"row-reverse"}
              mt={"20px"}
            >
              <BaseButton
                withGradient
                width={"full"}
                colorType={"success"}
                onClick={() => handleSubmit()}
                isLoading={isLoading}
                disabled={isLoading}
                p={responsiveMode ? "15px" : 0}
              >
                {t("COMMON.VALIDATE")}
              </BaseButton>
              <BaseButton
                withGradient
                width={"full"}
                variant={"outline"}
                colorType={"success"}
                onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
                p={responsiveMode ? "15px" : 0}
              >
                {t("COMMON.BACK")}
              </BaseButton>
            </Flex>
          </VStack>
        </AuthBoxContainer>
      )}
    </Formik>
  );
};
