import { VStack, Box } from "@chakra-ui/react";
import { BaseText } from "_components/custom";
import { MotionBox } from "_constants/motion";
import React from "react";
import { AnimatedCheckmark } from "../../../auth/onboarding/components/AnimatedCheck";
import { confettiColors } from "../../../auth/onboarding/components/FinalStep";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useFormikContext } from "formik";
import { IInviteTeamUserInfo } from "../constants/team";

export const InviteTeamFinalStep = () => {
  const { values } = useFormikContext<{
    account: IInviteTeamUserInfo;
  }>();
  const { width, height } = useWindowSize();
  return (
    <VStack
      maxW={"5xl"}
      mx={"auto"}
      spaceY={8}
      position={"relative"}
      overflow={"hidden"}
    >
      <Box
        position={"fixed"}
        inset={0}
        pointerEvents={"none"}
        zIndex={50}
        overflow={"hidden"}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <Confetti
            key={i}
            width={width}
            height={height}
            numberOfPieces={4}
            recycle={false}
            colors={confettiColors}
          />
        ))}
      </Box>

      {/* Checkmark */}
      <AnimatedCheckmark />

      {/* Title */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        spaceY={3}
        textAlign={"center"}
      >
        <BaseText fontSize={{ base: "4xl", sm: "5xl" }} fontWeight={"bold"}>
          🎉 Invitation envoyée !
        </BaseText>
        <BaseText fontSize={"lg"} maxW={"lg"} mx={"auto"}>
          Un e-mail d'invitation a été envoyé à {values.account.email}. Ce
          membre recevra un lien pour rejoindre votre espace en tant que{" "}
          {values.account.role}.
        </BaseText>
      </MotionBox>
    </VStack>
  );
};
