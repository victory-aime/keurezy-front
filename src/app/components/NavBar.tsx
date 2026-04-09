import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BaseButton, BaseText, Icons, TextVariant } from "_components/custom";
import {
  Box,
  Flex,
  HStack,
  Stack,
  Container,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { ASSETS } from "_assets/images";
import { hexToRGB } from "_theme/colors";
import { HEADER_LINKS } from "../layout/routes";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";
import { useIsActive } from "_hooks/useActive";
import { MotionBox } from "_constants/motion";
import { useColorMode } from "_components/ui/color-mode";

export const Navbar = () => {
  const { colorMode } = useColorMode();
  const { isActiveLink } = useIsActive();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      zIndex={50}
      backdropFilter="blur(5px)"
      bg={colorMode === "light" ? "white" : "black"}
      borderBottomWidth="1px"
      borderColor="border"
    >
      <Container
        mx={"auto"}
        px={{ base: 6, sm: 8 }}
        py={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"full"}
        >
          <Link href={APP_ROUTES.ROOT}>
            <Flex alignItems={"center"} gap={2}>
              <Image
                src={colorMode === "light" ? ASSETS.LOGO : ASSETS.LOGO_DARK}
                alt="logo"
                width={45}
                height={45}
              />
              <BaseText variant={TextVariant.M}>MyImmo</BaseText>
            </Flex>
          </Link>

          {/* Desktop nav */}
          <Flex
            display={{ base: "none", sm: "flex" }}
            gap={2}
            alignItems={"center"}
            justifyContent={"center"}
            width={"full"}
          >
            {HEADER_LINKS.map((link, i) => {
              const isActive = isActiveLink(link.url);
              return (
                <Link key={link.url} href={link.url}>
                  <HStack
                    key={i}
                    px={4}
                    py={2}
                    rounded={"lg"}
                    fontSize={"sm"}
                    fontWeight={"medium"}
                    cursor={"pointer"}
                    color={isActive ? "primary.500" : "gray.600"}
                    bgColor={isActive ? hexToRGB("primary", 0.1) : "none"}
                    _hover={{
                      bgColor: !isActive
                        ? hexToRGB("primary", 0.3)
                        : "bg.muted",
                      color: isActive ? "primary.500" : "gray.600",
                    }}
                  >
                    <link.icon />

                    {link.name}
                  </HStack>
                </Link>
              );
            })}
          </Flex>

          <Flex
            gap={3}
            alignItems={"center"}
            ml={"auto"}
            display={{ base: "none", sm: "flex" }}
          >
            <BaseButton
              variant="outline"
              onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
            >
              Connexion
            </BaseButton>
            <BaseButton onClick={() => router.push(APP_ROUTES.AUTH.ONBOARD)}>
              Commencer
            </BaseButton>
          </Flex>

          <Stack
            display={{ base: "block", md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Icons.Close size={20} /> : <Icons.Menu size={20} />}
          </Stack>
        </Flex>
      </Container>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            borderBottomWidth="1px"
            borderColor="border"
            overflow={"hidden"}
          >
            <Box px={4} py={4} spaceY={2}>
              {HEADER_LINKS.map((link) => {
                const isActive = isActiveLink(link.url);
                return (
                  <Link
                    key={link.url}
                    href={link.url}
                    onClick={() => setIsOpen(false)}
                  >
                    <HStack
                      width={"full"}
                      px={2}
                      py={2}
                      key={link.url}
                      rounded={"lg"}
                      fontSize={"sm"}
                      fontWeight={"medium"}
                      color={isActive ? "primary.500" : "gray.600"}
                      bgColor={isActive ? hexToRGB("primary", 0.1) : "none"}
                      _hover={{
                        bgColor: !isActive
                          ? hexToRGB("primary", 0.3)
                          : "bg.muted",
                        color: isActive ? "primary.500" : "inherit",
                      }}
                    >
                      <link.icon />
                      {link.name}
                    </HStack>
                  </Link>
                );
              })}
              <Stack alignItems={"center"} pt={2} gap={2} width={"full"}>
                <BaseButton
                  variant="outline"
                  width={"full"}
                  onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
                >
                  Connexion
                </BaseButton>
                <BaseButton
                  width={"full"}
                  onClick={() => router.push(APP_ROUTES.AUTH.ONBOARD)}
                >
                  Commencer
                </BaseButton>
              </Stack>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
