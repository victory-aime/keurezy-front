import { Box, Center, Flex, HStack, Stack } from "@chakra-ui/react";
import { boxStyle } from "./style";
import { BaseText, TextVariant } from "../base-text";
import { ActionsButton } from "../button";
import {
  BaseIcon,
  BaseTooltip,
  CustomSkeletonLoader,
  IBoxProps,
} from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { useTranslation } from "react-i18next";
import { VariablesColors } from "_theme/variables";
import { LuInfo } from "react-icons/lu";

export const BaseContainer = ({
  title = "",
  description = "",
  withActionButtons = false,
  isFilterActive = false,
  isForm = false,
  formComponent,
  onToggleFilter,
  actionsButtonProps,
  children,
  loader = false,
  numberOfLines = 3,
  tooltip = "",
  filterComponent,
  textVariant,
  iconColor = "success",
  icon,
  ...rest
}: IBoxProps) => {
  const { t } = useTranslation();

  if (withActionButtons && !actionsButtonProps) {
    throw new Error(
      "Lorsque vous utiliser withActionButtons, actionsButtonProps est requis",
    );
  }
  if (isForm && !formComponent) {
    throw new Error("Lorsque vous utiliser isForm, formComponent est requis");
  }
  const mergedActionsButtonProps = {
    ...actionsButtonProps,
    onToggleFilter,
  };

  return (
    <Box {...boxStyle} {...rest}>
      <Flex
        width={"full"}
        flexDir={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        gap={5}
      >
        <Stack gap={2} width={"full"}>
          {loader ? (
            <CustomSkeletonLoader
              type="TEXT"
              width={rest?.width}
              numberOfLines={numberOfLines}
            />
          ) : (
            <>
              {tooltip ? (
                <Flex
                  width={"full"}
                  gap={4}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                >
                  {icon ? (
                    <Flex gap={3} alignItems={"center"}>
                      <BaseIcon
                        boxSize={"10px"}
                        color={hexToRGB(iconColor, 0.8)}
                      >
                        {icon}
                      </BaseIcon>
                      <BaseText variant={textVariant ?? TextVariant.L}>
                        {t(title)}
                      </BaseText>
                    </Flex>
                  ) : (
                    <BaseText
                      variant={textVariant ?? TextVariant.L}
                      textAlign={rest.textAlign}
                    >
                      {t(title)}
                    </BaseText>
                  )}

                  {tooltip && (
                    <BaseTooltip message={tooltip}>
                      <LuInfo size={14} color={VariablesColors.primary} />
                    </BaseTooltip>
                  )}
                </Flex>
              ) : (
                <>
                  {icon ? (
                    <Flex gap={3} alignItems={"center"}>
                      <BaseIcon color={hexToRGB(iconColor, 0.8)}>
                        {icon}
                      </BaseIcon>
                      <BaseText variant={textVariant ?? TextVariant.H3}>
                        {t(title)}
                      </BaseText>
                    </Flex>
                  ) : (
                    <BaseText
                      variant={textVariant ?? TextVariant.H3}
                      textAlign={rest.textAlign}
                    >
                      {t(title)}
                    </BaseText>
                  )}
                </>
              )}
              <BaseText
                variant={textVariant ? TextVariant.XS : TextVariant.S}
                textAlign={rest.textAlign}
              >
                {t(description)}
              </BaseText>
            </>
          )}
        </Stack>
        {loader && withActionButtons ? (
          <CustomSkeletonLoader
            type={"BUTTON"}
            width={"100px"}
            colorButton={"success"}
          />
        ) : (
          <HStack
            gap={4}
            width={"full"}
            alignItems={"flex-end"}
            mt={{ base: "30px", md: "0" }}
          >
            {isForm && formComponent}
            {withActionButtons && (
              <ActionsButton {...mergedActionsButtonProps} />
            )}
          </HStack>
        )}
      </Flex>
      {isFilterActive && filterComponent && (
        <Box
          mt={"20px"}
          mb={"30px"}
          bgColor={hexToRGB("lighter", 0.1)}
          p={15}
          borderRadius={"7px"}
          animation={"slideIn"}
        >
          {filterComponent}
        </Box>
      )}
      <Box>{children}</Box>
    </Box>
  );
};
