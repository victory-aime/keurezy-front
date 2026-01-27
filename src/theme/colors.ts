type ColorShades = {
  [key: number]: { value: string };
};

export type Colors = {
  primary: ColorShades;
  secondary: ColorShades;
  tertiary: ColorShades;
  blue: ColorShades;
  red: ColorShades;
  orange: ColorShades;
  overlay: ColorShades;
  neutral: ColorShades;
  lighter: ColorShades;
  danger: ColorShades;
  success: ColorShades;
  warning: ColorShades;
  info: ColorShades;
  purple: ColorShades;
  error: ColorShades;
};

const colors: Colors = {
  primary: {
    50: { value: "#F2EDFB" },
    100: { value: "#DED4F3" },
    200: { value: "#BFA9E7" },
    300: { value: "#9F7EDA" },
    400: { value: "#7F58CD" },
    500: { value: "#673ab6" },
    600: { value: "#5A2FA3" },
    700: { value: "#4A2788" },
    800: { value: "#3B1F6D" },
    900: { value: "#2C1752" },
  },

  secondary: {
    50: { value: "#FFF8E1" },
    100: { value: "#FFECB3" },
    200: { value: "#FFE082" },
    300: { value: "#FFD54F" },
    400: { value: "#FFCA28" },
    500: { value: "#e7b008" },
    600: { value: "#C89A06" },
    700: { value: "#A37E05" },
    800: { value: "#7D6104" },
    900: { value: "#574402" },
  },

  tertiary: {
    50: { value: "#E6FAF9" },
    100: { value: "#BFF3EF" },
    200: { value: "#80E6DE" },
    300: { value: "#33D9CE" },
    400: { value: "#00CFC2" },
    500: { value: "#00B3A8" },
    600: { value: "#00998F" },
    700: { value: "#007F76" },
    800: { value: "#00665E" },
    900: { value: "#004D46" },
  },

  danger: {
    50: { value: "#FDECEC" },
    100: { value: "#FAC5C5" },
    200: { value: "#F69C9C" },
    300: { value: "#F17373" },
    400: { value: "#EC4A4A" },
    500: { value: "#D62828" },
    600: { value: "#B11F1F" },
    700: { value: "#8C1717" },
    800: { value: "#660F0F" },
    900: { value: "#400808" },
  },

  success: {
    50: { value: "#E6F8F0" },
    100: { value: "#C2EEDD" },
    200: { value: "#8ADDBE" },
    300: { value: "#52CC9E" },
    400: { value: "#1ABB7E" },
    500: { value: "#009E65" },
    600: { value: "#008756" },
    700: { value: "#006B45" },
    800: { value: "#004F33" },
    900: { value: "#003322" },
  },

  warning: {
    50: { value: "#FFF9E5" },
    100: { value: "#FFF1BF" },
    200: { value: "#FFE680" },
    300: { value: "#FFD940" },
    400: { value: "#FFCC00" },
    500: { value: "#E6B800" },
    600: { value: "#B38F00" },
    700: { value: "#806600" },
    800: { value: "#4D3D00" },
    900: { value: "#332900" },
  },

  purple: {
    50: { value: "#faf5ff" },
    100: { value: "#f3e8ff" },
    200: { value: "#e9d5ff" },
    300: { value: "#d8b4fe" },
    400: { value: "#c084fc" },
    500: { value: "#a855f7" },
    600: { value: "#9333ea" },
    700: { value: "#641ba3" },
    800: { value: "#4a1772" },
    900: { value: "#2f0553" },
    950: { value: "#1a032e" },
  },
  info: {
    50: { value: "#EAF3FE" },
    100: { value: "#CDE2FD" },
    200: { value: "#9FC9FA" },
    300: { value: "#71AFF7" },
    400: { value: "#4396F4" },
    500: { value: "#0D6EFD" },
    600: { value: "#0B60DB" },
    700: { value: "#094CB0" },
    800: { value: "#073885" },
    900: { value: "#04245A" },
  },

  error: {
    50: { value: "#ffebee" },
    100: { value: "#ffcdd2" },
    200: { value: "#ef9a9a" },
    300: { value: "#e57373" },
    400: { value: "#ef5350" },
    500: { value: "#f44336" },
    600: { value: "#e53935" },
    700: { value: "#d32f2f" },
    800: { value: "#c62828" },
    900: { value: "#b71c1c" },
  },

  red: {
    500: { value: "#ec2f4e" },
  },

  neutral: {
    50: { value: "#F9FAFB" },
    100: { value: "#F3F4F6" },
    200: { value: "#E5E7EB" },
    300: { value: "#D1D5DB" },
    400: { value: "#9CA3AF" },
    500: { value: "#C2C7CA" },
    600: { value: "#4B5563" },
    700: { value: "#374151" },
    800: { value: "#1F2937" },
    900: { value: "#111827" },
  },

  overlay: {
    500: { value: "rgba(0,0,0,0.6)" },
  },

  lighter: {
    500: { value: "#F5F7FA" },
  },

  orange: {
    500: { value: "#f97316" },
  },

  blue: {
    500: { value: "#3b82f6" },
  },
};

const getColor = (
  color: keyof Colors = "primary",
  shade: number = 500,
): string => {
  return colors[color]?.[shade]?.value ?? "#000000";
};
/**
 * Get the color with the specified opacity.
 * The color in the theme.
 * The opacity value (0 to 100).
 * @returns The RGBA color string with the specified opacity.
 */
const hexToRGB = (
  color: keyof Colors,
  alpha: number = 1,
  shade: number = 500,
): string => {
  const hex = getColor(color, shade);
  if (!/^#[0-9A-F]{6}$/i.test(hex)) return `rgba(0,0,0,${alpha})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getGradient = (
  colorKey: keyof Colors,
  start: number = 400,
  mid: number = 500,
  end?: number,
): string => {
  const startColor = getColor(colorKey, start);
  const midColor = getColor(colorKey, mid);
  const endColor = end ? getColor(colorKey, end) : midColor;
  return `linear-gradient(135deg, ${startColor}, ${midColor}, ${endColor})`;
};

const getHoverGradient = (
  colorKey: keyof Colors,
  end: number = 800,
  darker: number = 900,
  alpha: number = 1,
): string => {
  const endColor = hexToRGB(colorKey, alpha, end);
  const darkerColor = hexToRGB(colorKey, alpha, darker);
  return `linear-gradient(135deg, ${endColor}, ${darkerColor})`;
};

export { colors, hexToRGB, getColor, getGradient, getHoverGradient };
