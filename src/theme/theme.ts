import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { keyframes, animations } from './animations';
import { breakpoints } from './breakpoints';
import { buildColors, colors } from './colors';
import { generateShades } from './generate-shades';

export function buildTheme(primaryHex?: string) {
  // Si on a une couleur custom, on génère ses shades
  // Sinon on part du primary statique (violet par défaut)
  const primaryShades = primaryHex ? generateShades(primaryHex) : colors.primary;

  const dynamicColors = buildColors(primaryShades);

  const config = defineConfig({
    theme: {
      keyframes,
      breakpoints,
      tokens: {
        animations,
        colors: dynamicColors, // ← injection ici
        fonts: {
          heading: { value: 'var(--font-lato)' },
          body: { value: 'var(--font-lato)' },
        },
      },
    },
    globalCss: {
      '&::-webkit-scrollbar': { width: '4px', height: '4px' },
      '&::-webkit-scrollbar-track': { width: '6px' },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(194, 199, 202, 1)',
        borderRadius: '24px',
      },
    },
  });

  return createSystem(defaultConfig, config);
}

export const customTheme = buildTheme();
