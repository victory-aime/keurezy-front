import {
  Box,
  Container,
  Flex,
  Grid,
  Separator,
  Text,
  HStack,
  SimpleGrid,
  VStack,
  Span,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BaseButton, BaseText, Icons } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import Link from "next/link";
import { APP_ROUTES } from "_config/routes";

const MotionBox = motion.create(Box);

export const HeroSection = () => {
  return (
    <Box
      py={24}
      position="relative"
      display="flex"
      alignItems="center"
      overflow="hidden"
    >
      <Container mx="auto" px={{ base: 6, sm: 8 }} position="relative">
        <Grid
          gap={{ base: 10, sm: 16 }}
          alignItems="center"
          templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
        >
          {/* LEFT CONTENT */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <Flex
              align="center"
              gap={2}
              px={4}
              py={1.5}
              rounded="full"
              bg={hexToRGB("primary", 0.1)}
              color="primary"
              fontSize="sm"
              fontWeight="medium"
              w="fit-content"
              mb={3}
            >
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={VariablesColors.tertiary}
                animation="pulse 2s infinite"
                color={"primary.500"}
              />
              <BaseText color={"primary.500"} fontSize={"sm"}>
                Plateforme tout-en-un pour la gestion locative
              </BaseText>
            </Flex>

            {/* Title */}
            <Box
              fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
              fontWeight="extrabold"
              lineHeight="1.1"
              mb={3}
            >
              La Gestion locative
              <br />
              <Text>
                <Span
                  bgClip={"text"}
                  gradientFrom={"primary.400"}
                  gradientVia={"primary.500"}
                  gradientTo={"tertiary.500"}
                  bgGradient={"to-r"}
                  color={"transparent"}
                >
                  Intelligente
                </Span>{" "}
                pour tous
              </Text>
            </Box>

            {/* Description */}
            <Text
              fontSize="lg"
              color="gray.500"
              maxW="lg"
              lineHeight="tall"
              flexWrap={"wrap"}
              mb={8}
            >
              Une expérience fluide pour louer, gérer et développer vos
              investissements immobiliers. Locataires et propriétaires, tout est
              réuni sur une seule plateforme
            </Text>

            {/* Buttons */}
            <Flex flexDirection={{ base: "column", sm: "row" }} gap={4} mb={10}>
              <Link href={APP_ROUTES.AUTH.SIGN_UP}>
                <BaseButton
                  variant="outline"
                  leftIcon={<Icons.FaUsers />}
                  width={{ base: "full" }}
                >
                  Je suis Locataire
                </BaseButton>
              </Link>

              <Link href={APP_ROUTES.AUTH.ONBOARD}>
                <BaseButton
                  leftIcon={<Icons.RiBuildingLine />}
                  width={{ base: "full" }}
                >
                  Je suis Proprietaire
                </BaseButton>
              </Link>
            </Flex>

            {/* Stats */}
            <Flex
              width={"full"}
              align="center"
              justifyContent={"center"}
              gap={8}
              wrap={"wrap"}
            >
              <StatBlock value="2,500+" label="Propriétés gérées" />
              <Separator orientation="vertical" h="10" />
              <StatBlock value="98%" label="Satisfaction client" />
              <Separator orientation="vertical" h="10" />
              <StatBlock value="€50M+" label="Loyers collectés" />
            </Flex>
          </MotionBox>

          {/* RIGHT IMAGE */}

          {/* Dashboard mockup */}

          <MotionBox
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            mt={16}
            width={"full"}
            maxW="5xl"
            mx="auto"
            position="relative"
          >
            <Box
              borderRadius="xl"
              borderWidth="1px"
              bg="white"
              shadow="xl"
              overflow="hidden"
            >
              {/* Top bar */}
              <Flex
                align="center"
                gap={2}
                px={4}
                py={3}
                borderBottomWidth="1px"
                bg="gray.50"
              >
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg="red.400"
                  opacity={0.6}
                />
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg="yellow.400"
                  opacity={0.6}
                />
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg="green.400"
                  opacity={0.6}
                />
                <Text ml={2} fontSize="xs" color="gray.500">
                  my-immo.dashboard.app
                </Text>
              </Flex>

              <Box p={6}>
                {/* KPI GRID */}
                <SimpleGrid columns={{ base: 2, sm: 2, lg: 4 }} gap={4}>
                  {[
                    { label: "Revenus", value: "€12,450", color: "blue" },
                    { label: "Occupation", value: "94%", color: "primary" },
                    { label: "Locataires", value: "28", color: "success" },
                    { label: "Biens", value: "12", color: "warning" },
                  ].map((kpi) => (
                    <Box
                      key={kpi.label}
                      borderRadius="lg"
                      p={4}
                      bg={`${kpi.color}.100`}
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="medium"
                        opacity={0.7}
                        color={`${kpi.color}.600`}
                      >
                        {kpi.label}
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        mt={1}
                        color={`${kpi.color}.700`}
                      >
                        {kpi.value}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Charts + Activity */}
                <SimpleGrid columns={{ base: 1, sm: 1, lg: 3 }} gap={4} mt={6}>
                  {/* Bar chart mock */}
                  <Flex
                    gridColumn="span 2"
                    h="128px"
                    borderRadius="lg"
                    bg="gray.50"
                    borderWidth="1px"
                    align="flex-end"
                    p={4}
                    gap={1}
                  >
                    {[40, 65, 55, 80, 70, 90, 85, 75, 95, 88, 92, 78].map(
                      (h, i) => (
                        <MotionBox
                          key={i}
                          flex="1"
                          borderRadius="sm"
                          bg="primary.300"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
                        />
                      ),
                    )}
                  </Flex>

                  {/* Activity panel */}
                  <Flex
                    borderRadius="lg"
                    bg="gray.50"
                    borderWidth="1px"
                    p={4}
                    direction="column"
                    justify="space-between"
                    width={"full"}
                  >
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Activité récente
                    </Text>

                    <VStack align="start" gap={2} width={"full"}>
                      {["Loyer reçu", "Nouveau bail", "Maintenance"].map(
                        (item) => (
                          <HStack key={item} gap={2}>
                            <Box
                              w={1.5}
                              h={1.5}
                              borderRadius="full"
                              bg="purple.400"
                            />
                            <Text fontSize="xs" color="gray.500">
                              {item}
                            </Text>
                          </HStack>
                        ),
                      )}
                    </VStack>
                  </Flex>
                </SimpleGrid>
              </Box>
            </Box>

            <Box
              position="absolute"
              bottom="-32px"
              left="50%"
              transform="translateX(-50%)"
              w="75%"
              h="64px"
              bg="primary.200"
              opacity={0.3}
              filter="blur(60px)"
              borderRadius="full"
            />
          </MotionBox>
        </Grid>
      </Container>
    </Box>
  );
};

const StatBlock = ({ value, label }: { value: string; label: string }) => (
  <Box>
    <Text fontSize="2xl" fontWeight="bold">
      {value}
    </Text>
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
  </Box>
);
