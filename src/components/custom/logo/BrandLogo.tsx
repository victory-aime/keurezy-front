'use client';

import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { ASSETS } from '_assets/images';

/** Proportions réelles des fichiers du logo (866 × 288). */
const RATIO = 866 / 288;

/**
 * Logo Keurezy, version claire ou sombre selon le thème appliqué. Les deux images sont rendues
 * et la bonne est affichée en CSS (classe `.dark` posée par next-themes) : aucun écart entre le
 * rendu serveur et le client, et pas de mauvais logo quand le thème suit le système.
 */
export const BrandLogo = ({
  width = 180,
  priority = false,
  alt = 'Keurezy',
}: {
  width?: number;
  /** Logo visible au chargement (en-tête) : chargé en priorité */
  priority?: boolean;
  alt?: string;
}) => {
  const height = Math.round(width / RATIO);
  return (
    <>
      <Box display="block" _dark={{ display: 'none' }}>
        <Image
          src={ASSETS.LOGO}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          style={{ width: `${width}px`, height: 'auto' }}
        />
      </Box>
      <Box display="none" _dark={{ display: 'block' }}>
        <Image
          src={ASSETS.LOGO_DARK}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          style={{ width: `${width}px`, height: 'auto' }}
        />
      </Box>
    </>
  );
};
