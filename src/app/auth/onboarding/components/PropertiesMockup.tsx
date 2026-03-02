"use client";

import { Box, Flex, Grid, Text, HStack } from "@chakra-ui/react";
import { BaseTag, Icons } from "_components/custom";
import { useColorModeValue } from "_components/ui/color-mode";
import { motion } from "framer-motion";
import { TopBarMockup } from "./TopBarMockup";
import { VariablesColors } from "_theme/variables";

const MotionBox = motion(Box);
const MotionTag = motion(BaseTag);

export const PropertiesMockup = () => {
  const bg = useColorModeValue("white", "gray.400");
  const muted = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const properties = [
    {
      name: "Apt. Haussmann",
      address: "12 Rue de Rivoli, Paris",
      status: "Occupé",
      rent: "2 450€",
      emoji: "🏢",
    },
    {
      name: "Studio Marais",
      address: "8 Rue des Rosiers",
      status: "Occupé",
      rent: "1 200€",
      emoji: "🏠",
    },
    {
      name: "Loft Bastille",
      address: "45 Rue de la Roquette",
      status: "Vacant",
      rent: "3 100€",
      emoji: "🏗️",
    },
    {
      name: "T3 Montmartre",
      address: "22 Rue Lepic",
      status: "Occupé",
      rent: "1 850€",
      emoji: "🏘️",
    },
  ];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      border="1px solid"
      borderColor={border}
      bg={bg}
      rounded="2xl"
      overflow="hidden"
      shadow="xl"
    >
      <TopBarMockup
        border={border}
        muted={muted}
        link={"app.myimmo.com/properties"}
      />

      <Box p={4}>
        <Flex justify="space-between" mb={4}>
          <Text fontWeight="bold">Mes Propriétés</Text>
          <BaseTag color="purple" label="24 biens" borderRadius={"full"} />
        </Flex>

        <Grid templateColumns="repeat(2,1fr)" gap={3}>
          {properties.map((p, idx) => (
            <MotionBox
              key={p.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              bg={muted}
              p={3}
              rounded="xl"
              border="1px solid"
              borderColor={border}
            >
              <Text fontSize="md">{p.emoji}</Text>
              <Text fontWeight="medium" fontSize="x-small" mt={1} truncate>
                {p.name}
              </Text>
              <Text fontSize="xx-small" color={textMuted} truncate>
                {p.address}
              </Text>

              <Flex justify="space-between" mt={2}>
                <BaseTag
                  color={p.status === "Occupé" ? "green" : "orange"}
                  borderRadius={"full"}
                  label={p.status}
                />
                <Text fontWeight="medium" fontSize="sm">
                  {p.rent}
                </Text>
              </Flex>
            </MotionBox>
          ))}
        </Grid>

        <MotionBox
          mt={4}
          bg={muted}
          p={5}
          rounded="xl"
          border="1px solid"
          borderColor={border}
        >
          <HStack mb={2}>
            <Icons.World color={VariablesColors.primary} />
            <Text fontSize="x-small" fontWeight="medium">
              Répartition géographique
            </Text>
          </HStack>

          <HStack gap={3} justifyContent={"center"}>
            {["Paris 75%", "Lyon 15%", "Nice 10%"].map((loc, i) => (
              <MotionTag
                key={loc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                borderRadius={"full"}
                color="purple"
                label={loc}
                mt={3}
                fontSize={"x-small"}
              />
            ))}
          </HStack>
        </MotionBox>
      </Box>
    </MotionBox>
  );
};
