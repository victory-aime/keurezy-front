import { describe, expect, it } from 'vitest';
import {
  changesIdentity,
  missingLabel,
  proofFileError,
  proofFileName,
  verificationState,
} from './agency-legal';

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

describe('pièces justificatives', () => {
  it('accepte PDF, PNG et JPEG jusqu’à 5 Mo', () => {
    expect(proofFileError({ type: 'application/pdf', size: 5 * 1024 * 1024 })).toBeNull();
    expect(proofFileError({ type: 'image/jpeg', size: 1000 })).toBeNull();
    expect(proofFileError({ type: 'image/webp', size: 1000 })).toMatch(/PDF, PNG ou JPEG/);
    expect(proofFileError({ type: 'application/pdf', size: 5 * 1024 * 1024 + 1 })).toMatch(/5 Mo/);
  });

  it('nomme un élément manquant, champ ou pièce', () => {
    expect(missingLabel('ninea')).toBe('NINEA');
    expect(missingLabel('rccmProofUrl')).toBe('Extrait du RCCM');
  });

  it('retire le suffixe unique du nom de fichier', () => {
    expect(
      proofFileName(
        'https://res.cloudinary.com/k/raw/upload/v1/agency/a/legal/statuts-3f2a9c1e-1b2c-4d5e-8f90-1234567890ab.pdf',
      ),
    ).toBe('statuts.pdf');
  });
});
