import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Separator,
  Text,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BaseButton, BaseText, Icons } from "_components/custom";
import { ASSETS } from "_assets/images";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import Link from "next/link";
import { APP_ROUTES } from "_config/routes";

const MotionBox = motion(Box);

export const HeroSection = () => {
  return (
    <Box
      position="relative"
      minH="90vh"
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
              <BaseText color={"primary.500"}>
                Nouveau : Paiements automatisés
              </BaseText>
            </Flex>

            {/* Title */}
            <Box
              fontSize={{ base: "4xl", sm: "5xl", lg: "6xl" }}
              fontWeight="extrabold"
              lineHeight="1.1"
              mb={3}
            >
              Gérez vos biens
              <br />
              <Text
                bg={`linear-gradient(to-r,${VariablesColors.primary} , ${VariablesColors.tertiary})`}
              >
                en toute simplicité
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
              La plateforme tout-en-un pour les propriétaires et gestionnaires
              immobiliers. Automatisez la collecte des loyers, suivez vos
              locataires et optimisez votre rendement.
            </Text>

            {/* Buttons */}
            <Flex wrap="wrap" gap={4} mb={10}>
              <Link href={APP_ROUTES.AUTH.SIGN_UP}>
                <BaseButton size="lg" rightIcon={<Icons.ArrowRight />}>
                  Commencer gratuitement
                </BaseButton>
              </Link>

              <Link href={APP_ROUTES.APPARTEMENTS}>
                <BaseButton variant="outline" leftIcon={<Icons.Play />}>
                  Explorer les biens
                </BaseButton>
              </Link>
            </Flex>

            {/* Stats */}
            <Flex width={"full"} align="center" gap={8} wrap={"wrap"}>
              <StatBlock value="2,500+" label="Propriétés gérées" />
              <Separator orientation="vertical" h="10" />
              <StatBlock value="98%" label="Satisfaction client" />
              <Separator orientation="vertical" h="10" />
              <StatBlock value="€50M+" label="Loyers collectés" />
            </Flex>
          </MotionBox>

          {/* RIGHT IMAGE */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            position="relative"
            display={{ base: "none", sm: "block" }}
          >
            <Box
              position="relative"
              rounded="2xl"
              overflow="hidden"
              boxShadow="2xl"
            >
              <Image
                src={ASSETS.HERO}
                alt="Gestion immobilière moderne"
                w="100%"
                objectFit="cover"
              />

              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(to-t, blackAlpha.400, transparent)"
              />
            </Box>

            {/* Floating Card */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              position="absolute"
              bottom="-6"
              left="-6"
              bg="white"
              rounded="xl"
              p={3}
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.200"
            >
              <Flex align="center" gap={3}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  rounded="full"
                  bg={hexToRGB("tertiary", 0.1)}
                  boxSize={"60px"}
                >
                  <Text fontWeight="bold" color="tertiary.500">
                    +12%
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold">
                    Rendement moyen
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Sur les 12 derniers mois
                  </Text>
                </Box>
              </Flex>
            </MotionBox>
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
