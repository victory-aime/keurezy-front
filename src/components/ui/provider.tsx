'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { customTheme } from '_theme/theme';
import { EmotionRegistry } from './emotion-registry';

export function ThemeProvider(props: ColorModeProviderProps) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={customTheme}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </EmotionRegistry>
  );
}
