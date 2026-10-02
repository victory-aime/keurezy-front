import { describe, expect, it } from 'vitest';
import {
  canRenew,
  featureLabel,
  formatFeatureLimit,
  isFreePlan,
  keepFitsLimits,
  markNearLimitSeen,
  nearLimitAlreadySeen,
  nextPlanFor,
  remainingAfterAdd,
  planDifferences,
  usageRemainingLabel,
} from './subscription';

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

describe('planDifferences', () => {
  it('chiffre les limites qui changent et nomme les modules gagnés ou perdus', () => {
    const basic = [
      { name: 'manage_properties', limit: 5 },
      { name: 'manage_users', limit: 1 },
    ];
    const standard = [
      { name: 'manage_properties', limit: 20 },
      { name: 'manage_users', limit: 1 },
      { name: 'manage_accounting', limit: null },
    ];
    expect(planDifferences(basic, standard)).toEqual([
      { label: '+15 biens immobiliers', tone: 'gain' },
      { label: 'Module de comptabilité inclus', tone: 'gain' },
    ]);
    expect(planDifferences(standard, basic)).toEqual([
      { label: '−15 biens immobiliers', tone: 'loss' },
      { label: 'Module de comptabilité non inclus', tone: 'loss' },
    ]);
  });

  it('liste les gains avant les pertes', () => {
    const tones = planDifferences(
      [
        { name: 'manage_users', limit: 5 },
        { name: 'manage_properties', limit: 5 },
      ],
      [
        { name: 'manage_users', limit: 1 },
        { name: 'manage_properties', limit: 50 },
      ],
    ).map((c) => c.tone);
    expect(tones).toEqual(['gain', 'loss']);
  });

  it('passe en illimité, ou revient à une limite', () => {
    expect(
      planDifferences(
        [{ name: 'manage_users', limit: 5 }],
        [{ name: 'manage_users', limit: null }],
      ),
    ).toEqual([{ label: 'Collaborateurs illimités', tone: 'gain' }]);
    expect(
      planDifferences(
        [{ name: 'manage_users', limit: null }],
        [{ name: 'manage_users', limit: 1 }],
      ),
    ).toEqual([{ label: 'Jusqu’à 1 collaborateur', tone: 'loss' }]);
  });
});

describe('canRenew', () => {
  const now = new Date('2026-10-24T00:00:00Z');
  const active = { status: 'ACTIVE' as const, cancelAtPeriodEnd: false };

  it('à partir de J-7 et après expiration', () => {
    expect(canRenew({ ...active, currentPeriodEnd: '2026-10-31T00:00:00Z' }, now)).toBe(true);
    expect(canRenew({ ...active, currentPeriodEnd: '2026-11-01T00:00:00Z' }, now)).toBe(false);
    expect(canRenew({ ...active, status: 'INACTIVE', currentPeriodEnd: null }, now)).toBe(true);
  });

  it('jamais avec une résiliation programmée', () => {
    expect(
      canRenew(
        { ...active, cancelAtPeriodEnd: true, currentPeriodEnd: '2026-10-25T00:00:00Z' },
        now,
      ),
    ).toBe(false);
  });
});

describe('keepFitsLimits', () => {
  const excess = [{ feature: 'manage_users', limit: 1 }];

  it('accepte un choix dans la limite, même vide', () => {
    expect(keepFitsLimits(excess, { manage_users: ['s1'] })).toBe(true);
    expect(keepFitsLimits(excess, {})).toBe(true);
  });

  it('refuse un choix au-delà de la limite', () => {
    expect(keepFitsLimits(excess, { manage_users: ['s1', 's2'] })).toBe(false);
  });
});

describe('nextPlanFor', () => {
  const basic = {
    id: 'basic',
    monthlyPrice: 5_000,
    features: [{ name: 'manage_users', limit: 1 }],
  };
  const standard = {
    id: 'standard',
    monthlyPrice: 10_000,
    features: [{ name: 'manage_users', limit: 5 }],
  };
  const premium = {
    id: 'premium',
    monthlyPrice: 18_000,
    features: [{ name: 'manage_users', limit: null }],
  };
  const plans = [premium, basic, standard];

  it('propose le plus petit plan supérieur qui lève la limite', () => {
    expect(nextPlanFor(plans, 'basic', 'manage_users')?.id).toBe('standard');
    expect(nextPlanFor(plans, 'standard', 'manage_users')?.id).toBe('premium');
  });

  it('saute un plan supérieur qui ne lève pas cette limite', () => {
    const sameLimit = { ...standard, features: [{ name: 'manage_users', limit: 1 }] };
    expect(nextPlanFor([basic, sameLimit, premium], 'basic', 'manage_users')?.id).toBe('premium');
  });

  it('rien au plus haut', () => {
    expect(nextPlanFor(plans, 'premium', 'manage_users')).toBeNull();
  });
});

describe('remainingAfterAdd', () => {
  it('dit ce qu’il restera après l’ajout demandé', () => {
    expect(remainingAfterAdd({ used: 16, limit: 20 })).toBe('Après cet ajout, il en restera 3.');
  });

  it('prévient quand l’ajout prend la dernière place', () => {
    expect(remainingAfterAdd({ used: 4, limit: 5 })).toBe(
      'Cet ajout utilisera votre dernière place.',
    );
  });
});

describe('alerte à 80 % : une fois par session et par fonctionnalité', () => {
  it('se souvient de la fonctionnalité déjà signalée, pas des autres', () => {
    expect(nearLimitAlreadySeen('manage_properties')).toBe(false);
    markNearLimitSeen('manage_properties');
    expect(nearLimitAlreadySeen('manage_properties')).toBe(true);
    expect(nearLimitAlreadySeen('manage_users')).toBe(false);
  });
});

describe('isFreePlan', () => {
  it('reconnaît le plan Gratuit', () => {
    expect(isFreePlan({ name: 'FREE_SUB' })).toBe(true);
    expect(isFreePlan({ name: 'BASIC_SUB' })).toBe(false);
    expect(isFreePlan(undefined)).toBe(false);
  });
});

describe('planDifferences : libellés', () => {
  it('ne produit jamais « undefined » (support premium chiffré)', () => {
    const changes = planDifferences(
      [{ name: 'premium_support', limit: 1 }],
      [{ name: 'premium_support', limit: 5 }],
    );
    expect(changes).toEqual([{ label: '+4 demandes de support prioritaire', tone: 'gain' }]);
  });
});

describe('formatFeatureLimit : facturation', () => {
  it('quota mensuel de factures et modèles non inclus', () => {
    expect(formatFeatureLimit('manage_invoices', 30)).toBe('Jusqu’à 30 factures émises par mois');
    expect(formatFeatureLimit('invoice_templates', 1)).toBe(
      'Jusqu’à 1 modèle de facture personnalisé',
    );
    expect(formatFeatureLimit('invoice_templates', 0)).toBe('Non inclus dans ce plan');
    expect(formatFeatureLimit('manage_invoices', null)).toBe('Factures illimitées');
  });
});
