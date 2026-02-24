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
import { useState } from "react";
import Link from "next/link";
import { Box, Flex, Grid, Image, Stack } from "@chakra-ui/react";
import { APP_ROUTES } from "_config/routes";
import { useAuthContext } from "_context/auth-context";
import { PropertyModule } from "_store/state-management";
import { findDynamicIdInList } from "rise-core-frontend";
import { MODELS, CONSTANTS } from "_types/";
import { UserRole } from "../../../types/enum";
import { PropertiesContainer } from "./PropertiesContainer";
import { useRouter } from "next/navigation";

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
  const { user } = useAuthContext();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const callback = `${APP_ROUTES.APPARTEMENT_APPLY}?id=${id}`;

  const { data: allPublicProperties, isLoading } =
    PropertyModule.getAllPublicProperties({
      queryOptions: { enabled: !!id },
    });
  const property: MODELS.IProperty = findDynamicIdInList(
    id,
    allPublicProperties,
  );

  return (
    <PropertiesContainer>
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 300px" }}
        gap={4}
        mb={10}
        mt={{ base: 4, sm: 5 }}
      >
        {/* Main Image */}
        <Box rounded="xl" overflow="hidden">
          <BaseRatio
            image={property?.galleryImages?.[selectedImage] as string}
            ratio={16 / 10}
          />
        </Box>
        {/* Image Gallery */}
        <Grid templateColumns={{ base: "repeat(3, 1fr)", lg: "1fr" }} gap={2}>
          {property?.galleryImages?.map((img, i) => (
            <Box
              as="button"
              key={i}
              onClick={() => setSelectedImage(i)}
              rounded="lg"
              overflow="hidden"
              aspectRatio={4 / 3}
              border="2px solid"
              borderColor={selectedImage === i ? "primary.500" : "transparent"}
              opacity={selectedImage === i ? 1 : 0.6}
              transition="all 0.2s ease"
              _hover={{
                opacity: 1,
              }}
            >
              <Image
                src={img as string}
                alt=""
                w="100%"
                h="100%"
                objectFit="cover"
              />
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
                color={property?.status ? "tertiary" : "danger"}
                label={property?.status ? "Disponible" : "Loué"}
              />

              <BaseBadge
                color={"neutral"}
                label={
                  property?.type &&
                  CONSTANTS.propertyTypes.find(
                    (item) => item.value === property?.type,
                  )?.label
                }
              />
            </Flex>

            <BaseText
              fontSize={{ base: "2xl", sm: "3xl" }}
              weight={TextWeight.Bold}
              mb={2}
            >
              {property?.title}
            </BaseText>

            <Flex align="center" gap={1.5} color="gray.500">
              <Icons.MapPin size={16} />
              <BaseText variant={TextVariant.S}>
                {property?.address},{" "}
                {
                  CONSTANTS.citiesByCountry?.[property?.country || ""]?.find(
                    (item) => item.value === property?.city,
                  )?.label
                }
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
              label={`${property?.rooms} Chambre${(property?.rooms ?? 0) > 1 ? "s" : ""}`}
            />
            <InfoItem
              icon={<Icons.Bath size={20} />}
              label={`${property?.sdb} SdB`}
            />
            <InfoItem
              icon={<Icons.Maximize size={20} />}
              label={`${property?.surface}m²`}
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
              {property?.description}
            </BaseText>
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
                  <BaseFormatNumber value={property?.price ?? 0} />
                  <BaseText as="span" fontSize="md" color="gray.500" ml={1}>
                    /mois
                  </BaseText>
                </BaseText>
              </Box>

              {/* Breakdown */}
              <Stack gap={2} fontSize="sm">
                <PriceRow label="Loyer mensuel" value={property?.price ?? 0} />
                <PriceRow
                  label="Charges estimées"
                  value={Math.round((property?.price ?? 0) * 0.12)}
                />
                <PriceRow
                  label="Dépôt de garantie"
                  value={property?.locationCaution ?? 0}
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
                      (property?.price ?? 0) * 2 +
                      Math.round((property?.price ?? 0) * 0.12)
                    }
                  />
                </Flex>
              </Stack>

              {/* Buttons */}
              {user?.role !== UserRole.IMMO_OWNER && (
                <BaseButton
                  w="full"
                  onClick={() => {
                    router.push(
                      `${APP_ROUTES.AUTH.SIGN_IN}?callbackUrl=${encodeURIComponent(callback)}`,
                    );
                  }}
                >
                  Postuler maintenant
                </BaseButton>
              )}

              <Stack gap={3} pt={2}>
                {user?.role !== UserRole.IMMO_OWNER && (
                  <Link
                    href={`${APP_ROUTES.APPARTEMENT_CONTACT_AGENCY}?id=${id}`}
                  >
                    <BaseButton
                      variant="outline"
                      colorType={"overlay"}
                      w="full"
                      leftIcon={<Icons.Mail size={16} />}
                    >
                      Envoyer un message
                    </BaseButton>
                  </Link>
                )}

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
    </PropertiesContainer>
  );
};
