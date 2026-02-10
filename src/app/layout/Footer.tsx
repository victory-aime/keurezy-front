import React, { ReactNode, useState } from "react";
import {
  Heading,
  Link,
  VStack,
  HStack,
  Flex,
  Separator,
  Stack,
  For,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { BaseIcon, BaseText } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { FOOTER_ROUTES, SOCIAL_LINKS } from "./routes";
import { useIsActive } from "../hooks/useActive";
import { useRouter } from "next/navigation";

export const Footer = () => {
  const router = useRouter();
  const { isActiveLink } = useIsActive();
  const [currentIndex, setCurrentIndex] = useState<null | number>(null);
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
  });

  return (
    <Stack width={"full"} p={4} gap={3}>
      <Flex
        width={"full"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        flexDirection={isMobile ? "column" : "row"}
        gap={10}
      >
        <VStack alignItems={"flex-start"} width={"full"} gap={3}>
          <HStack width={"full"}>
            <Image
              src={"/assets/svg/my-immo.svg"}
              alt={"logo"}
              width={45}
              height={45}
            />
            <BaseText>MyIMMO</BaseText>
          </HStack>
          <BaseText>
            Plateforme marketplace centralisée pour petits et grands commerces.
          </BaseText>
          <HStack gap={3}>
            <For each={SOCIAL_LINKS}>
              {(item, i) => (
                <BaseIcon
                  key={i}
                  onMouseEnter={() => setCurrentIndex(i)}
                  onMouseLeave={() => setCurrentIndex(null)}
                  onClick={() => router.push(item?.url)}
                  animation={currentIndex === i ? "bounce" : "normal"}
                  cursor={"pointer"}
                  color={
                    currentIndex === i ? VariablesColors.primary : "neutral.500"
                  }
                >
                  <item.icon />
                </BaseIcon>
              )}
            </For>
          </HStack>
        </VStack>

        {FOOTER_ROUTES.map((item, i) => (
          <VStack width="full" align="start" gap={4} key={i}>
            <Heading size="md" textTransform={"capitalize"}>
              {item.name}
            </Heading>
            {item.links.map((link, j) => {
              const isActive = isActiveLink(link.url);
              return (
                <HStack key={j} color={VariablesColors.primary}>
                  {link.icon && <link.icon />}
                  <Link
                    href={link.url}
                    textTransform="capitalize"
                    color={isActive ? VariablesColors.primary : "none"}
                    _hover={
                      isActive
                        ? {}
                        : {
                            color: VariablesColors.primary,
                            transform: "translateX(3px)",
                            transition: "all 0.2s ease",
                          }
                    }
                    cursor={isActive ? "default" : "pointer"}
                  >
                    {link.name}
                  </Link>
                </HStack>
              );
            })}
          </VStack>
        ))}
      </Flex>
      <Separator height={4} />
      <Flex
        width={"full"}
        justifyContent={"space-between"}
        flexDirection={isMobile ? "column" : "row"}
        align={"center"}
      >
        <BaseText>
          © {new Date().getUTCFullYear()} MyIMMO. Tous droits réservés.
        </BaseText>
        <Flex gap={"6"} alignItems={"flex-end"} justifyContent={"flex-end"}>
          <BaseText
            _hover={{ color: VariablesColors.primary, cursor: "pointer" }}
          >
            Politique de confidentialité
          </BaseText>
          <BaseText
            _hover={{ color: VariablesColors.primary, cursor: "pointer" }}
          >
            Conditions d'utilisation
          </BaseText>
        </Flex>
      </Flex>
    </Stack>
  );
};
