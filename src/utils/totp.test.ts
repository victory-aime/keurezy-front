import { describe, expect, it } from 'vitest';
import { toBackupCode, totpErrorMessage } from './totp';

describe('totpErrorMessage', () => {
  it('signale un code invalide pour 400 et 401', () => {
    expect(totpErrorMessage(400)).toBe('Code invalide ou expiré');
    expect(totpErrorMessage(401)).toBe('Code invalide ou expiré');
  });

  it('signale la limite de tentatives', () => {
    expect(totpErrorMessage(429)).toMatch(/Trop de tentatives/);
  });

  it('a un message générique pour le reste', () => {
    expect(totpErrorMessage(500)).toBe('Une erreur est survenue, réessayez');
    expect(totpErrorMessage(undefined)).toBe('Une erreur est survenue, réessayez');
  });
});

describe('toBackupCode', () => {
  it('reforme le code avec le tiret et garde la casse', () => {
    expect(toBackupCode('ycCnPaU7hc'.split(''))).toBe('ycCnP-aU7hc');
  });
});
