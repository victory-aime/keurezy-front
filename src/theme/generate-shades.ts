// theme/generateShades.ts

type Shade = { value: string };
type ShadeMap = Record<number, Shade>;

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100,
    ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Génère un objet de shades (50 → 900) depuis un hex.
 * Le shade 500 correspond à la couleur d'entrée.
 */
export function generateShades(hex: string): ShadeMap {
  const [h, s, l] = hexToHSL(hex);

  // Les shades définissent la lightness relative à la couleur de base (shade 500)
  const shadeConfig: Record<number, number> = {
    50: Math.min(97, l + 42),
    100: Math.min(94, l + 32),
    200: Math.min(88, l + 22),
    300: Math.min(78, l + 12),
    400: Math.min(68, l + 6),
    500: l, // couleur originale
    600: Math.max(10, l - 10),
    700: Math.max(8, l - 20),
    800: Math.max(5, l - 32),
    900: Math.max(3, l - 44),
  };

  return Object.fromEntries(
    Object.entries(shadeConfig).map(([shade, lightness]) => [
      Number(shade),
      { value: hslToHex(h, s, lightness) },
    ]),
  );
}
