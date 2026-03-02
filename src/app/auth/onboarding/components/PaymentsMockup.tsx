import { Box, Flex, Grid, Separator, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "_components/ui/color-mode";
import { motion } from "framer-motion";
import { TopBarMockup } from "./TopBarMockup";
import { ENUM } from "_types/*";

const MotionBox = motion(Box);

export const PaymentsMockup = () => {
  const bg = useColorModeValue("white", "gray.900");
  const muted = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const transactions = [
    {
      tenant: "M. Laurent",
      property: "Apt. Haussmann",
      amount: "+2 450€",
      date: "01/02",
    },
    {
      tenant: "Mme. Petit",
      property: "Studio Marais",
      amount: "+1 200€",
      date: "01/02",
    },
    {
      tenant: "M. Garcia",
      property: "Loft Bastille",
      amount: "En attente",
      date: "—",
    },
  ];

  const bars = [65, 72, 58, 80, 75, 90, 85, 88, 92, 78, 95, 98];

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
        link={"app.myimmo.com/payments"}
      />
      <Box p={4}>
        <Grid templateColumns="repeat(3,1fr)" gap={3} mb={4}>
          {[
            { label: "Ce mois", value: "32.4K€", color: "primary.500" },
            { label: "Encaissé", value: "98%", color: "tertiary.500" },
            { label: "En retard", value: "1", color: "red.500" },
          ].map((item, i) => (
            <MotionBox
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              bg={muted}
              p={3}
              rounded="xl"
              textAlign="center"
            >
              <Text fontWeight="bold" color={item.color}>
                {item.value}
              </Text>
              <Text fontSize="x-small" color={textMuted}>
                {item.label}
              </Text>
            </MotionBox>
          ))}
        </Grid>

        <Box bg={muted} p={3} rounded="xl">
          <Text fontSize="x-small">
            Revenus mensuels ({ENUM.COMMON.Currency.XOF})
          </Text>
          <Flex align="flex-end" h="80px" gap={1}>
            {bars.map((h, i) => (
              <MotionBox
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.2 + i * 0.03 }}
                flex="1"
                bgGradient="to-r"
                gradientFrom="primary.300"
                gradientTo="primary.200"
                roundedTop="md"
              />
            ))}
          </Flex>
        </Box>

        <Box bg={muted} mt={5} rounded={"xl"}>
          <Text py={3} px={2} fontSize={"xs"}>
            Dernières transactions
          </Text>

          <VStack
            gap={1}
            align="stretch"
            borderTop="1px solid"
            borderColor={"border"}
            p={3}
          >
            {transactions.map((tx, i) => (
              <Box key={tx.tenant}>
                <MotionBox
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  rounded="xl"
                >
                  <Flex justify="space-between">
                    <Box>
                      <Text fontSize="xs">{tx.tenant}</Text>
                      <Text fontSize="xx-small" color={textMuted}>
                        {tx.property}
                      </Text>
                    </Box>

                    <Box textAlign="right">
                      <Text
                        fontSize={"xs"}
                        color={
                          tx.amount === "En attente"
                            ? "secondary.500"
                            : "tertiary.500"
                        }
                        fontWeight="bold"
                      >
                        {tx.amount}
                      </Text>
                      <Text fontSize="xx-small" color={textMuted}>
                        {tx.date}
                      </Text>
                    </Box>
                  </Flex>
                </MotionBox>

                {i < transactions.length - 1 && (
                  <Separator my={2} borderColor="border" />
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </MotionBox>
  );
};
