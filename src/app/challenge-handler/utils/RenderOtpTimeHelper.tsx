import { VStack } from "@chakra-ui/react";
import { BaseText, TextVariant } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { useTranslation } from "react-i18next";

export const RenderOtpTimeHelper = ({
  blockRemaining,
  otpRemaining,
  blockFormatted,
  otpFormatted,
}: {
  otpRemaining: number;
  blockRemaining: number;
  otpFormatted: string;
  blockFormatted: string;
}) => {
  const { t } = useTranslation();

  return (
    <VStack mt={4} gap={3}>
      {blockRemaining > 0 ? (
        <VStack>
          <BaseText variant={TextVariant.S} color={VariablesColors.error}>
            {t("PROFILE.OTP_MAX_SEND_ATTEMPTS")}
          </BaseText>
          <BaseText variant={TextVariant.S} color={VariablesColors.info}>
            {t("PROFILE.OTP_RETRY_INFO", { time: blockFormatted })}
          </BaseText>
        </VStack>
      ) : otpRemaining > 0 ? (
        <BaseText
          variant={TextVariant.S}
          color={VariablesColors.info}
          textAlign="center"
        >
          {t("PROFILE.OTP_EXPIRES_IN", { expiresIn: otpFormatted })}
        </BaseText>
      ) : null}
    </VStack>
  );
};
