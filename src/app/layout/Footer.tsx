import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
  Link,
} from "@chakra-ui/react";
import { BaseText, Icons, TextVariant } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { FOOTER_ROUTES } from "./routes";
import { useIsActive } from "_hooks/useActive";

export const Footer = () => {
  const { isActiveLink } = useIsActive();
  return (
    <Box bgColor={hexToRGB("overlay", 0.9)} color={"bg.muted"} py={10}>
      <Container mx={"auto"} px={{ sm: 6, lg: 8 }} py={2}>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mx={"auto"}>
          <Stack spaceY={1}>
            <Flex alignItems={"center"} gap={2}>
              <Icons.Home
                color={VariablesColors.primary}
                width={45}
                height={45}
              />
              <Heading size="md" textTransform={"capitalize"}>
                MyImmo
              </Heading>
            </Flex>
            <BaseText variant={TextVariant.S} color={"whiteAlpha.600"}>
              La plateforme moderne de gestion locative qui simplifie la vie des
              propriétaires et des locataires.
            </BaseText>
          </Stack>
          {FOOTER_ROUTES.map((item, i) => (
            <VStack width="full" align="start" gap={2} key={i}>
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
                      color={
                        isActive ? VariablesColors.primary : "whiteAlpha.500"
                      }
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
        </SimpleGrid>

        <Flex
          mt={6}
          pt={4}
          borderTop={"1px solid"}
          flexDir={{ sm: "row", base: "column" }}
          borderColor={"whiteAlpha.200"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"full"}
        >
          <BaseText mt={2} opacity={0.4}>
            © {new Date().getUTCFullYear()} MyIMMO. Tous droits réservés.
          </BaseText>
          <Flex gap={3} opacity={0.4}>
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
      </Container>
    </Box>
  );
};
