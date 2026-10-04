'use client';

import { Box, Stack } from '@chakra-ui/react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { MotionBox } from '_constants/motion';
import { VariablesColors } from '_theme/variables';
import { BaseText } from '../base-text';
import { BrandLogo } from '../logo';

export interface KeurezyLoaderMessage {
  title: string;
  description?: string;
}

export interface KeurezyLoaderProps {
  visible: boolean;
  /** Ce qui est en cours (« Validation du paiement… ») ; sinon « Chargement… » pour les lecteurs d'écran */
  message?: KeurezyLoaderMessage | null;
  /** Fin de l'animation de sortie */
  onExited?: () => void;
}

/** Dégradé de la charte : violet → turquoise → or. */
const BRAND_GRADIENT = `linear-gradient(90deg, ${VariablesColors.primary}, ${VariablesColors.tertiary}, ${VariablesColors.secondary})`;

/**
 * Loader plein écran de Keurezy : calque aux couleurs du thème qui bloque l'interface, vrai logo,
 * barre de progression indéterminée aux couleurs de la charte, message optionnel. Sans
 * animation si l'utilisateur l'a demandé (logo fixe, barre pleine).
 */
export const KeurezyLoader = ({ visible, message, onExited }: KeurezyLoaderProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <MotionBox
          key="keurezy-loader"
          position="fixed"
          inset={0}
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="bg/85"
          backdropFilter="blur(8px)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
          aria-busy="true"
          px={6}
        >
          <Stack alignItems="center" gap={6} maxW="sm" textAlign="center">
            <MotionBox
              animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrandLogo width={200} priority />
            </MotionBox>

            {/* Barre indéterminée : un segment dégradé qui traverse la piste */}
            <Box
              position="relative"
              w="180px"
              h="4px"
              rounded="full"
              bg="bg.muted"
              overflow="hidden"
              aria-hidden
            >
              {reduceMotion ? (
                <Box position="absolute" inset={0} style={{ background: BRAND_GRADIENT }} />
              ) : (
                <MotionBox
                  position="absolute"
                  top={0}
                  bottom={0}
                  w="45%"
                  rounded="full"
                  style={{ background: BRAND_GRADIENT }}
                  initial={{ left: '-45%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </Box>

            {message ? (
              <Stack gap={1}>
                <BaseText fontWeight="semibold" fontSize="lg">
                  {message.title}
                </BaseText>
                {message.description && <BaseText color="fg.muted">{message.description}</BaseText>}
              </Stack>
            ) : (
              <Box srOnly>Chargement…</Box>
            )}
          </Stack>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};
