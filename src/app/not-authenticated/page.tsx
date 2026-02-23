"use client";

import { Card, Center, Flex, HStack, VStack } from "@chakra-ui/react";
import Image from "next/image";
import {
  BaseButton,
  BaseIcon,
  BaseText,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { VariablesColors } from "_theme/variables";
import { FaLock } from "react-icons/fa6";
import { APP_ROUTES } from "_config/routes";
import { ASSETS } from "_assets/images";
import { useAuthContext } from "_context/auth-context";
import { Avatar } from "_components/ui/avatar";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthContext();

  return (
    <>
      <Flex p={4} justifyContent={"space-between"}>
        <HStack>
          <Image src={ASSETS.LOGO} width={45} height={45} alt="logo" />
          <BaseText
            variant={TextVariant.L}
            weight={TextWeight.Bold}
            color={"primary.500"}
          >
            MyImmo
          </BaseText>
        </HStack>

        {user ? (
          <Flex alignItems={"center"} gap={2}>
            <Avatar name={user?.name} size={"sm"} />
            <BaseText>{user?.name}</BaseText>
          </Flex>
        ) : (
          <BaseButton
            variant={"outline"}
            colorType={"neutral"}
            onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}
          >
            <BaseText color={"gray.500"}>{t("COMMON.LOGIN")}</BaseText>
          </BaseButton>
        )}
      </Flex>
      <Center w="full" px={4} py={{ base: 4, md: 16 }}>
        <Card.Root
          size="md"
          w="full"
          maxW={{ base: "100%", md: "450px" }}
          border="none"
          bg={{ base: "transparent", md: "rgba(255,255,255,0.75)" }}
          backdropFilter={{ base: "none", md: "blur(14px)" }}
          css={{
            WebkitBackdropFilter: { base: "none", md: "blur(14px)" },
          }}
          borderRadius={{ base: "none", md: "2xl" }}
          boxShadow={{ base: "none", md: "0 20px 40px rgba(0,0,0,0.15)" }}
        >
          <Card.Header alignItems="center" gap={3}>
            <BaseIcon
              borderRadius={"12px"}
              color={"lighter.500"}
              borderColor={"bg.muted"}
              borderWidth={2}
              boxSize={"50px"}
            >
              <FaLock size={22} color={VariablesColors.primary} />
            </BaseIcon>

            <Card.Title fontSize="xl">
              {user ? "Accès restreint" : "Connexion requise"}
            </Card.Title>
            <VStack fontSize="sm" color="gray.500" textAlign="center">
              {user
                ? "Vous ne disposez pas des autorisations nécessaires pour afficher cette page.Si vous pensez qu’il s’agit d’une erreur, contactez votre administrateur."
                : "Cette ressource est protégée connectez-vous ou créez un compte pour continuer."}
            </VStack>
          </Card.Header>
          <Card.Body px={{ base: 0, md: 6 }} gap={3}>
            {user ? (
              <BaseButton
                onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}
              >
                Revenir en arrière
              </BaseButton>
            ) : (
              <>
                <BaseButton
                  onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}
                >
                  {t("COMMON.LOGIN")}
                </BaseButton>
                <BaseButton
                  variant={"outline"}
                  colorType={"neutral"}
                  onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_UP)}
                >
                  <BaseText color={"gray.500"}>S'inscrire</BaseText>
                </BaseButton>
              </>
            )}
          </Card.Body>
        </Card.Root>
      </Center>
    </>
  );
}
