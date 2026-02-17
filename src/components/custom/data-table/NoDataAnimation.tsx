import { Center, Flex } from "@chakra-ui/react";
import { BaseText, TextVariant } from "_components/custom";
import { NoDataFoundLottieAnimation } from "_lottie/animations/LottieAnimation";
import React from "react";
import { useTranslation } from "react-i18next";

export const NoDataAnimation = ({
  animationType = "folder",
}: {
  animationType?: "folder" | "trash";
}) => {
  let content = null;
  const { t } = useTranslation();

  switch (animationType) {
    case "trash":
      content = (
        <>
          <Flex alignItems="center" justifyContent="center" width="50%" mt={20}>
            {/* <TrashLottieAnimationV2 /> */}
          </Flex>
          <BaseText variant={TextVariant.M}>{t("COMMON.NO_DATA")}</BaseText>
        </>
      );
      break;

    case "folder":
      content = (
        <>
          <Flex
            alignItems="center"
            justifyContent="center"
            width={{ base: "full", lg: "300px" }}
          >
            <NoDataFoundLottieAnimation />
          </Flex>
          <BaseText variant={TextVariant.M}>{t("COMMON.NO_DATA")}</BaseText>
        </>
      );
      break;

    default:
      return null;
  }

  return (
    <Center flexDir="column" gap={4}>
      {content}
    </Center>
  );
};
