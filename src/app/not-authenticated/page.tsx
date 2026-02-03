"use client";

import React from "react";
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

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Flex p={4} justifyContent={"space-between"}>
        <HStack>
          <Image
            src="/assets/svg/my-immo.svg"
            width={45}
            height={45}
            alt="logo"
          />
          <BaseText
            variant={TextVariant.L}
            weight={TextWeight.Bold}
            color={"primary.500"}
          >
            MyImmo
          </BaseText>
        </HStack>
        <BaseButton
          variant={"outline"}
          colorType={"neutral"}
          onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}
        >
          <BaseText color={"gray.500"}>{t("COMMON.LOGIN")}</BaseText>
        </BaseButton>
      </Flex>
      <Center minH="100vh" w="full" px={4} py={{ base: 4, md: 16 }}>
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
              Merci de vous connecter por accéder à cette page
            </Card.Title>
            <VStack fontSize="sm" color="gray.500" textAlign="center">
              Vous n'avez pas accès a ce lien ou le lien n'est pas valide
            </VStack>
          </Card.Header>
          <Card.Body px={{ base: 0, md: 6 }} gap={3}>
            <BaseButton onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}>
              {t("COMMON.LOGIN")}
            </BaseButton>
            <BaseButton
              variant={"outline"}
              colorType={"neutral"}
              onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_UP)}
            >
              <BaseText color={"gray.500"}>S'inscrire</BaseText>
            </BaseButton>
          </Card.Body>
        </Card.Root>
      </Center>
    </>
  );
}
