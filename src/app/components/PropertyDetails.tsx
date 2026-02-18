"use client";
import {
  BaseBadge,
  BaseButton,
  BaseFormatNumber,
  BaseRatio,
  BaseText,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { motion } from "framer-motion";
import { useState } from "react";
import { properties } from "./Properties";
import { Navbar } from "./NavBar";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  VStack,
  Image,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Footer } from "../layout/Footer";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import { APP_ROUTES } from "_config/routes";
import { UserLayout } from "../layout/Layout";
import { VariablesColors } from "_theme/variables";
import { useAuth } from "_hooks/useAuth";
import { useAuthContext } from "_context/auth-context";

const InfoItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <Flex align="center" gap={2}>
    <Box color="gray.500">{icon}</Box>
    <BaseText weight={TextWeight.Medium}>{label}</BaseText>
  </Flex>
);

const PriceRow = ({ label, value }: { label: string; value: number }) => (
  <Flex justify="space-between" color="gray.500">
    <BaseText>{label}</BaseText>
    <BaseText weight={TextWeight.Medium} color="black">
      <BaseFormatNumber value={value} />
    </BaseText>
  </Flex>
);

export const PropertyDetails = ({ id }: { id: string }) => {
  const MotionBox = motion(Box);
  const property = properties.find((p) => p.id === id);
  const { session } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!property) {
    return (
      <UserLayout>
        <VStack>
          <NoDataAnimation />
          <Link href={APP_ROUTES.APPARTEMENTS}>
            <BaseButton mt={4}>Retour aux propriétés</BaseButton>
          </Link>
        </VStack>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Container
        mx={"auto"}
        px={{ base: 6, sm: 8 }}
        py={{ base: 10, sm: 6 }}
        overflow={"hidden"}
      >
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href={APP_ROUTES.APPARTEMENTS}>
            <HStack
              gap={2}
              color={"gray.400"}
              _hover={{ color: VariablesColors.primary }}
              width={"fit-content"}
            >
              <Icons.IoIosArrowRoundBack />
              Retour aux propriétés
            </HStack>
          </Link>

          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 300px" }}
            gap={4}
            mb={10}
            mt={{ base: 4, sm: 5 }}
          >
            {/* Main Image */}
            <Box rounded="xl" overflow="hidden">
              <BaseRatio
                image={property.images[selectedImage]}
                ratio={16 / 10}
              />
            </Box>
            {/* Image Gallery */}
            <Grid
              templateColumns={{ base: "repeat(3, 1fr)", lg: "1fr" }}
              gap={2}
            >
              {property.images.map((img, i) => (
                <Box
                  as="button"
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  rounded="lg"
                  overflow="hidden"
                  aspectRatio={4 / 3}
                  border="2px solid"
                  borderColor={
                    selectedImage === i ? "primary.500" : "transparent"
                  }
                  opacity={selectedImage === i ? 1 : 0.6}
                  transition="all 0.2s ease"
                  _hover={{
                    opacity: 1,
                  }}
                >
                  <Image src={img} alt="" w="100%" h="100%" objectFit="cover" />
                </Box>
              ))}
            </Grid>
          </Grid>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 380px" }} gap={10}>
            {/* LEFT SIDE */}
            <Stack gap={4}>
              {/* Header */}
              <Box>
                <Flex align="center" gap={3} mb={3}>
                  <BaseBadge
                    color={property.available ? "tertiary" : "danger"}
                    label={property.available ? "Disponible" : "Loué"}
                  />

                  <BaseBadge
                    color={"neutral"}
                    label={
                      property.type.charAt(0).toUpperCase() +
                      property.type.slice(1)
                    }
                  />
                </Flex>

                <BaseText
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  weight={TextWeight.Bold}
                  mb={2}
                >
                  {property.title}
                </BaseText>

                <Flex align="center" gap={1.5} color="gray.500">
                  <Icons.MapPin size={16} />
                  <BaseText variant={TextVariant.S}>
                    {property.location}
                  </BaseText>
                </Flex>
              </Box>

              {/* Property Info */}
              <Flex
                gap={6}
                py={4}
                borderY="1px solid"
                borderColor="gray.200"
                wrap="wrap"
              >
                <InfoItem
                  icon={<Icons.Bed size={20} />}
                  label={`${property.beds} Chambre${property.beds > 1 ? "s" : ""}`}
                />
                <InfoItem
                  icon={<Icons.Bath size={20} />}
                  label={`${property.baths} SdB`}
                />
                <InfoItem
                  icon={<Icons.Maximize size={20} />}
                  label={`${property.surface}m²`}
                />
              </Flex>

              {/* Description */}
              <Box>
                <BaseText
                  variant={TextVariant.L}
                  weight={TextWeight.SemiBold}
                  mb={2}
                >
                  Description
                </BaseText>
                <BaseText color="gray.500" lineHeight="relaxed">
                  {property.description}
                </BaseText>
              </Box>

              {/* Features */}
              <Box>
                <BaseText
                  variant={TextVariant.L}
                  weight={TextWeight.SemiBold}
                  mb={2}
                >
                  Caractéristiques
                </BaseText>

                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  {property.features.map((f) => (
                    <Flex
                      key={f}
                      align="center"
                      gap={2}
                      fontSize="sm"
                      color="gray.500"
                    >
                      <Icons.Check size={16} color={VariablesColors.tertiary} />
                      <Text>{f}</Text>
                    </Flex>
                  ))}
                </Grid>
              </Box>

              {/* Amenities */}
              <Box>
                <Text fontSize="xl" fontWeight="semibold" mb={4}>
                  Équipements
                </Text>

                <Flex wrap="wrap" gap={2}>
                  {property.amenities.map((a) => (
                    <BaseBadge key={a} color="secondary" label={a} />
                  ))}
                </Flex>
              </Box>
            </Stack>

            {/* RIGHT SIDE - PRICE CARD */}
            <Box>
              <Box
                bg="white"
                rounded="xl"
                p={6}
                border="1px solid"
                borderColor="gray.200"
                boxShadow="lg"
                position="sticky"
                top="24"
              >
                <Stack gap={6}>
                  {/* Price */}
                  <Box>
                    <BaseText
                      variant={TextVariant.H1}
                      color={"primary.500"}
                      fontWeight="bold"
                    >
                      <BaseFormatNumber value={property.price} />
                      <BaseText as="span" fontSize="md" color="gray.500" ml={1}>
                        /mois
                      </BaseText>
                    </BaseText>
                  </Box>

                  {/* Breakdown */}
                  <Stack gap={2} fontSize="sm">
                    <PriceRow label="Loyer mensuel" value={property.price} />
                    <PriceRow
                      label="Charges estimées"
                      value={Math.round(property.price * 0.12)}
                    />
                    <PriceRow
                      label="Dépôt de garantie"
                      value={property.price}
                    />

                    <Flex
                      justify="space-between"
                      pt={2}
                      mt={3}
                      borderTop="1px solid"
                      borderColor="gray.200"
                      fontWeight="semibold"
                    >
                      <BaseText>Total 1er mois</BaseText>
                      <BaseFormatNumber
                        value={
                          property.price * 2 + Math.round(property.price * 0.12)
                        }
                      />
                    </Flex>
                  </Stack>

                  {/* Buttons */}
                  <Link href={session ? "/" : APP_ROUTES.AUTH.SIGN_UP}>
                    <BaseButton w="full">Postuler maintenant</BaseButton>
                  </Link>

                  <Stack gap={3} pt={2}>
                    <BaseButton
                      variant="outline"
                      colorType={"overlay"}
                      w="full"
                      leftIcon={<Icons.Mail size={16} />}
                    >
                      Envoyer un message
                    </BaseButton>

                    <BaseButton
                      variant="outline"
                      colorType={"overlay"}
                      w="full"
                      leftIcon={<Icons.Heart size={16} />}
                    >
                      Ajouter aux favoris
                    </BaseButton>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </MotionBox>
      </Container>
    </UserLayout>
  );
};
