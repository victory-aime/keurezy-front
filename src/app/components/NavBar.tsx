import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BaseButton, BaseText, Icons, TextVariant } from "_components/custom";
import {
  Button,
  Box,
  Flex,
  VStack,
  HStack,
  Stack,
  Container,
} from "@chakra-ui/react";
import Image from "next/image";
import { ASSETS } from "_assets/images";
import { hexToRGB } from "_theme/colors";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = usePathname();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/properties", label: "Propriétés" },
    { href: "/pricing", label: "Tarifs" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      zIndex={50}
      backdropFilter="blur(5px)"
      bgColor={"white"}
      borderBottomWidth="1px"
      borderColor="border"
    >
      <Container
        mx={"auto"}
        px={{ sm: 6, lg: 8 }}
        py={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"full"}
        >
          <Flex alignItems={"center"} gap={2}>
            <Image src={ASSETS.LOGO} alt="logo" width={45} height={45} />
            <BaseText variant={TextVariant.M}>MyImmo</BaseText>
          </Flex>

          {/* Desktop nav */}
          <Flex
            display={{ base: "none", md: "flex" }}
            gap={2}
            alignItems={"center"}
            justifyContent={"center"}
            width={"full"}
          >
            {links.map((link) => (
              <HStack
                px={4}
                py={2}
                rounded={"lg"}
                fontSize={"sm"}
                fontWeight={"medium"}
                color={isActive(link?.href) ? "primary.500" : "inherit"}
                bgColor={
                  isActive(link?.href) ? hexToRGB("primary", 0.1) : "none"
                }
                _hover={{
                  bgColor: !isActive(link?.href)
                    ? hexToRGB("primary", 0.3)
                    : "bg.muted",
                  color: isActive(link?.href) ? "primary.500" : "inherit",
                }}
              >
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              </HStack>
            ))}
          </Flex>

          <Flex
            gap={3}
            alignItems={"center"}
            ml={"auto"}
            display={{ base: "none", md: "flex" }}
          >
            <BaseButton variant="outline" onClick={() => {}}>
              Connexion
            </BaseButton>

            <BaseButton onClick={() => {}}>Commencer</BaseButton>
          </Flex>

          <Stack
            display={{ base: "block", md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <Icons.Close className="w-5 h-5" />
            ) : (
              <Icons.Menu className="w-5 h-5" />
            )}
          </Stack>
        </Flex>
      </Container>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <Box px={4} py={4} spaceY={2}>
              {links.map((link) => (
                <Stack
                  width={"full"}
                  px={2}
                  py={2}
                  key={link.href}
                  rounded={"lg"}
                  fontSize={"sm"}
                  fontWeight={"medium"}
                  color={isActive(link?.href) ? "primary.500" : "inherit"}
                  bgColor={
                    isActive(link?.href) ? hexToRGB("primary", 0.1) : "none"
                  }
                  _hover={{
                    bgColor: !isActive(link?.href)
                      ? hexToRGB("primary", 0.3)
                      : "bg.muted",
                    color: isActive(link?.href) ? "primary.500" : "inherit",
                  }}
                >
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </Stack>
              ))}
              <Stack alignItems={"center"} pt={2} gap={2} width={"full"}>
                <Button
                  variant="ghost"
                  width="full"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Button>

                <Button
                  variant="ghost"
                  bgColor={"primary.500"}
                  width="full"
                  onClick={() => setIsOpen(false)}
                >
                  Commencer
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
