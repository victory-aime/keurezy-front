"use client";

import { useMemo } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { customTheme } from "_theme/theme";
//import { createDynamicTheme } from '_theme/dynamic-theme'
//import { usePrimaryColor } from '_hooks/usePrimaryColor'

export function ThemeProvider(props: ColorModeProviderProps) {
  //const { primaryColor } = usePrimaryColor()

  //const customTheme = useMemo(() => createDynamicTheme(primaryColor), [primaryColor])

  return (
    <ChakraProvider value={customTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
