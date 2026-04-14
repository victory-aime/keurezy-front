import { Accordion, Badge, Flex, Icon, VStack } from "@chakra-ui/react";
import { useIsActive } from "../hooks/useIsActive";
import { SidebarNavGroupProps } from "../types";
import { BaseText } from "_components/custom";
import { SideToolTip } from "./SideToolTip";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { hexToRGB } from "_theme/colors";
import { useState } from "react";
import { Icons } from "_components/custom";
import { UpgradePlanModal } from "./UpgradePlanModal";

export const SidebarGroup = ({
  links,
  title,
  isCollapsed,
  icon,
  mobileCloseDrawer,
}: SidebarNavGroupProps & {
  isCollapsed: boolean;
  mobileCloseDrawer?: () => void;
}) => {
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const { isActiveLink } = useIsActive();

  return (
    <>
      <Accordion.Root collapsible defaultValue={[title]}>
        <Accordion.Item value={title} border="none">
          <Accordion.ItemTrigger
            py={1}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            color="gray.500"
            alignItems={"center"}
            justifyContent={"space-between"}
            cursor={"pointer"}
            _focus={{ bgColor: "none", color: "none" }}
          >
            {isCollapsed ? (
              <Flex gap={2} alignItems={"center"}>
                <Icon as={icon} size={"md"} />
                {t(title)}
              </Flex>
            ) : (
              <Icon as={icon} size={"xs"} />
            )}

            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody px={0}>
              <VStack align="stretch" gap={1} width={"full"}>
                {links?.map((item, i) => {
                  const isActive = isActiveLink(item?.path);

                  const handleClick = () => {
                    if (item.disabled) {
                      setOpenUpgradeModal(true);
                      return;
                    }
                    router.push(item.path);
                    mobileCloseDrawer?.();
                  };

                  return (
                    <SideToolTip
                      key={i}
                      label={
                        item.disabled
                          ? "Disponible dans un plan supérieur"
                          : t(item.label)
                      }
                      disabled={isCollapsed && !item.disabled}
                    >
                      <Flex
                        align="center"
                        width="full"
                        gap={3}
                        px={3}
                        py={2}
                        borderRadius="md"
                        justifyContent={isCollapsed ? "center" : "flex-start"}
                        bg={isActive ? hexToRGB("primary", 0.2) : "transparent"}
                        color={
                          item.disabled
                            ? "gray.400"
                            : isActive
                              ? "primary.600"
                              : "gray.600"
                        }
                        fontWeight={isActive ? "semibold" : "normal"}
                        cursor={item.disabled ? "not-allowed" : "pointer"}
                        opacity={item.disabled ? 0.5 : 1}
                        onClick={handleClick}
                        _hover={
                          item.disabled
                            ? {}
                            : {
                                bg: hexToRGB("primary", 0.2),
                                color: "primary.600",
                              }
                        }
                        transition="all 0.2s"
                      >
                        <Icon as={item.icon} size={"sm"} />

                        {isCollapsed && (
                          <>
                            <BaseText flex="1" fontSize="sm">
                              {t(item.label)}
                            </BaseText>

                            {item.badge && (
                              <Badge
                                borderRadius="full"
                                fontSize="0.8em"
                                colorPalette="purple"
                              >
                                {item.badge}
                              </Badge>
                            )}

                            {item.disabled && (
                              <Icon as={Icons.Lock} color="gray" />
                            )}
                          </>
                        )}
                      </Flex>
                    </SideToolTip>
                  );
                })}
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
      <UpgradePlanModal
        onChange={setOpenUpgradeModal}
        isOpen={openUpgradeModal}
      />
    </>
  );
};
