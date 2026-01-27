import { Box, Flex, Link, useBreakpointValue } from "@chakra-ui/react";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { VariablesColors } from "_theme/variables";
import { hexToRGB } from "_theme/colors";
import useSideBarStyle from "../hooks/useSidebarStyle";
import { ActiveMenuProps } from "../types";
import { useTranslation } from "react-i18next";
import { BaseText } from "_components/custom";
import { GoDotFill } from "react-icons/go";

export const ActiveSubMenuLink: FC<ActiveMenuProps> = ({
  subLink,
  sideToggled,
  onShowSidebar,
  isActiveLink,
}) => {
  const navigate = useRouter();
  const { t } = useTranslation();
  const { linkStyle, setMenuItemTextStyle, setMenuItemPointStyle } =
    useSideBarStyle({
      sideToggled,
    });
  const sidebarConditionInverse = useBreakpointValue({ base: false, lg: true });

  return (
    <Link
      key={subLink.path}
      {...linkStyle}
      width={"full"}
      height={"full"}
      ps={"15px"}
      pe={"0"}
      onClick={() => {
        navigate.push(subLink?.path);
        if (!sidebarConditionInverse) {
          onShowSidebar();
        }
      }}
      _hover={{
        bg: hexToRGB("neutral", 0.3, 500),
        textDecoration: "none",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        width="100%"
      >
        <Flex
          width={"full"}
          bg={
            isActiveLink(subLink.path!)
              ? hexToRGB("neutral", 0.3)
              : "transparent"
          }
          me={"10px"}
          borderBottomWidth={isActiveLink(subLink?.path) ? "2px" : "0"}
          borderColor={
            isActiveLink(subLink?.path) ? hexToRGB("neutral", 0.5) : "none"
          }
          gap={2}
          alignItems={"center"}
          borderRadius={"5px"}
          height={"40px"}
          mt={{ base: "4px", md: "8px" }}
          p={"15px"}
        >
          {subLink?.icon ? (
            <subLink.icon
              width="14px"
              height="14px"
              fill={
                isActiveLink(subLink.path ?? "")
                  ? VariablesColors.white
                  : VariablesColors.grayScale
              }
            />
          ) : (
            <GoDotFill
              width="9px"
              height="9px"
              color={setMenuItemPointStyle(subLink.path)}
            />
          )}
          <BaseText {...setMenuItemTextStyle(subLink.path)}>
            {t(subLink?.label)}
          </BaseText>
        </Flex>
      </Box>
    </Link>
  );
};
