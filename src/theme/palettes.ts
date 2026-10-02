import type { Colors } from './colors';

type Shades = Record<number, { value: string }>;

/** Palettes de la charte utilisables en `colorPalette` (Chakra) et en `colorType` (BaseButton…). */
export const CHART_PALETTES = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'success',
  'warning',
  'info',
  'neutral',
  'error',
] as const;

/** Texte foncé posé sur les couleurs claires (jaune, turquoise…). */
export const DARK_TEXT = '#111827';
const WHITE = '#FFFFFF';

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Rapport de contraste WCAG entre deux couleurs hexadécimales (#RRGGBB). */
export const contrastRatio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * Teinte pleine d'une palette et couleur de son texte : la teinte 500, ou la 600 si elle seule
 * porte un texte blanc lisible (4,5:1) ; à défaut (jaunes, turquoise, couleur personnalisée
 * claire), la teinte 500 avec un texte foncé.
 */
export function solidOf(shades: Shades): { shade: number; contrast: string } {
  for (const shade of [500, 600]) {
    const hex = shades[shade]?.value;
    if (hex && /^#[0-9a-f]{6}$/i.test(hex) && contrastRatio(hex, WHITE) >= 4.5) {
      return { shade, contrast: WHITE };
    }
  }
  return { shade: 500, contrast: DARK_TEXT };
}

/**
 * Jetons sémantiques d'une palette, en clair et en sombre : ce que les composants Chakra lisent
 * pour `colorPalette` (`solid`, `contrast`, `fg`, `subtle`, `muted`, `emphasized`, `focusRing`,
 * `border`). Une teinte absente retombe sur la 500.
 */
function paletteTokens(name: string, shades: Shades) {
  const ref = (shade: number) => `{colors.${name}.${shades[shade] ? shade : 500}}`;
  const both = (light: number, dark: number) => ({
    value: { _light: ref(light), _dark: ref(dark) },
  });
  const { shade, contrast } = solidOf(shades);
  return {
    solid: { value: ref(shade) },
    contrast: { value: contrast },
    fg: both(700, 300),
    subtle: both(50, 900),
    muted: both(100, 800),
    emphasized: both(200, 700),
    border: both(300, 600),
    focusRing: { value: ref(500) },
  };
}

export function paletteSemanticTokens(colors: Colors) {
  return Object.fromEntries(
    CHART_PALETTES.map((name) => [name, paletteTokens(name, colors[name])]),
  );
}
