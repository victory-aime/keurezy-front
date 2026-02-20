import { Accordion, Badge, Flex, Icon, Link, VStack } from "@chakra-ui/react";
import { useIsActive } from "../hooks/useIsActive";
import { SidebarNavGroupProps } from "../types";
import { BaseText } from "_components/custom";
import { SideToolTip } from "./SideToolTip";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { t } = useTranslation();
  const { isActiveLink } = useIsActive();

  return (
    <Accordion.Root collapsible>
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
          <Accordion.ItemBody px={0} cursor={"pointer"}>
            <VStack align="stretch" gap={1} width={"full"}>
              {links?.map((item, i) => {
                const isActive = isActiveLink(item?.path);
                const content = (
                  <Flex
                    key={i}
                    align="center"
                    width={"full"}
                    gap={3}
                    px={3}
                    py={2}
                    borderRadius="md"
                    justifyContent={isCollapsed ? "center" : "flex-start"}
                    bg={isActive ? "primary.50" : "transparent"}
                    color={isActive ? "primary.600" : "gray.600"}
                    fontWeight={isActive ? "semibold" : "normal"}
                    onClick={() => {
                      router.push(item?.path);
                      mobileCloseDrawer?.();
                    }}
                    _hover={
                      isActive
                        ? {}
                        : {
                            bg: "primary.100",
                            color: "primary.900",
                          }
                    }
                    transition="all 0.2s"
                  >
                    <Icon as={item.icon} size={"sm"} />
                    {isCollapsed && (
                      <>
                        <BaseText flex="1" fontSize="sm">
                          {t(item?.label)}
                        </BaseText>

                        {item.badge && (
                          <Badge
                            borderRadius="full"
                            fontSize="0.8em"
                            colorPalette="purple"
                          >
                            {item?.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Flex>
                );

                return !isCollapsed ? (
                  <SideToolTip key={i} label={t(item?.label)}>
                    {content}
                  </SideToolTip>
                ) : (
                  content
                );
              })}
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};
