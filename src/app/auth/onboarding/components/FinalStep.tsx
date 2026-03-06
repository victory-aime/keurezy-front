"use client";

import { Box, VStack } from "@chakra-ui/react";
import { BaseText, Icons } from "_components/custom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { VariablesColors } from "_theme/variables";
import { AnimatedCheckmark } from "./AnimatedCheck";
import { MotionBox } from "_constants/motion";

/* ═══════════════ STEP 6: Celebration ═══════════════ */

const confettiColors = [
  VariablesColors.primary,
  VariablesColors.secondary,
  VariablesColors.tertiary,
  VariablesColors.red,
];

export const OnboardFinish = () => {
  const { width, height } = useWindowSize();

  const summaryItems = [
    {
      icon: Icons.RiBuildingLine,
      label: "Propriétés configurées",
      value: "12",
      color: VariablesColors.primary,
    },
    {
      icon: Icons.TrendingUp,
      label: "Revenus projetés",
      value: "29 400€/mois",
      color: VariablesColors.tertiary,
    },
    {
      icon: Icons.Bell,
      label: "Notifications",
      value: "Activées",
      color: VariablesColors.secondary,
    },
  ];

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
          🎉 Tout est prêt !
        </BaseText>
        <BaseText fontSize={"lg"} maxW={"lg"} mx={"auto"}>
          Votre plateforme de gestion locative est prête. Nous pouvons
          commencer.
        </BaseText>
      </MotionBox>

      {/* Mini dashboard preview
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        mx={"auto"}
      >
        <DashboardMockup animated notifications />
      </MotionBox> */}
    </VStack>
  );
};
