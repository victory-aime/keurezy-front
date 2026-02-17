import {
  BaseBadge,
  BaseFormatNumber,
  BaseText,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { motion } from "framer-motion";
import { Property } from "./Properties";
import { Box, Flex, HStack, Image } from "@chakra-ui/react";
import { VariablesColors } from "_theme/variables";
import Link from "next/link";
import { Button } from "_components/ui/button";
import { APP_ROUTES } from "_config/routes";

interface PropertyCardProps {
  property: Property;
  index?: number;
}
const MotionBox = motion(Box);

export const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
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
              src={property.images[0]}
              alt={property.title}
              w={"auto"}
              h={"auto"}
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
                color={property.available ? "tertiary" : "danger"}
                label={property.available ? "Disponible" : "Loué"}
              />

              <BaseBadge
                color="neutral"
                label={
                  property.type.charAt(0).toUpperCase() + property.type.slice(1)
                }
              />
            </Box>
          </Box>

          <Box spaceY={3} p={5}>
            <Flex
              width={"full"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
            >
              <BaseText
                weight={TextWeight.SemiBold}
                lineClamp={2}
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
                <BaseFormatNumber value={property.price} />
                <span
                  style={{ fontSize: "14px", color: VariablesColors.gray400 }}
                >
                  /mois
                </span>
              </BaseText>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
              <Icons.MapPin />
              <BaseText variant={TextVariant.S}>{property.location}</BaseText>
            </Flex>
            <Flex
              pt={2}
              borderTop={"1px solid"}
              borderColor={"gray.200"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"full"}
            >
              <Flex gap={4}>
                <HStack>
                  <Icons.Bed />
                  <span>{property.beds}</span>
                </HStack>
                <HStack>
                  <Icons.Bath />
                  <span>{property.baths}</span>
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
