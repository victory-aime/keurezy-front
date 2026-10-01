import { describe, expect, it } from 'vitest';
import {
  agencyCloseImpact,
  backupCodesRegenerateImpact,
  memberTwoFactorResetImpact,
  annonceDeleteImpact,
  bookingCancelImpact,
  memberDisableImpact,
  sessionRevokeImpact,
  visitCancelImpact,
  buildingDeleteImpact,
  invitationCancelImpact,
  invitationResendImpact,
  landDeleteImpact,
  memberRemovalImpact,
  propertyCloseImpact,
  propertyDeleteImpact,
  subscriptionCancelImpact,
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

describe('bookingCancelImpact', () => {
  it('dit qui est prévenu, quelles dates se libèrent et ce qui est conservé', () => {
    const summary = bookingCancelImpact({
      clientName: 'Awa Diop',
      period: 'du 5 au 10 octobre',
      totalAmount: 150000,
    });
    expect(summary.blocked).toBe(false);
    const changes = summary.groups.find((group) => group.tone === 'warning')!;
    expect(changes.items).toEqual([
      'Awa Diop sera prévenu(e) par notification et par e-mail, avec votre motif.',
      'Les dates du 5 au 10 octobre redeviennent réservables.',
      'Le séjour de 150 000 FCFA n’aura pas lieu.',
    ]);
    const kept = summary.groups.find((group) => group.tone === 'success')!;
    expect(kept.items).toContain(
      'La réservation reste dans l’historique, avec le statut Annulée et votre motif.',
    );
  });

  it('reste compréhensible sans nom de client', () => {
    const summary = bookingCancelImpact({
      clientName: null,
      period: 'du 1 au 2 mai',
      totalAmount: 0,
    });
    expect(summary.groups[0].items[0]).toBe(
      'Le client sera prévenu par notification et par e-mail, avec votre motif.',
    );
  });
});

describe('memberRemovalImpact', () => {
  it('signale les visites à réassigner, retire les accès et conserve les messages', () => {
    const summary = memberRemovalImpact({
      name: 'Moussa',
      email: 'moussa@example.com',
      visits: { assigned: 3, upcoming: 1 },
      tickets: 0,
      permissions: 4,
    });
    const changes = summary.groups.find((group) => group.tone === 'warning')!;
    expect(changes.items).toEqual([
      '3 visites (dont 1 à venir) ne lui seront plus assignées : réassignez-les.',
    ]);
    const removed = summary.groups.find((group) => group.tone === 'danger')!;
    expect(removed.items).toContain('Ses 4 permissions');
    expect(removed.items).toContain('Ses sessions en cours : déconnexion immédiate');
    const kept = summary.groups.find((group) => group.tone === 'success')!;
    expect(kept.items).toContain('Son compte, désactivé : vous pourrez le réinviter');
  });

  it("n'affiche pas de changement quand le membre n'a rien d'assigné", () => {
    const summary = memberRemovalImpact({
      name: 'A',
      email: 'a@x.com',
      visits: { assigned: 0, upcoming: 0 },
      tickets: 0,
      permissions: 0,
    });
    expect(summary.groups.some((group) => group.tone === 'warning')).toBe(false);
  });
});

describe('invitation impacts', () => {
  it('renvoi : nouveau mot de passe, ancien invalide, 7 jours', () => {
    const summary = invitationResendImpact('awa@example.com');
    expect(summary.groups[0].items).toEqual([
      'Un nouveau mot de passe temporaire sera envoyé à awa@example.com.',
      'L’ancien mot de passe envoyé ne fonctionnera plus.',
      'L’invitation sera valable 7 jours à partir d’aujourd’hui.',
    ]);
  });

  it('annulation : lien invalide, place libérée, réinvitation possible', () => {
    const summary = invitationCancelImpact('awa@example.com');
    expect(summary.groups[0].items[0]).toBe(
      'Le lien d’invitation envoyé à awa@example.com ne fonctionnera plus.',
    );
    expect(summary.groups[1].items).toContain('Vous pourrez réinviter cette adresse.');
  });
});

describe('annonceDeleteImpact', () => {
  it("prévient quand c'était la dernière annonce en ligne du bien", () => {
    const summary = annonceDeleteImpact(
      { isOnline: true },
      impact({
        annonces: { total: 1, online: 1 },
        bookings: { total: 2, upcoming: 0, pending: 0 },
      }),
    );
    expect(summary.groups.map((group) => group.tone)).toEqual(['danger', 'warning', 'success']);
    expect(summary.groups[2].items).toContain('2 réservations');
  });

  it("ne prévient pas si le bien reste en ligne ou si l'annonce était hors ligne", () => {
    const stillOnline = annonceDeleteImpact(
      { isOnline: true },
      impact({ annonces: { total: 2, online: 2 } }),
    );
    const offline = annonceDeleteImpact({ isOnline: false }, impact());
    expect(stillOnline.groups.some((group) => group.tone === 'warning')).toBe(false);
    expect(offline.groups.some((group) => group.tone === 'warning')).toBe(false);
  });
});

describe('visitCancelImpact', () => {
  it('nomme les personnes prévenues', () => {
    const summary = visitCancelImpact({
      status: 'PLANNED',
      clientName: 'Awa',
      agentName: 'Moussa',
    });
    expect(summary.blocked).toBe(false);
    expect(summary.groups[0].items[1]).toBe(
      'Prévenus par notification : Awa (client), Moussa (agent assigné).',
    );
  });

  it('bloque une visite déjà effectuée', () => {
    expect(visitCancelImpact({ status: 'DONE' }).blocked).toBe(true);
  });
});

describe('memberDisableImpact', () => {
  const member = {
    name: 'Awa',
    email: 'awa@x.sn',
    visits: { assigned: 3, upcoming: 2 },
    tickets: 0,
    permissions: 4,
  };

  it("suspend l'accès, signale les visites à venir et garde les permissions", () => {
    const summary = memberDisableImpact(member);
    expect(summary.groups.map((group) => group.tone)).toEqual(['danger', 'warning', 'success']);
    expect(summary.groups[1].items[0]).toMatch(/^2 visites à venir/);
    expect(summary.groups[2].items[0]).toBe('Ses 4 permissions');
  });
});

describe('agencyCloseImpact', () => {
  const base = {
    members: { active: 2 },
    properties: { total: 5, online: 3 },
    bookings: { upcoming: 1, pending: 0 },
    subscription: { plan: 'PREMIUM', currentPeriodEnd: null },
    closeScheduledAt: null,
    closeDelayDays: 15,
  };

  it("annonce la date effective (dans 15 jours) et que rien ne change d'ici là", () => {
    const summary = agencyCloseImpact(base, new Date('2026-09-30T10:00:00Z'));
    const [grace, definitive, changes] = summary.groups;
    expect(grace.title).toBe('Fermeture programmée le 15/10/2026');
    expect(definitive.items).toContain("L'accès de 2 membres de l'équipe (déconnexion immédiate)");
    expect(changes.items[1]).toMatch(/avant le 15\/10\/2026/);
  });

  it('reprend la date déjà programmée', () => {
    const summary = agencyCloseImpact({ ...base, closeScheduledAt: '2026-10-20T02:00:00Z' });
    expect(summary.groups[0].title).toBe('Fermeture programmée le 20/10/2026');
  });
});

describe('sessionRevokeImpact', () => {
  it('liste les appareils déconnectés et garde la session actuelle', () => {
    const summary = sessionRevokeImpact(['Chrome · macOS', 'Safari · iOS']);
    expect(summary.blocked).toBe(false);
    expect(summary.groups[0].title).toBe('Déconnectés immédiatement');
    expect(summary.groups[0].items).toEqual(['Chrome · macOS', 'Safari · iOS']);
  });

  it("bloque quand il n'y a aucune autre session", () => {
    expect(sessionRevokeImpact([]).blocked).toBe(true);
  });
});

describe('backupCodesRegenerateImpact', () => {
  it('prévient que les codes actuels cessent de fonctionner', () => {
    const summary = backupCodesRegenerateImpact(3);
    expect(summary.groups[0].items[0]).toMatch(/^Vos 3 codes de secours actuels/);
    expect(summary.blocked).toBe(false);
  });
});

describe('memberTwoFactorResetImpact', () => {
  it('nomme le membre et annonce la déconnexion', () => {
    const summary = memberTwoFactorResetImpact({ name: 'Awa' });
    expect(summary.groups[0].items).toContain('Ses sessions en cours : déconnexion immédiate');
    expect(summary.groups[1].items[0]).toMatch(/^Awa se reconnectera/);
  });
});

describe('subscriptionCancelImpact', () => {
  const base = {
    activeUntil: '2026-10-30T00:00:00.000Z',
    annonces: { online: 4 },
    members: { active: 3 },
    bookings: { upcoming: 2 },
    freePlanExcess: [
      { feature: 'manage_properties', used: 5, limit: 2 },
      { feature: 'publish_properties', used: 3, limit: 2 },
      { feature: 'manage_users', used: 3, limit: 0 },
    ],
  };

  it("dit que rien ne change avant l'échéance et que la réactivation reste possible", () => {
    const summary = subscriptionCancelImpact(base);
    expect(summary.blocked).toBe(false);
    expect(summary.groups[0]).toEqual({
      tone: 'success',
      title: 'Jusqu’au 30/10/2026, rien ne change',
      items: [
        'Votre agence, vos annonces et votre équipe fonctionnent normalement.',
        'Vous pouvez réactiver votre abonnement à tout moment, sans frais.',
      ],
    });
  });

  it("détaille ce qui change à l'échéance", () => {
    const changes = subscriptionCancelImpact(base).groups[1];
    expect(changes.tone).toBe('warning');
    expect(changes.title).toBe('Le 30/10/2026');
    expect(changes.items).toEqual([
      'Votre agence passera au plan Gratuit, sans paiement ni échéance.',
      '3 biens sur 5 seront désactivés : les 2 plus anciens restent actifs.',
      '1 annonce en ligne sur 3 sera désactivée : les 2 plus anciennes restent actives.',
      'Vos 3 collaborateurs seront désactivés : le plan Gratuit n’en inclut pas.',
      'Rien n’est supprimé : vous pourrez tout réactiver en reprenant un plan payant.',
    ]);
  });

  it('rappelle ce qui est conservé, dont les réservations à honorer', () => {
    const kept = subscriptionCancelImpact(base).groups[2];
    expect(kept.tone).toBe('success');
    expect(kept.items).toContain('2 réservations confirmées à venir, à honorer.');
    expect(kept.items).toContain('Les discussions avec vos clients, pour leur répondre.');
  });

  it('reste juste sans échéance enregistrée ni annonce en ligne', () => {
    const summary = subscriptionCancelImpact({
      activeUntil: null,
      annonces: { online: 0 },
      members: { active: 0 },
      bookings: { upcoming: 0 },
      freePlanExcess: [],
    });
    expect(summary.groups[0].title).toBe('Jusqu’à la fin de la période, rien ne change');
    expect(summary.groups[1].title).toBe('À la fin de la période');
    expect(summary.groups[1].items).toEqual([
      'Votre agence passera au plan Gratuit, sans paiement ni échéance.',
    ]);
  });
});
