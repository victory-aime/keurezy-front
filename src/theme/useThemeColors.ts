// theme/useThemeColors.ts

import { useToken } from "@chakra-ui/react";

const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);

const hexToRGBA = (hex: string, alpha = 1) => {
  if (!isValidHex(hex)) return `rgba(0,0,0,${alpha})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function useThemeColors(colorType: string = "primary") {
  const shades = useToken("colors", [
    `${colorType}.50`,
    `${colorType}.100`,
    `${colorType}.200`,
    `${colorType}.300`,
    `${colorType}.400`,
    `${colorType}.500`,
    `${colorType}.600`,
    `${colorType}.700`,
    `${colorType}.800`,
    `${colorType}.900`,
  ]);

  const [c50, c100, c200, c300, c400, c500, c600, c700, c800, c900] = shades;

  const map: Record<number, string> = {
    50: c50,
    100: c100,
    200: c200,
    300: c300,
    400: c400,
    500: c500,
    600: c600,
    700: c700,
    800: c800,
    900: c900,
  };

  const getColor = (shade = 500) => map[shade] ?? c500;

  const hexToRGB = (shade = 500, alpha = 1) =>
    hexToRGBA(getColor(shade), alpha);

  const getGradient = (start = 400, mid = 500, end?: number) => {
    const startColor = getColor(start);
    const midColor = getColor(mid);
    const endColor = end ? getColor(end) : midColor;

    return `linear-gradient(135deg, ${startColor}, ${midColor}, ${endColor})`;
  };

  const getHoverGradient = (end = 800, darker = 900, alpha = 1) => {
    const endColor = hexToRGBA(getColor(end), alpha);
    const darkerColor = hexToRGBA(getColor(darker), alpha);

    return `linear-gradient(135deg, ${endColor}, ${darkerColor})`;
  };

  return {
    getColor,
    hexToRGB,
    getGradient,
    getHoverGradient,
  };
}
