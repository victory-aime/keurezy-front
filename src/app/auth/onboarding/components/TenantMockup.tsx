import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Circle,
  Span,
} from "@chakra-ui/react";
import { BaseTag, Icons } from "_components/custom";
import { Avatar } from "_components/ui/avatar";
import { useColorModeValue } from "_components/ui/color-mode";
import { VariablesColors } from "_theme/variables";
import { motion } from "framer-motion";
import { TopBarMockup } from "./TopBarMockup";
import { Colors, hexToRGB } from "_theme/colors";

const MotionBox = motion(Box);

export const TenantsMockup = () => {
  const bg = useColorModeValue("white", "gray.900");
  const muted = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const tenants = [
    {
      name: "Marc Laurent",
      property: "Apt. Haussmann",
      since: "Jan 2023",
      status: "Actif",
      score: 98,
    },
    {
      name: "Sophie Petit",
      property: "Studio Marais",
      since: "Mar 2023",
      status: "Actif",
      score: 95,
    },
    {
      name: "Carlos Garcia",
      property: "Loft Bastille",
      since: "Jun 2024",
      status: "Nouveau",
      score: 88,
    },
  ];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      bg={bg}
      border="1px solid"
      borderColor={border}
      rounded="2xl"
      shadow="xl"
      overflow="hidden"
    >
      <TopBarMockup
        border={border}
        muted={muted}
        link={"app.rentflow.com/tenants"}
      />

      <Box spaceY={3} py={4} px={3}>
        {/* Stats row */}
        <Flex gap={2}>
          {[
            {
              icon: Icons.FaUsers,
              label: "Locataires",
              value: "47",
              bg: "primary",
              color: VariablesColors.primary,
            },
            {
              icon: Icons.Star,
              label: "Satisfaction",
              value: "4.8/5",
              bg: "secondary",
              color: VariablesColors.secondary,
            },
            {
              icon: Icons.Paper,
              label: "Baux actifs",
              value: "44",
              bg: "tertiary",
              color: VariablesColors.tertiary,
            },
          ].map((stat, idx) => (
            <MotionBox
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              p={2.5}
              display={"flex"}
              width={"full"}
              alignItems={"center"}
              gap={2}
              rounded={"xl"}
              bgColor={hexToRGB(stat.bg as keyof Colors, 0.1)}
            >
              <stat.icon color={stat.color} />
              <div>
                <Text fontSize={"sm"} fontWeight={"bold"} color={stat.color}>
                  {stat.value}
                </Text>
                <Text fontSize={"xx-small"} color={textMuted}>
                  {stat.label}
                </Text>
              </div>
            </MotionBox>
          ))}
        </Flex>
      </Box>
      <VStack px={3} gap={2} align="stretch">
        {tenants.map((t, i) => (
          <MotionBox
            key={t.name}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            bg={muted}
            p={3}
            rounded="xl"
            border="1px solid"
            borderColor={border}
            _hover={{
              borderColor: VariablesColors.primary,
            }}
          >
            <Flex justify="space-between">
              <HStack>
                <Avatar
                  name={t.name}
                  size={"xs"}
                  fontSize={"xx-small"}
                  bg="purple.200"
                />

                <Box>
                  <Text fontWeight="medium" fontSize="xs">
                    {t.name}
                  </Text>
                  <Text fontSize="xx-small" color={textMuted}>
                    {t.property} · Depuis {t.since}
                  </Text>
                </Box>
              </HStack>

              <Box textAlign="right">
                <BaseTag
                  color={t.status === "Actif" ? "green" : "orange"}
                  label={t.status}
                  borderRadius={"full"}
                />

                <Flex gap={1} alignItems={"center"}>
                  <Box mt={2} w="60px" h="4px" bg="gray.300" rounded="full">
                    <MotionBox
                      initial={{ width: 0 }}
                      animate={{ width: `${t.score}%` }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      h="full"
                      bg="tertiary.500"
                      rounded="full"
                    />
                  </Box>
                  <Span fontSize={"xx-small"}>{t.score}%</Span>
                </Flex>
              </Box>
            </Flex>
          </MotionBox>
        ))}
      </VStack>

      {/* Activity feed */}
      <Box py={4} px={3}>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          rounded={"xl"}
          border={border}
          p={4}
          bg={muted}
        >
          <Flex mb={2} alignItems={"center"} gap={2}>
            <Icons.Chat color={VariablesColors.primary} />
            <Span fontWeight={"medium"} fontSize={"xx-small"}>
              Activité récente
            </Span>
          </Flex>
          {[
            {
              text: "M. Laurent a payé son loyer",
              time: "Il y a 2h",
              dot: "tertiary.500",
            },
            {
              text: "Demande de maintenance #45",
              time: "Il y a 5h",
              dot: "secondary.500",
            },
            {
              text: "Bail de Mme. Dubois renouvelé",
              time: "Hier",
              dot: "primary.500",
            },
          ].map((a, i) => (
            <MotionBox
              key={a.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              display={"flex"}
              gap={3}
              py={1}
              alignItems={"center"}
            >
              <Circle h={1.5} width={1.5} bgColor={a.dot} />
              <Span fontSize={"xx-small"} color={textMuted} flex={1}>
                {a.text}
              </Span>
              <Span fontSize={"xx-small"} color={textMuted}>
                {a.time}
              </Span>
            </MotionBox>
          ))}
        </MotionBox>
      </Box>
    </MotionBox>
  );
};
