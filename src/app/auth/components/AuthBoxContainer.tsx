"use client";

import { Card, Center, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";
import Image from "next/image";
import { ASSETS } from "_assets/images";
import { motion } from "framer-motion";

const MotionCard = motion(Card.Root);
const MotionHeader = motion(Card.Header);
const MotionBody = motion(Card.Body);

export const AuthBoxContainer = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: ReactNode;
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
      <MotionCard
        size="md"
        w="full"
        mt="5"
        maxW={{ base: "100%", sm: "700px" }}
        border="none"
        borderRadius={{ base: "none", md: "2xl" }}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <MotionHeader
          alignItems="center"
          gap={3}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Image src={ASSETS.LOGO} width={45} height={45} alt="logo" />
          </motion.div>

          <Card.Title fontSize="xl" textAlign="center">
            {t(title)}
          </Card.Title>

          <VStack fontSize="sm" color="gray.500" textAlign="center">
            {description}
          </VStack>
        </MotionHeader>

        <MotionBody
          px={{ base: 0, md: 6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {children}
        </MotionBody>
      </MotionCard>
    </Center>
  );
};
