import { describe, expect, it } from 'vitest';
import { pickClientIp } from './client-ip';

describe('pickClientIp', () => {
  it("prend l'entrée ajoutée par le dernier proxy de confiance, pas celle du navigateur", () => {
    expect(pickClientIp('6.6.6.6, 41.82.1.2', 1)).toBe('41.82.1.2');
    expect(pickClientIp('6.6.6.6, 41.82.1.2, 10.0.0.1', 2)).toBe('41.82.1.2');
  });

  it('gère une chaîne vide ou plus courte que prévu', () => {
    expect(pickClientIp(null, 1)).toBeUndefined();
    expect(pickClientIp('41.82.1.2', 3)).toBe('41.82.1.2');
  });
});
