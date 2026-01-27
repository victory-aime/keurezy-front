import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { BaseText, TextVariant } from "../base-text";
import { BaseContainer } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { BaseDisplayInfoByColumnsProps } from "./interface/display";

export const BaseDisplayInfoByColumns = ({
  leftItems,
  rightItems,
  title,
  isLoading,
  gap = 6,
}: BaseDisplayInfoByColumnsProps) => {
  return (
    <BaseContainer
      title={title}
      width={"full"}
      w={"full"}
      mt={"30px"}
      loader={isLoading}
      numberOfLines={5}
      bgColor={hexToRGB("lighter", 0.6)}
    >
      <Grid templateColumns="1fr 1fr" gap={gap} mt={"15px"}>
        <GridItem display="flex" flexDirection="column" gap={4}>
          {leftItems.map((item, i) => (
            <Flex key={i} alignItems="center" gap={4}>
              <BaseText variant={TextVariant.M}>{item.label} :</BaseText>
              <BaseText variant={TextVariant.S}>{item.value}</BaseText>
            </Flex>
          ))}
        </GridItem>
        <GridItem
          display="flex"
          alignItems={"flex-end"}
          flexDirection="column"
          gap={4}
        >
          {rightItems.map((item, i) => (
            <Flex key={i} alignItems="center" gap={4}>
              <BaseText variant={TextVariant.M}>{item.label} :</BaseText>
              <BaseText variant={TextVariant.S}>{item.value}</BaseText>
            </Flex>
          ))}
        </GridItem>
      </Grid>
    </BaseContainer>
  );
};
