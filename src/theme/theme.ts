import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { keyframes, animations } from "./animations";
import { breakpoints } from "./breakpoints";
import { colors } from "./colors";

const config = defineConfig({
  theme: {
    keyframes,
    breakpoints,
    textStyles: {},
    tokens: {
      animations,
      colors,
      fonts: {
        heading: { value: "var(--font-lato)" },
        body: { value: "var(--font-lato)" },
      },
    },
  },
  globalCss: {
    "&::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "&::-webkit-scrollbar-track": {
      width: "6px",
      height: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(194, 199, 202, 1)",
      borderRadius: "24px",
    },
  },
});

export const customTheme = createSystem(defaultConfig, config);
