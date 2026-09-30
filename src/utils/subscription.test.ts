import { describe, expect, it } from 'vitest';
import { featureLabel, formatFeatureLimit, usageRemainingLabel } from './subscription';

describe('featureLabel', () => {
  it('nomme une fonctionnalité limitée par son pluriel', () => {
    expect(featureLabel('manage_users')).toBe('Collaborateurs');
  });

  it('nomme une fonctionnalité sans compteur par son libellé', () => {
    expect(featureLabel('manage_accounting')).toBe('Module de comptabilité');
  });

  it('retombe sur le nom technique pour une fonctionnalité inconnue', () => {
    expect(featureLabel('new_feature')).toBe('new_feature');
  });
});

describe('formatFeatureLimit', () => {
  it('accorde la limite au singulier et au pluriel', () => {
    expect(formatFeatureLimit('manage_users', 1)).toBe('Jusqu’à 1 collaborateur');
    expect(formatFeatureLimit('manage_users', 5)).toBe('Jusqu’à 5 collaborateurs');
  });

  it('affiche le libellé illimité sans limite', () => {
    expect(formatFeatureLimit('manage_properties', null)).toBe('Biens immobiliers illimités');
  });
});

describe('usageRemainingLabel', () => {
  it('accorde le nombre disponible', () => {
    expect(usageRemainingLabel({ state: 'OK', remaining: 6 })).toBe('6 disponibles');
    expect(usageRemainingLabel({ state: 'NEAR_LIMIT', remaining: 1 })).toBe('1 disponible');
  });

  it('annonce la limite atteinte et l’illimité', () => {
    expect(usageRemainingLabel({ state: 'REACHED', remaining: 0 })).toBe('Limite atteinte');
    expect(usageRemainingLabel({ state: 'UNLIMITED', remaining: null })).toBe('Illimité');
  });
});
