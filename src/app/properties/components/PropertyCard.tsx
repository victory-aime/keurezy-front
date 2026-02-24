import {
  BaseBadge,
  BaseFormatNumber,
  BaseText,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { motion } from "framer-motion";
import { Box, Flex, HStack, Image, Span } from "@chakra-ui/react";
import { VariablesColors } from "_theme/variables";
import Link from "next/link";
import { Button } from "_components/ui/button";
import { APP_ROUTES } from "_config/routes";
import { MODELS, CONSTANTS } from "_types/";

const MotionBox = motion.create(Box);

export const PropertyCard = ({
  property,
  index = 0,
}: {
  property: MODELS.IProperty;
  index?: number;
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeInOut" }}
    >
      <Link href={`${APP_ROUTES.APPARTEMENT_DETAIL}?id=${property.id}`}>
        <Box
          rounded={"xl"}
          border={"1px solid"}
          position={"relative"}
          borderColor={"bg.muted"}
          shadow={"xs"}
        >
          <Box position={"relative"} aspectRatio={4 / 3} overflow={"hidden"}>
            <Image
              src={property?.galleryImages?.[0] as string}
              alt={property.title}
              objectFit={"cover"}
              borderTopRadius={12}
              loading="lazy"
            />
            <Box
              position={"absolute"}
              top={3}
              left={3}
              gap={2}
              display={"flex"}
              className="absolute top-3 left-3 flex gap-2"
            >
              <BaseBadge
                color={property.status ? "tertiary" : "danger"}
                label={
                  CONSTANTS.propertyStatus.find(
                    (item) => item.value === property.status,
                  )?.label
                }
              />

              <BaseBadge
                color="neutral"
                label={
                  property.type &&
                  CONSTANTS.propertyTypes.find(
                    (item) => item.value === property.type,
                  )?.label
                }
              />
            </Box>
          </Box>

          <Box spaceY={3} p={3}>
            <Flex
              width={"full"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <BaseText
                weight={TextWeight.SemiBold}
                lineClamp={1}
                textWrap={"wrap"}
                _hover={{ color: VariablesColors.primary }}
              >
                {property.title}
              </BaseText>
              <BaseText
                variant={TextVariant.S}
                weight={TextWeight.SemiBold}
                textWrap={"nowrap"}
                color={"primary.500"}
                _hover={{ color: VariablesColors.primary }}
              >
                <BaseFormatNumber value={property.price ?? 0} />
                <Span fontSize={"sm"} color={"gray.400"}>
                  /mois
                </Span>
              </BaseText>
            </Flex>
            <Flex alignItems={"center"}>
              <Icons.MapPin />
              <BaseText variant={TextVariant.S}>
                {property?.address},{" "}
                {
                  CONSTANTS.citiesByCountry?.[property?.country || ""]?.find(
                    (item) => item.value === property?.city,
                  )?.label
                }
              </BaseText>
            </Flex>
            <Flex
              pt={1}
              borderTop={"1px solid"}
              borderColor={"gray.200"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"full"}
            >
              <Flex gap={4}>
                <HStack>
                  <Icons.Bed />
                  <span>{property.rooms}</span>
                </HStack>
                <HStack>
                  <Icons.Bath />
                  <span>{property.sdb}</span>
                </HStack>
                <HStack>
                  <Icons.Maximize />
                  <span>{property.surface}m²</span>
                </HStack>
              </Flex>
              <Button
                size="sm"
                variant="ghost"
                color={"primary.500"}
                ml={"auto"}
              >
                Voir →
              </Button>
            </Flex>
          </Box>
        </Box>
      </Link>
    </MotionBox>
  );
};
