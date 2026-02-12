"use client";

import { Formik, FormikHelpers, FormikValues } from "formik";
import { BaseButton, BaseText, FormOtpInput } from "_components/custom";
import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { useAuth } from "_hooks/useAuth";
import { useTotp } from "_hooks/useTotp";
import { VALIDATION } from "_types/";

export const TotpVerification = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout, isLoading: logoutLoading } = useAuth();
  const { verifyTotp, isLoading } = useTotp();

  const handleValidateTotp = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => {
    try {
      const result = await verifyTotp(values.totpCode.join(""));
      if (!result || "status" in result) {
        if (result?.status === 401 || result?.status === 400) {
          formikHelpers?.setFieldError("totpCode", "Code invalide ou expiré");
        } else {
          formikHelpers?.setFieldError(
            "totpCode",
            result?.message ?? "Une erreur est survenue",
          );
        }
        return;
      }
      if (result.token) {
        router.replace(APP_ROUTES.REDIRECT);
      }
    } catch (error) {
      formikHelpers?.setFieldError("totpCode", t("COMMON.SERVER_ERROR"));
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ totpCode: Array(6).fill("") }}
      onSubmit={async (values, formikHelpers) =>
        await handleValidateTotp(
          values,
          formikHelpers as FormikHelpers<FormikValues>,
        )
      }
      validationSchema={VALIDATION.TOTP_VALIDATION.totpValidationSchema}
    >
      {({ handleSubmit }) => (
        <AuthBoxContainer
          title={"Confirmer votre compte"}
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
          <VStack gap={3} width={"full"}>
            <FormOtpInput
              name="totpCode"
              isDisabled={isLoading}
              onChangeFunction={handleSubmit}
            />
            <BaseText color={"gray.400"}>
              Veuillez saisir le code affiche sur votre application
              d'authentification
            </BaseText>

            <BaseButton
              width={"full"}
              onClick={() => handleSubmit()}
              colorType={"primary"}
              isLoading={isLoading}
              disabled={isLoading || logoutLoading}
            >
              Continue
            </BaseButton>
            <BaseButton
              width={"full"}
              variant={"outline"}
              colorType={"danger"}
              onClick={() => logout(APP_ROUTES.AUTH.SIGN_IN)}
              isLoading={logoutLoading}
              disabled={isLoading || logoutLoading}
            >
              {t("COMMON.LOGOUT")}
            </BaseButton>
          </VStack>
        </AuthBoxContainer>
      )}
    </Formik>
  );
};
