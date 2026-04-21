export function rgbaToHex(rgba: string) {
  const result = rgba.match(/\d+/g);
  if (!result) return null;

  const [r, g, b] = result.map(Number);

  return ('#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')).toUpperCase();
}
