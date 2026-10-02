import { describe, expect, it } from 'vitest';
import { colors } from './colors';
import { generateShades } from './generate-shades';
import { contrastRatio, DARK_TEXT, solidOf } from './palettes';

describe('charte : texte lisible sur les teintes pleines', () => {
  it.each([
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'success',
    'warning',
    'info',
    'neutral',
  ] as const)('%s : contraste ≥ 4,5:1', (name) => {
    const { shade, contrast } = solidOf(colors[name]);
    expect(contrastRatio(colors[name][shade].value, contrast)).toBeGreaterThanOrEqual(4.5);
  });

  it('jaune : texte foncé plutôt que blanc', () => {
    expect(solidOf(colors.warning)).toEqual({ shade: 500, contrast: DARK_TEXT });
  });

  it('couleur personnalisée claire : texte foncé', () => {
    expect(solidOf(generateShades('#9be7ff')).contrast).toBe(DARK_TEXT);
  });
});
