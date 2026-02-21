import { Box, Flex, HStack, VStack, Image } from "@chakra-ui/react";
import {
  BaseBadge,
  BaseText,
  TextWeight,
  TextVariant,
  Icons,
  BaseFormatNumber,
} from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { CONSTANTS, MODELS } from "_types/*";
import { COMMON } from "../../../../types/enum";

export const AppartGridView = ({
  property,
}: {
  property: MODELS.IProperty;
}) => {
  return (
    <Box key={property.id}>
      <Box
        rounded={"xl"}
        border={"1px solid"}
        position={"relative"}
        borderColor={"bg.muted"}
        shadow={"xs"}
      >
        <Box position={"relative"} aspectRatio={16 / 6} overflow={"hidden"}>
          <Image
            src={property?.galleryImages?.[0]}
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
              color={
                property.status === COMMON.Status.AVAILABLE
                  ? "tertiary"
                  : "warning"
              }
              label={
                CONSTANTS.propertyStatus.find(
                  (item) => item?.value === property.status,
                )?.label
              }
            />

            <BaseBadge
              color="neutral"
              label={
                CONSTANTS.propertyTypes.find(
                  (item) => item?.value === property?.type,
                )?.label
              }
            />
          </Box>
        </Box>
        <Box spaceY={3} p={5}>
          <Flex alignItems={"flex-start"} justifyContent={"space-between"}>
            <VStack width={"full"} gap={0} alignItems={"flex-start"}>
              <BaseText
                weight={TextWeight.SemiBold}
                lineClamp={1}
                textWrap={"wrap"}
                _hover={{ color: VariablesColors.primary }}
              >
                {property.title}
              </BaseText>
              <BaseText variant={TextVariant.S}>{property?.address}</BaseText>

              <Box width={"full"}>
                <Flex gap={4}>
                  <HStack>
                    <Icons.Bed />
                    <span>{property?.rooms}</span>
                  </HStack>
                  <HStack>
                    <Icons.Bath />
                    <span>{property?.sdb}</span>
                  </HStack>
                  <HStack>
                    <Icons.Maximize />
                    <span>{property?.surface}m²</span>
                  </HStack>
                </Flex>
              </Box>
            </VStack>
            <BaseText
              variant={TextVariant.S}
              weight={TextWeight.SemiBold}
              textWrap={"nowrap"}
              color={"primary.500"}
              _hover={{ color: VariablesColors.primary }}
            >
              <BaseFormatNumber value={property?.price || 0} />
              <span
                style={{
                  fontSize: "14px",
                  color: VariablesColors.gray400,
                }}
              >
                /mois
              </span>
            </BaseText>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
