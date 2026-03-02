import {
  Grid,
  VStack,
  Flex,
  Heading,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { useColorMode } from "_components/ui/color-mode";
import { hexToRGB } from "_theme/colors";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useState } from "react";
import { DashboardMockup } from "./DashboardMockup";
import { OnboardCardWrapper } from "./OnboardCardWrapper";

const StepPersonalize = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("€");
  const [darkMode, setDarkMode] = useState(false);
  const [teamEmail, setTeamEmail] = useState("");

  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {({}) => (
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={8}
          maxW="6xl"
          mx="auto"
          alignItems="start"
        >
          <VStack gap={6} align="stretch">
            <VStack gap={2} align="flex-start">
              <Flex
                bgColor={hexToRGB("secondary", 0.1)}
                color={"secondary.500"}
                borderRadius="full"
                px={3}
                py={1}
                alignItems="center"
                gap={1}
              >
                <Icons.Zap size={11} />
                Préférences
              </Flex>
              <Heading size="lg">Customize Your Experience</Heading>
              <Text color="gray.500">
                Le tableau de bord reflète instantanément vos choix
              </Text>
            </VStack>

            <OnboardCardWrapper></OnboardCardWrapper>
          </VStack>

          <Box position="sticky" top="96px">
            <HStack gap={2} mb={3}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Box h="8px" w="8px" borderRadius="full" bg="tertiary.400" />
              </motion.div>
              <Text fontSize="xs" color="gray.500">
                Aperçu en direct
              </Text>
            </HStack>
            <DashboardMockup
              currency={currency}
              //darkMode={false}
              notifications={notifications}
              animated={false}
            />
          </Box>
        </Grid>
      )}
    </Formik>
  );
};
