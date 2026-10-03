'use client';

import { Box, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { BaseButton, BaseText, Icons } from '_components/custom';
import { PromoVideo } from '../components/landing/PromoVideo';

/**
 * Lecteur d'enregistrement : la vidéo occupe toute la hauteur de l'écran, sans commandes ni
 * bordure. « Démarrer » la (re)lance depuis le début : lancer l'enregistrement d'écran
 * (QuickTime, OBS…), cliquer, puis recadrer en 1080 × 1920.
 */
export const PromoPlayer = () => {
  const [take, setTake] = useState(0);

  return (
    <Box minH="100dvh" bg="black" display="flex" alignItems="center" justifyContent="center">
      {take === 0 ? (
        <Stack alignItems="center" gap={4} color="white" textAlign="center" px={4}>
          <BaseText color="white" fontSize="lg" fontWeight="bold">
            Keurezy en 20 secondes · 9:16
          </BaseText>
          <BaseText color="whiteAlpha.700" maxW="sm">
            Lancez votre enregistrement d’écran, puis démarrez la vidéo. Elle s’affiche sur toute la
            hauteur, sans commandes.
          </BaseText>
          <BaseButton leftIcon={<Icons.VoicePlay aria-hidden />} onClick={() => setTake(1)}>
            Démarrer
          </BaseButton>
        </Stack>
      ) : (
        <Box
          key={take}
          height="100dvh"
          aspectRatio="9 / 16"
          maxW="100vw"
          onDoubleClick={() => setTake((value) => value + 1)}
          title="Double-cliquez pour rejouer"
        >
          <PromoVideo bare />
        </Box>
      )}
    </Box>
  );
};
