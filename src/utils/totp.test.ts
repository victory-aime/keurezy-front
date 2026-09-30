import { describe, expect, it } from 'vitest';
import { toBackupCode, totpErrorMessage, totpFailureKind } from './totp';

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

describe('totpFailureKind', () => {
  it('distingue les limites de Better Auth par leur code', () => {
    expect(totpFailureKind(429, 'ACCOUNT_TEMPORARILY_LOCKED')).toBe('locked');
    expect(totpFailureKind(400, 'TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE')).toBe('challenge-expired');
    expect(totpFailureKind(401, 'INVALID_TWO_FACTOR_COOKIE')).toBe('challenge-expired');
    expect(totpFailureKind(429)).toBe('rate-limited');
    expect(totpFailureKind(401, 'INVALID_CODE')).toBe('invalid');
  });
});

describe('toBackupCode', () => {
  it('reforme le code avec le tiret et garde la casse', () => {
    expect(toBackupCode('ycCnPaU7hc'.split(''))).toBe('ycCnP-aU7hc');
  });
});
