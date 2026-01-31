"use client";

import { Card, Center } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

export const AuthBoxContainer = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) => {
  const { t } = useTranslation();
  return (
    <Center
      animation={"fade"}
      position="relative"
      minH="100vh"
      w="full"
      px={4}
      py={{ base: 8, md: 16 }}
    >
      <Card.Root size={"md"} rounded={"2xl"} minW={"500px"}>
        <Card.Header>
          <Card.Title
            fontSize={"2xl"}
            fontWeight={"extrabold"}
            textAlign="center"
            color={"primary.500"}
          >
            {t(title)}
          </Card.Title>
          <Card.Description mb={2} textAlign={"center"}>
            {t(description)}
          </Card.Description>
        </Card.Header>
        <Card.Body>{children}</Card.Body>
      </Card.Root>
    </Center>
  );
};
