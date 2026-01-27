import { Flex, Box, Link } from "@chakra-ui/react";
import { FC } from "react";
import { VariablesColors } from "_theme/variables";
import { hexToRGB } from "_theme/colors";
import { BaseText } from "_components/custom/base-text";
import { useIsActive } from "../hooks/useIsActive";
import useSideBarStyle from "../hooks/useSidebarStyle";
import { MenuProps } from "../types";
import { useTranslation } from "react-i18next";
import { BaseIcon } from "_components/custom";
import { MdKeyboardArrowDown } from "react-icons/md";

export const SubMenu: FC<MenuProps> = ({
  openedMenu,
  sideToggled,
  link,
  conditionsSubMenu,
  totalLinks,
}) => {
  const { t } = useTranslation();
  const { itHasActiveChildLink } = useIsActive();
  const { setMenuTextStyle, linkStyle } = useSideBarStyle({ sideToggled });

  const isActive = itHasActiveChildLink(link.subItems);

  return (
    <Link
      {...linkStyle}
      key={link?.menuKey}
      onClick={() => conditionsSubMenu(link)}
      _hover={{
        bg: hexToRGB("neutral", 0.3, 500),
        textDecoration: "none",
      }}
    >
      <Box
        key={link?.menuKey}
        height="100%"
        width="2px"
        bg={isActive ? "white" : "transparent"}
        borderRadius="12px"
      />
      <Flex
        align="center"
        justifyContent={{ base: "flex-start", md: "center" }}
        w="100%"
        h="100%"
        borderRadius={"5px"}
        //bg={isActive ? hexToRGB('neutral', 0.3) : 'transparent'}
        px={"10px"}
        me={{ base: "15px", md: "10px" }}
      >
        <BaseIcon
          color={isActive ? VariablesColors.white : VariablesColors.grayScale}
        >
          <link.icon width="22px" height="22px" size={"22px"} />
        </BaseIcon>

        <Box
          display={
            !sideToggled ? { lg: "none" } : { base: "block", lg: "block" }
          }
          width={"full"}
          ms="0.5rem"
        >
          <BaseText {...setMenuTextStyle(link.subItems)}>
            {t(link.label)}
            {` (${totalLinks})`}
          </BaseText>
        </Box>

        {sideToggled && link?.subItems && (
          <Box
            transition="all ease-in-out 200ms"
            transform={
              isActive || openedMenu === link?.menuKey ? "rotate(180deg)" : ""
            }
          >
            <MdKeyboardArrowDown
              width="18px"
              height="18px"
              color={VariablesColors.grayScale}
            />
          </Box>
        )}
      </Flex>
    </Link>
  );
};
