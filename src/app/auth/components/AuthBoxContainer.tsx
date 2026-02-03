"use client";

import { Card, Center, VStack, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";
import Image from "next/image";
import { VariablesColors } from "_theme/variables";

export const AuthBoxContainer = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <Center
      minH="100vh"
      w="full"
      px={4}
      py={{ base: 4, md: 16 }}
      position="relative"
      overflow="hidden"
    >
      <Box
        display={{ base: "none", md: "block" }}
        position="absolute"
        inset={0}
        bg={VariablesColors.white}
        opacity={0.15}
      />
      <Box
        display={{ base: "none", md: "block" }}
        position="absolute"
        top="-20%"
        right="-20%"
        w="500px"
        h="500px"
        bg={VariablesColors.secondary}
        borderRadius="full"
        filter="blur(120px)"
      />
      <Box
        display={{ base: "none", md: "block" }}
        position="absolute"
        bottom="-20%"
        left="-20%"
        w="500px"
        h="500px"
        bg={VariablesColors.primary}
        borderRadius="full"
        filter="blur(120px)"
      />

      <Card.Root
        size="md"
        w="full"
        maxW={{ base: "100%", md: "600px" }}
        border="none"
        //bg={{ base: "transparent", md: "rgba(255,255,255,0.75)" }}
        backdropFilter={{ base: "none", md: "blur(14px)" }}
        css={{
          WebkitBackdropFilter: { base: "none", md: "blur(14px)" },
        }}
        borderRadius={{ base: "none", md: "2xl" }}
        //boxShadow={{ base: "none", md: "0 20px 40px rgba(0,0,0,0.15)" }}
        zIndex={1}
      >
        <Card.Header
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          gap={3}
        >
          <Image
            src="/assets/svg/my-immo.svg"
            width={45}
            height={45}
            alt="logo"
          />
          <Card.Title fontSize="xl" textAlign="center">
            {t(title)}
          </Card.Title>
          <VStack fontSize="sm" color="gray.500" textAlign="center">
            {description}
          </VStack>
        </Card.Header>
        <Card.Body px={{ base: 0, md: 6 }}>{children}</Card.Body>
      </Card.Root>
    </Center>
  );
};
