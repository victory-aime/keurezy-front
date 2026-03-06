"use client";

import { Center, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BaseButton, BaseIcon, Icons } from "_components/custom";
import { Navbar } from "_component/NavBar";
import { MotionBox } from "_constants/motion";

export const PropertyNotFound = () => {
  return (
    <Center h="100vh" position="relative">
      <Navbar />
      <MotionBox
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        p={10}
      >
        <VStack gap={6} textAlign="center">
          <BaseIcon boxSize={"80px"} borderRadius={"full"}>
            <Icons.RiBuildingLine size={35} />
          </BaseIcon>

          <Text fontSize="2xl" fontWeight="bold" color={"primary.500"}>
            Propriété introuvable
          </Text>

          <Text color="gray.500" maxW="320px">
            Cette propriété n'existe plus ou le lien est incorrect. Vous pouvez
            consulter les autres biens disponibles.
          </Text>

          <Link href="/properties">
            <BaseButton>Voir les propriétés disponibles</BaseButton>
          </Link>
        </VStack>
      </MotionBox>
    </Center>
  );
};
