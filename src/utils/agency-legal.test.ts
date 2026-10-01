import { describe, expect, it } from 'vitest';
import { changesIdentity, verificationState } from './agency-legal';

describe('verificationState', () => {
  it('vérifiée, complète en attente, ou incomplète', () => {
    expect(verificationState({ isVerified: true, legalMissing: [] })).toBe('VERIFIED');
    expect(verificationState({ isVerified: false, legalMissing: [] })).toBe('PENDING');
    expect(verificationState({ isVerified: false, legalMissing: ['ninea'] })).toBe('INCOMPLETE');
  });
});

describe('changesIdentity', () => {
  const current = { companyName: 'Keur Immo SARL', ninea: '00123452G3', rccm: 'SN-DKR-2020-B-1' };

  it('détecte un changement de raison sociale, NINEA ou RCCM', () => {
    expect(changesIdentity(current, { ...current, ninea: '0099999 1A1' })).toBe(true);
    expect(changesIdentity(current, { ...current, companyName: 'Autre' })).toBe(true);
  });

  it("ignore l'écriture (espaces, minuscules) et les autres champs", () => {
    expect(changesIdentity(current, { ...current, ninea: '0012345 2g3' })).toBe(false);
    expect(changesIdentity(current, { ...current, billingAddress: 'Ailleurs' })).toBe(false);
  });
});
