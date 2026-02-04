"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { customTheme } from "_theme/theme";

export function ThemeProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={customTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
