import { describe, expect, it } from 'vitest';
import {
  buildingDeleteImpact,
  landDeleteImpact,
  propertyCloseImpact,
  propertyDeleteImpact,
} from './impact';

const impact = (overrides = {}) => ({
  annonces: { total: 0, online: 0 },
  bookings: { total: 0, upcoming: 0, pending: 0 },
  conversations: 0,
  visits: { total: 0, upcoming: 0 },
  canDelete: true,
  ...overrides,
});

describe('propertyDeleteImpact', () => {
  it('liste ce qui sera supprimé définitivement quand le bien est libre', () => {
    const summary = propertyDeleteImpact(impact({ annonces: { total: 2, online: 1 } }));
    expect(summary.blocked).toBe(false);
    expect(summary.groups[0].tone).toBe('danger');
    expect(summary.groups[0].items).toContain('2 annonces et leurs photos');
  });

  it('bloque la suppression et détaille ce qui la bloque', () => {
    const summary = propertyDeleteImpact(
      impact({
        bookings: { total: 3, upcoming: 1, pending: 1 },
        conversations: 1,
        visits: { total: 2, upcoming: 0 },
        canDelete: false,
      }),
    );
    expect(summary.blocked).toBe(true);
    const blocking = summary.groups.find((group) => group.tone === 'blocked')!;
    expect(blocking.items).toEqual([
      '3 réservations (dont 1 à venir, 1 en attente)',
      '1 discussion avec des clients',
      '2 visites',
    ]);
  });
});

describe('propertyCloseImpact', () => {
  it('annonce les annonces retirées et prévient des réservations à venir maintenues', () => {
    const summary = propertyCloseImpact(
      impact({
        annonces: { total: 3, online: 2 },
        bookings: { total: 4, upcoming: 1, pending: 0 },
      }),
    );
    const changes = summary.groups.find((group) => group.tone === 'warning')!;
    expect(changes.items[0]).toBe(
      '2 annonces en ligne seront retirées : les clients ne verront plus ce bien.',
    );
    expect(changes.items).toContain(
      '1 réservation confirmée à venir reste valide : prévenez le client ou annulez-la depuis Réservations.',
    );
    const kept = summary.groups.find((group) => group.tone === 'success')!;
    expect(kept.items).toContain('4 réservations');
    expect(summary.blocked).toBe(false);
  });
});

describe('landDeleteImpact', () => {
  it('nomme les bâtiments qui bloquent la suppression', () => {
    const summary = landDeleteImpact({
      batiments: [{ id: 'b1', name: 'Résidence A' }],
      villas: 1,
      canDelete: false,
    });
    expect(summary.blocked).toBe(true);
    expect(summary.groups[0].items).toEqual(['Bâtiment « Résidence A »', '1 villa']);
  });

  it('supprime un terrain libre', () => {
    const summary = landDeleteImpact({ batiments: [], villas: 0, canDelete: true });
    expect(summary.blocked).toBe(false);
    expect(summary.groups[0].tone).toBe('danger');
  });
});

describe('buildingDeleteImpact', () => {
  const building = (overrides = {}) => ({
    ...impact(),
    properties: [
      { id: 'p1', title: 'Appartement 1' },
      { id: 'p2', title: 'Appartement 2' },
    ],
    ...overrides,
  });

  it('nomme les biens supprimés avec le bâtiment', () => {
    const summary = buildingDeleteImpact(building({ annonces: { total: 3, online: 1 } }));
    expect(summary.blocked).toBe(false);
    expect(summary.groups[0].tone).toBe('danger');
    expect(summary.groups[0].items).toContain('2 biens : « Appartement 1 », « Appartement 2 »');
    expect(summary.groups[0].items).toContain('3 annonces et leurs photos');
  });

  it('bloque la suppression quand un de ses biens a un historique', () => {
    const summary = buildingDeleteImpact(
      building({ bookings: { total: 1, upcoming: 1, pending: 0 }, canDelete: false }),
    );
    expect(summary.blocked).toBe(true);
    expect(summary.groups[0].tone).toBe('blocked');
    expect(summary.groups[0].items).toContain('1 réservation (dont 1 à venir)');
  });
});
