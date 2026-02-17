"use client";

import { InitializeApp } from "_context/provider/initialize-app";
import { useAuthContext } from "_context/auth-context";
import { ReactNode } from "react";
import { Navbar } from "_component/NavBar";
import { Footer } from "./Footer";
import { Box, IconButton, VStack } from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const MotionBox = motion(Box);
export const UserLayout = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAuthContext();

  // Scroll progress (0 → 1)
  const { scrollYProgress } = useScroll();

  // Spring smoothing (ultra fluide)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.2,
  });

  // Opacité bouton après 10% scroll
  const opacity = useTransform(smoothProgress, [0, 0.1], [0, 1]);

  // Cercle
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = useTransform(
    smoothProgress,
    [0, 1],
    [circumference, 0],
  );

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <InitializeApp isLoading={isLoading}>
      <Navbar />
      <VStack
        alignItems={"center"}
        justifyContent={"flex-start"}
        width={"full"}
        gap={{ base: 6, sm: 12 }}
        py={{ base: 12, sm: 14 }}
      >
        {" "}
        {children}{" "}
      </VStack>
      <Footer />
      <MotionBox
        position="fixed"
        bottom="40px"
        right="25px"
        zIndex={1000}
        style={{ opacity }}
      >
        <Box position="relative" w="60px" h="60px">
          <svg width="60" height="60">
            <circle
              cx="30"
              cy="30"
              r={radius}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="4"
              fill="transparent"
            />
            <motion.circle
              cx="30"
              cy="30"
              r={radius}
              stroke="var(--chakra-colors-primary-500)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset,
              }}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
          </svg>
          <IconButton
            aria-label="Scroll to top"
            onClick={scrollTop}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%) rotate(-90deg)"
            borderRadius="full"
            size="sm"
            bg="primary.500"
            color="white"
            _hover={{
              transform: "translate(-50%, -50%) rotate(-90deg) scale(1.08)",
            }}
          >
            <Icons.ArrowRight />
          </IconButton>
        </Box>
      </MotionBox>
    </InitializeApp>
  );
};
