import { Formik } from "formik";
import {
  BaseButton,
  BaseModal,
  BaseText,
  FormOtpInput,
  ModalOpenProps,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { TbLockPassword } from "react-icons/tb";
import React, { FC } from "react";
import { maskValue } from "_components/custom/form/utils/maskValue";
import { Flex, Stack, useBreakpointValue, VStack } from "@chakra-ui/react";
import { VariablesColors } from "_theme/variables";
import { useTranslation } from "react-i18next";
import { useCountdown } from "_hooks/remainingTime";
import { RenderOtpTimeHelper } from "./utils/RenderOtpTimeHelper";

export interface IOTPModal extends ModalOpenProps {
  renewOtpCallback?: (values?: any, helpers?: any) => void;
  blockedTimeLeft?: number;
  closeButton?: boolean;
  isModal?: boolean;
  goBackCallback?: () => void;
  otpType?: "resetPassword" | "login";
}

export const OtpChallengeHandler: FC<IOTPModal> = ({
  isOpen,
  isLoading,
  callback = () => {},
  onChange,
  data,
  renewOtpCallback,
  blockedTimeLeft = 0,
  closeButton = true,
  isModal = true,
  otpType = "resetPassword",
  goBackCallback,
}) => {
  const { t } = useTranslation();
  const responsiveMode = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });
  const { remainingTime: blockRemaining, formatted: blockFormatted } =
    useCountdown(blockedTimeLeft ?? 0);
  const { remainingTime: otpRemaining, formatted: otpFormatted } = useCountdown(
    data?.expiresIn ?? 0,
  );

  const renderMaskEmail = (value: string) => {
    if (!value) return "";
    return maskValue(value, 5);
  };

  return (
    <Formik
      initialValues={{ otpCode: "" }}
      onReset={onChange}
      onSubmit={(values, helpers) => callback(values, helpers)}
    >
      {({ handleSubmit, resetForm }) =>
        isModal ? (
          <BaseModal
            iconBackgroundColor={"primary.800"}
            icon={<TbLockPassword size={18} />}
            title={"PROFILE.OTP_CHECK_TITLE"}
            closeOnInteractOutside={false}
            closeOnEscape={false}
            isOpen={isOpen}
            onChange={() => {
              onChange(!isOpen);
              resetForm();
            }}
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={blockRemaining > 0}
            ignoreFooter
            showCloseButton={closeButton}
          >
            <VStack gap={3} mb={5}>
              {otpType === "resetPassword" ? (
                <BaseText variant={TextVariant.L} weight={TextWeight.Black}>
                  {t("FORM.RESET_PASSWORD")}
                </BaseText>
              ) : null}
              <BaseText
                variant={TextVariant.S}
                lineHeight={"1.5"}
                textAlign={"justify"}
              >
                {otpType === "resetPassword"
                  ? t("FORM.RESET_PASSWORD_OTP_DESC", {
                      email: renderMaskEmail(data?.email ?? data?.user?.email),
                    })
                  : t("PROFILE.OTP_ACCOUNT_ENABLED_DESC", {
                      email: renderMaskEmail(data?.email ?? data?.user?.email),
                    })}
              </BaseText>
              <BaseText variant={TextVariant.S} textAlign={"justify"}>
                {t("FORM.RESET_PASSWORD_OTP_WARNING")}
              </BaseText>
            </VStack>
            <VStack gap={4}>
              <FormOtpInput
                name="otpCode"
                isDisabled={blockRemaining > 0}
                onChangeFunction={(otp: string[]) => {
                  if (otp?.length === 6) {
                    handleSubmit();
                  }
                }}
              />

              <RenderOtpTimeHelper
                blockRemaining={blockRemaining}
                otpRemaining={otpRemaining}
                blockFormatted={blockFormatted}
                otpFormatted={otpFormatted}
              />

              {blockRemaining <= 0 && renewOtpCallback && (
                <BaseText>
                  {t("PROFILE.OTP_RETRY")}{" "}
                  <span
                    style={{
                      color: VariablesColors.primary,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={renewOtpCallback}
                  >
                    {t("PROFILE.OTP_RESEND")}
                  </span>
                </BaseText>
              )}
            </VStack>
          </BaseModal>
        ) : (
          <>
            <BaseText variant={TextVariant.L} weight={TextWeight.Black}>
              {t("FORM.RESET_PASSWORD")}
            </BaseText>
            <Stack mt={4}>
              <BaseText variant={TextVariant.S} lineHeight={"1.5"}>
                {t("FORM.RESET_PASSWORD_OTP_DESC", {
                  email: renderMaskEmail(data?.email ?? data?.user?.email),
                })}
              </BaseText>
              <BaseText variant={TextVariant.S}>
                {t("FORM.RESET_PASSWORD_OTP_WARNING")}
              </BaseText>
            </Stack>
            <VStack gap={3} mt={"20px"} width={"full"}>
              <FormOtpInput name="otpCode" isDisabled={blockRemaining > 0} />
              <RenderOtpTimeHelper
                blockRemaining={blockRemaining}
                otpRemaining={otpRemaining}
                blockFormatted={blockFormatted}
                otpFormatted={otpFormatted}
              />
              {blockRemaining <= 0 && renewOtpCallback && (
                <BaseText>
                  {t("PROFILE.OTP_RETRY")}{" "}
                  <span
                    style={{
                      color: VariablesColors.primary,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={renewOtpCallback}
                  >
                    {t("PROFILE.OTP_RESEND")}
                  </span>
                </BaseText>
              )}
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
                  disabled={blockRemaining > 0}
                  p={responsiveMode ? "15px" : 0}
                >
                  {t("COMMON.VALIDATE")}
                </BaseButton>
                <BaseButton
                  withGradient
                  width={"full"}
                  variant={"outline"}
                  colorType={"success"}
                  onClick={goBackCallback}
                  p={responsiveMode ? "15px" : 0}
                >
                  {t("COMMON.BACK")}
                </BaseButton>
              </Flex>
            </VStack>
          </>
        )
      }
    </Formik>
  );
};
