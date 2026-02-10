import { Box, Flex, Link } from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { VariablesColors } from "_theme/variables";
import { hexToRGB } from "_theme/colors";
import { BaseText } from "_components/custom/base-text";
import useSideBarStyle from "../hooks/useSidebarStyle";
import { SubMenuProps } from "../types";
import { useTranslation } from "react-i18next";
import { BaseIcon } from "_components/custom";

export const Links: FC<SubMenuProps> = ({
  sideToggled,
  redirectToPath,
  isActiveLink,
  link,
}) => {
  const { t } = useTranslation();
  const { textStyle, linkStyle } = useSideBarStyle({
    sideToggled,
  });

  const setTextStyle = useCallback(
    (linkPath: string) =>
      isActiveLink(linkPath)
        ? {
            ...textStyle,
            fontWeight: "500",
            fontSize: "15px",
            color: "primary.500",
          }
        : textStyle,
    [isActiveLink, textStyle],
  );

  const isActive = isActiveLink(link.path!);

  return (
    <Link
      key={link.key}
      onClick={(e) => {
        e.preventDefault();
        redirectToPath(link);
      }}
      {...linkStyle}
      _hover={{
        bg: hexToRGB("primary", 0.2, 500),
        textDecoration: "none",
      }}
      pe={{ base: "1rem", md: "0" }}
    >
      <Box
        height="100%"
        width="4px"
        bg={isActive ? "primary.500" : "transparent"}
        borderRadius="12px"
      />
      <Flex
        align="center"
        justifyContent={{ base: "flex-start", md: "center" }}
        w="100%"
        h="100%"
        borderRadius="5px"
        px="10px"
        me={{ base: "15px", md: "10px" }}
      >
        {link.icon && (
          <BaseIcon
            width={"45px"}
            color={
              isActive ? VariablesColors.primary : VariablesColors.transparent
            }
          >
            <link.icon
              fill={
                isActive ? VariablesColors.white : VariablesColors.grayScale
              }
            />
          </BaseIcon>
        )}

        <Box
          display={
            !sideToggled ? { lg: "none" } : { base: "block", lg: "block" }
          }
          width={"full"}
          ms="0.5rem"
        >
          <BaseText {...setTextStyle(link.path!)}>{t(link.label)}</BaseText>
        </Box>
      </Flex>
    </Link>
  );
};
