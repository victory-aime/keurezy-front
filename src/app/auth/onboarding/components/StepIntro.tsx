import {
  Grid,
  VStack,
  Flex,
  Heading,
  Span,
  HStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { DashboardMockup } from "./DashboardMockup";
import { OnboardCardWrapper } from "./OnboardCardWrapper";
import { motion } from "framer-motion";
import { GridContainer } from "./GridContainer";

/* ═══════════════ STEP 1: Introduction ═══════════════ */

const MotionBox = motion.create(Box);

export const StepIntro = () => (
  <GridContainer gap={{ base: 8, lg: 12 }}>
    <VStack gap={6} align="flex-start">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Flex
          bgColor={hexToRGB("primary", 0.1)}
          color={"primary.500"}
          borderRadius="full"
          px={3}
          py={1}
          alignItems="center"
          gap={1}
        >
          <Icons.TbSparkles />
          Bienvenue
        </Flex>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Heading
          fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
          fontWeight="bold"
          lineHeight="1"
        >
          MyImmo est la plateforme de gestion intelligente des locations pour{" "}
          <Span
            bgClip={"text"}
            gradientFrom={"primary.400"}
            gradientVia={"primary.500"}
            gradientTo={"tertiary.500"}
            bgGradient={"to-r"}
            color={"transparent"}
          >
            les locataires et les propriétaires immobiliers
          </Span>
        </Heading>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Text color="gray.500" fontSize="lg" lineHeight="relaxed">
          Une expérience fluide pour louer, gérer et développer vos
          investissements immobiliers. Une plateforme puissante conçue pour
          simplifier vos opérations locatives.
        </Text>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        width={"full"}
      >
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {[
            { icon: Icons.RiBuildingLine, label: "Biens gérés", value: "10K+" },
            { icon: Icons.FaUsers, label: "Utilisateurs", value: "2.5K+" },
            { icon: Icons.Star, label: "Satisfaction", value: "4.9/5" },
          ].map((stat, i) => (
            <MotionBox
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <OnboardCardWrapper textAlign="center">
                <Flex justify="center" mb={1.5}>
                  <stat.icon size={20} color={VariablesColors.primary} />
                </Flex>
                <Text fontSize="xl" fontWeight="bold">
                  {stat.value}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {stat.label}
                </Text>
              </OnboardCardWrapper>
            </MotionBox>
          ))}
        </Grid>
      </MotionBox>
    </VStack>

    <MotionBox
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      position={"relative"}
    >
      <MotionBox
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DashboardMockup animated />
      </MotionBox>

      {/* Floating badges */}
      <MotionBox
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        position={"absolute"}
        top={"-12px"}
        right={"-8px"}
        zIndex={10}
      >
        <OnboardCardWrapper p={2}>
          <HStack gap={2}>
            <Icons.Bell size={18} color={VariablesColors.primary} />
            <Text fontSize="xs" fontWeight="medium">
              3 alertes
            </Text>
          </HStack>
        </OnboardCardWrapper>
      </MotionBox>

      <MotionBox
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        position={"absolute"}
        bottom={"-8px"}
        left={"-8px"}
        zIndex={10}
      >
        <OnboardCardWrapper p={2}>
          <HStack gap={2}>
            <Icons.Check color={VariablesColors.tertiary} />
            <Text fontSize="xs" fontWeight="medium">
              Loyer encaissé
            </Text>
          </HStack>
        </OnboardCardWrapper>
      </MotionBox>
    </MotionBox>
  </GridContainer>
);
