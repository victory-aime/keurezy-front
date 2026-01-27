import {
  HStack,
  Stat,
  StatDownIndicator,
  StatUpIndicator,
  Flex,
  Box,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { BaseStatsProps } from "./interface/stats";
import { BaseIcon } from "../base-icon";
import { BaseFormatNumber } from "../format-number";
import { boxStyle } from "../container/style";
import { ENUM } from "_types/index";
import { BaseText } from "_components/custom";
import { hexToRGB } from "_theme/colors";

export const BaseStats: FC<BaseStatsProps> = ({
  color = "primary",
  iconBgColor = "primary.500",
  icon,
  message,
  title,
  value = 0,
  percent = 0.25,
  isNumber = false,
  currency = ENUM.COMMON.Currency.USD,
  ...rest
}) => {
  const isPositive = percent >= 0;

  return (
    <Stat.Root
      p={0}
      gap={4}
      {...boxStyle}
      {...rest}
      _hover={{
        borderWidth: 2,
        borderLeftColor: iconBgColor,
        borderBottomColor: iconBgColor,
        transition: "all 400ms cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      <VStack alignItems={"flex-start"} gap={5}>
        <Flex alignItems={"center"} gap={5}>
          {icon && <BaseIcon bgColor={iconBgColor}>{icon}</BaseIcon>}
          {title && <BaseText>{title}</BaseText>}
        </Flex>
        {message && <BaseText>{message}</BaseText>}
      </VStack>

      <HStack
        width="full"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Stat.ValueText alignItems="center" gap={2} fontSize={"xl"}>
          {value && isNumber ? (
            <BaseFormatNumber
              value={value}
              notation="compact"
              currencyCode={currency}
            />
          ) : (
            value
          )}
        </Stat.ValueText>

        <HStack
          gap="1"
          color={"white"}
          bgColor={hexToRGB(color, 0.3)}
          p={2}
          rounded={"full"}
          fontWeight={"bold"}
        >
          {isPositive ? (
            <StatUpIndicator color={color} />
          ) : (
            <StatDownIndicator color={color} />
          )}
          <BaseFormatNumber style="percent" value={percent} />
        </HStack>
      </HStack>
    </Stat.Root>
  );
};
