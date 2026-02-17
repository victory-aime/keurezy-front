import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BaseButton,
  BaseText,
  CustomToast,
  Icons,
  TextVariant,
  ToastStatus,
} from "_components/custom";
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
import { UserModule } from "_store/state-management";
import { useAuthContext } from "_context/auth-context";
import { HEADER_LINKS } from "../layout/routes";
import { Avatar } from "_components/ui/avatar";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";
import { UserRole } from "../../types/enum";
import { useAuth } from "_hooks/useAuth";
import { useIsActive } from "_hooks/useActive";

export const Navbar = () => {
  const { session } = useAuthContext();
  const { logout } = useAuth();
  const { isActiveLink } = useIsActive();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isOpen, setIsOpen] = useState(false);
  const MotionBox = motion(Box);

  const { data: user, isLoading } = UserModule.getUserInfo({
    params: { userId: session?.userId },
    queryOptions: {
      enabled: !!session?.userId,
    },
  });

  const createAgency = () => {
    if (user?.id && user?.role !== UserRole.IMMO_OWNER) {
      router.push(`${APP_ROUTES.AUTH.REGISTER_AGENCY}?token=${user?.id}`);
    } else if (user?.role === UserRole.IMMO_OWNER) {
      router.push(APP_ROUTES.DASHBOARD);
    } else {
      CustomToast({
        duration: 3000,
        title: "Veuillez creer un compte",
        description: " Pour creer une agence vous devrez vous incrire",
        type: ToastStatus.INFO,
      });
    }
  };

  const links = HEADER_LINKS(!!session?.token, user?.role!);

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
          <Flex alignItems={"center"} gap={2}>
            <Image src={ASSETS.LOGO} alt="logo" width={45} height={45} />
            <BaseText variant={TextVariant.M}>MyImmo</BaseText>
          </Flex>

          {/* Desktop nav */}
          <Flex
            display={{ base: "none", sm: "flex" }}
            gap={2}
            alignItems={"center"}
            justifyContent={"center"}
            width={"full"}
          >
            {links.map((link, i) => {
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
            {user ? (
              <Avatar
                name={user?.name}
                src={user?.image! ?? "https://avatar.iran.liara.run/public"}
              />
            ) : (
              <BaseButton
                variant="outline"
                onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
              >
                Connexion
              </BaseButton>
            )}

            {user && (
              <BaseButton
                onClick={() => logout()}
                colorType={"danger"}
                leftIcon={<Icons.Logout />}
              >
                Deconnexion
              </BaseButton>
            )}

            {user && user?.role === UserRole.IMMO_OWNER ? (
              <BaseButton
                onClick={() => router.push(APP_ROUTES.DASHBOARD)}
                colorType={"secondary"}
                leftIcon={<Icons.Home />}
              >
                Acceder au Tableau de bord
              </BaseButton>
            ) : (
              <BaseButton onClick={createAgency}>Créer mon agence</BaseButton>
            )}
          </Flex>

          <Stack
            display={{ base: "block", md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Icons.Close /> : <Icons.Menu />}
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
              {links.map((link) => {
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
                {user ? (
                  <Flex
                    alignItems={"center"}
                    width={"full"}
                    borderRadius={"12px"}
                    gap={2}
                  >
                    <Avatar
                      name={user?.name}
                      src={
                        user?.image! ?? "https://avatar.iran.liara.run/public"
                      }
                    />
                    <BaseText textTransform={"capitalize"}>
                      {user?.name}
                    </BaseText>
                  </Flex>
                ) : (
                  <BaseButton
                    width={"full"}
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </BaseButton>
                )}
                {user && (
                  <BaseButton
                    onClick={() => logout()}
                    width={"full"}
                    colorType={"danger"}
                    leftIcon={<Icons.Logout />}
                  >
                    Deconnexion
                  </BaseButton>
                )}

                {user && user?.role === UserRole.IMMO_OWNER ? (
                  <BaseButton
                    onClick={() => router.push(APP_ROUTES.DASHBOARD)}
                    width={"full"}
                    colorType={"secondary"}
                    leftIcon={<Icons.Home />}
                  >
                    Acceder au Tableau de bord
                  </BaseButton>
                ) : (
                  <BaseButton width={"full"} onClick={createAgency}>
                    Créer mon agence
                  </BaseButton>
                )}
              </Stack>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
