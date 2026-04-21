'use client';

import { Center, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import Image from 'next/image';
import { ASSETS } from '_assets/images';
import { motion } from 'framer-motion';
import { MotionBox, MotionVStack } from '_constants/motion';
import { useColorMode } from '_components/ui/color-mode';
import { FloatSwitchColorMode } from '_components/custom';

export const AuthBoxContainer = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: ReactNode;
}) => {
  const { colorMode } = useColorMode();
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
      <MotionBox
        w="full"
        mt="5"
        p={{ base: '4' }}
        maxW={{ base: '100%', sm: '700px' }}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <MotionVStack
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
            <Image
              src={colorMode === 'light' ? ASSETS.LOGO : ASSETS.LOGO_DARK}
              width={45}
              height={45}
              alt="logo"
            />
          </motion.div>

          <Text fontSize="xl" textAlign="center">
            {t(title)}
          </Text>

          <VStack fontSize="sm" color="gray.500" textAlign="center">
            {description}
          </VStack>
        </MotionVStack>

        <MotionBox
          mt={4}
          px={{ base: 0, md: 6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {children}
        </MotionBox>
      </MotionBox>
      <FloatSwitchColorMode />
    </Center>
  );
};
