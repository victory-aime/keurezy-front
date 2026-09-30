import type { IPropertyImpact } from '../types/models/property';
import type { ILandImpact } from '../types/models/land';
import type { IBuildingImpact } from '../types/models/building';
import type { IMemberImpact } from '../types/models/team';
import type { IAgencyCloseImpact, ISubscriptionCancelImpact } from '../types/models/agency';

/**
 * Règle produit : une suppression ou une fermeture montre d'abord ce qu'elle entraîne.
 * Ces fonctions pures traduisent l'impact renvoyé par le backend en groupes affichés par
 * `ActionImpactDialog`, qui ne fait que l'affichage.
 */

/** `danger` : supprimé définitivement · `warning` : change / à surveiller · `success` : conservé · `blocked` : empêche l'action */
export type ImpactTone = 'danger' | 'warning' | 'success' | 'blocked';

export interface ImpactGroup {
  tone: ImpactTone;
  title: string;
  items: string[];
}

export interface ImpactSummary {
  groups: ImpactGroup[];
  /** Vrai quand l'action est impossible : le bouton de confirmation est désactivé */
  blocked: boolean;
}

/** « 1 annonce » / « 2 annonces » */
const count = (n: number, singular: string, plural = `${singular}s`) =>
  `${n} ${n > 1 ? plural : singular}`;

/** Historique qui empêche une suppression : réservations, discussions, visites (hors zéros). */
function historyItems(impact: IPropertyImpact): string[] {
  const { bookings, visits } = impact;
  const bookingDetails = [
    bookings.upcoming > 0 && `${bookings.upcoming} à venir`,
    bookings.pending > 0 && `${bookings.pending} en attente`,
  ].filter(Boolean);
  return [
    bookings.total > 0 &&
      `${count(bookings.total, 'réservation')}${bookingDetails.length ? ` (dont ${bookingDetails.join(', ')})` : ''}`,
    impact.conversations > 0 && `${count(impact.conversations, 'discussion')} avec des clients`,
    visits.total > 0 &&
      `${count(visits.total, 'visite')}${visits.upcoming > 0 ? ` (dont ${visits.upcoming} à venir)` : ''}`,
  ].filter((item): item is string => !!item);
}

/** Suppression d'un bien : ce qui disparaît, ou ce qui l'empêche (alors : fermer le bien). */
export function propertyDeleteImpact(impact: IPropertyImpact): ImpactSummary {
  if (!impact.canDelete) {
    const blocking = historyItems(impact);

    return {
      blocked: true,
      groups: [
        {
          tone: 'blocked',
          title: 'Ce bien a un historique : il ne peut pas être supprimé',
          items: blocking,
        },
        {
          tone: 'warning',
          title: 'Que faire ?',
          items: [
            'Fermez le bien : ses annonces ne seront plus en ligne et tout son historique sera conservé.',
          ],
        },
      ],
    };
  }

  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Supprimé définitivement',
        items: [
          'Le bien et ses caractéristiques',
          ...(impact.annonces.total > 0
            ? [`${count(impact.annonces.total, 'annonce')} et leurs photos`]
            : []),
          'Ses modalités de location et disponibilités',
          'Cette action est irréversible.',
        ],
      },
    ],
  };
}

/** Fermeture d'un bien : les annonces sortent de la mise en ligne, l'historique reste. */
export function propertyCloseImpact(impact: IPropertyImpact): ImpactSummary {
  const { annonces, bookings, visits } = impact;
  const changes = [
    annonces.online > 0
      ? `${count(annonces.online, 'annonce')} en ligne ${annonces.online > 1 ? 'seront retirées' : 'sera retirée'} : les clients ne verront plus ce bien.`
      : "Aucune annonce en ligne : le bien n'est déjà plus visible des clients.",
    // Fermer n'annule rien : les séjours confirmés restent dus aux clients
    bookings.upcoming > 0 &&
      (bookings.upcoming > 1
        ? `${bookings.upcoming} réservations confirmées à venir restent valides : prévenez les clients ou annulez-les depuis Réservations.`
        : '1 réservation confirmée à venir reste valide : prévenez le client ou annulez-la depuis Réservations.'),
    bookings.pending > 0 &&
      `${count(bookings.pending, 'demande')} en attente ${bookings.pending > 1 ? 'restent' : 'reste'} à traiter.`,
  ].filter((item): item is string => !!item);

  const kept = [
    'Le bien, ses caractéristiques et ses annonces (hors ligne)',
    bookings.total > 0 && count(bookings.total, 'réservation'),
    impact.conversations > 0 && count(impact.conversations, 'discussion'),
    visits.total > 0 && count(visits.total, 'visite'),
  ].filter((item): item is string => !!item);

  return {
    blocked: false,
    groups: [
      { tone: 'warning', title: 'Ce qui change', items: changes },
      { tone: 'success', title: 'Ce qui est conservé', items: kept },
    ],
  };
}

/** Suppression d'un terrain : bloquée tant qu'il porte des bâtiments ou des villas. */
export function landDeleteImpact(impact: ILandImpact): ImpactSummary {
  if (!impact.canDelete) {
    return {
      blocked: true,
      groups: [
        {
          tone: 'blocked',
          title: 'Ce terrain porte des constructions',
          items: [
            ...impact.batiments.map((batiment) => `Bâtiment « ${batiment.name} »`),
            ...(impact.villas > 0 ? [count(impact.villas, 'villa')] : []),
          ],
        },
        {
          tone: 'warning',
          title: 'Que faire ?',
          items: [
            'Supprimez ou déplacez d’abord ces constructions, puis revenez supprimer le terrain.',
          ],
        },
      ],
    };
  }
  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Supprimé définitivement',
        items: [
          'Le terrain, ses caractéristiques et ses documents',
          'Cette action est irréversible.',
        ],
      },
    ],
  };
}

/**
 * Suppression d'un bâtiment : ses biens partent avec lui (cascade). Bloquée dès qu'un de ses
 * biens a un historique ; sinon, les biens et leurs annonces sont nommés en rouge.
 */
export function buildingDeleteImpact(impact: IBuildingImpact): ImpactSummary {
  if (!impact.canDelete) {
    return {
      blocked: true,
      groups: [
        {
          tone: 'blocked',
          title: 'Des biens de ce bâtiment ont un historique',
          items: historyItems(impact),
        },
        {
          tone: 'warning',
          title: 'Que faire ?',
          items: ['Fermez plutôt les biens concernés : leur historique sera conservé.'],
        },
      ],
    };
  }
  const { properties, annonces } = impact;
  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Supprimé définitivement',
        items: [
          'Le bâtiment et ses caractéristiques',
          ...(properties.length > 0
            ? [
                `${count(properties.length, 'bien')} : ${properties.map((property) => `« ${property.title} »`).join(', ')}`,
              ]
            : []),
          ...(annonces.total > 0 ? [`${count(annonces.total, 'annonce')} et leurs photos`] : []),
          'Cette action est irréversible.',
        ],
      },
    ],
  };
}

/** « 150 000 FCFA » (espaces insécables d'Intl remplacées par des espaces simples) */
const formatFcfa = (amount: number) =>
  `${new Intl.NumberFormat('fr-FR').format(amount).replace(/[  ]/g, ' ')} FCFA`;

/**
 * Annulation d'une réservation confirmée par l'agence : le client est prévenu, les dates se
 * libèrent, l'historique est conservé. Aucun remboursement n'est évoqué : pas de paiement en ligne.
 */
export function bookingCancelImpact(booking: {
  clientName: string | null | undefined;
  /** Période lisible, ex. « du 5 au 10 octobre » */
  period: string;
  totalAmount: number;
}): ImpactSummary {
  const who = booking.clientName
    ? `${booking.clientName} sera prévenu(e)`
    : 'Le client sera prévenu';
  return {
    blocked: false,
    groups: [
      {
        tone: 'warning',
        title: 'Ce qui change',
        items: [
          `${who} par notification et par e-mail, avec votre motif.`,
          `Les dates ${booking.period} redeviennent réservables.`,
          ...(booking.totalAmount > 0
            ? [`Le séjour de ${formatFcfa(booking.totalAmount)} n’aura pas lieu.`]
            : []),
        ],
      },
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: [
          'La réservation reste dans l’historique, avec le statut Annulée et votre motif.',
          'La discussion avec le client.',
        ],
      },
    ],
  };
}

/**
 * Retrait d'un membre : son travail est désassigné (pas supprimé), ses accès disparaissent,
 * son compte est seulement désactivé (réinvitable) et ses messages restent dans les discussions.
 */
export function memberRemovalImpact(impact: IMemberImpact): ImpactSummary {
  const { visits, tickets, permissions } = impact;
  const changes = [
    visits.assigned > 0 &&
      `${count(visits.assigned, 'visite')}${visits.upcoming > 0 ? ` (dont ${visits.upcoming} à venir)` : ''} ne lui ${visits.assigned > 1 ? 'seront' : 'sera'} plus assignée${visits.assigned > 1 ? 's' : ''} : réassignez-les.`,
    tickets > 0 &&
      `${count(tickets, 'ticket')} ne lui ${tickets > 1 ? 'seront' : 'sera'} plus assigné${tickets > 1 ? 's' : ''}.`,
  ].filter((item): item is string => !!item);

  return {
    blocked: false,
    groups: [
      ...(changes.length
        ? [{ tone: 'warning' as const, title: 'Ce qui change', items: changes }]
        : []),
      {
        tone: 'danger',
        title: 'Retiré',
        items: [
          "Son accès à l'agence",
          ...(permissions > 0 ? [`Ses ${count(permissions, 'permission')}`] : []),
          'Ses sessions en cours : déconnexion immédiate',
        ],
      },
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: [
          'Ses messages dans les discussions',
          'Son compte, désactivé : vous pourrez le réinviter',
        ],
      },
    ],
  };
}

/** Renvoi d'une invitation : un nouveau mot de passe temporaire remplace le précédent. */
export function invitationResendImpact(email: string): ImpactSummary {
  return {
    blocked: false,
    groups: [
      {
        tone: 'warning',
        title: 'Ce qui change',
        items: [
          `Un nouveau mot de passe temporaire sera envoyé à ${email}.`,
          'L’ancien mot de passe envoyé ne fonctionnera plus.',
          'L’invitation sera valable 7 jours à partir d’aujourd’hui.',
        ],
      },
    ],
  };
}

/** Annulation d'une invitation : le lien devient invalide, la place du plan est libérée. */
export function invitationCancelImpact(email: string): ImpactSummary {
  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Ce qui change',
        items: [`Le lien d’invitation envoyé à ${email} ne fonctionnera plus.`],
      },
      {
        tone: 'success',
        title: 'Ce qui est libéré',
        items: [
          'La place réservée sur votre plan est libérée.',
          'Vous pourrez réinviter cette adresse.',
        ],
      },
    ],
  };
}

/**
 * Suppression d'une annonce, avec l'impact du bien auquel elle appartient : seule l'annonce
 * disparaît ; le bien et son historique restent. Si c'était sa dernière annonce en ligne,
 * le bien n'est plus visible des clients.
 */
export function annonceDeleteImpact(
  annonce: { isOnline: boolean },
  /** Absent sans la permission de voir les biens : l'impact reste générique */
  propertyImpact?: IPropertyImpact,
): ImpactSummary {
  const lastOnline = annonce.isOnline && !!propertyImpact && propertyImpact.annonces.online <= 1;
  const kept = propertyImpact
    ? [
        'Le bien et ses caractéristiques',
        propertyImpact.bookings.total > 0 && count(propertyImpact.bookings.total, 'réservation'),
        propertyImpact.conversations > 0 && count(propertyImpact.conversations, 'discussion'),
        propertyImpact.visits.total > 0 && count(propertyImpact.visits.total, 'visite'),
      ].filter((item): item is string => !!item)
    : ['Le bien, ses réservations, discussions et visites'];

  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Supprimé définitivement',
        items: ['L’annonce, son texte et ses photos', 'Cette action est irréversible.'],
      },
      ...(lastOnline
        ? [
            {
              tone: 'warning' as const,
              title: 'Ce qui change',
              items: [
                'C’était la seule annonce en ligne de ce bien : les clients ne le verront plus.',
              ],
            },
          ]
        : []),
      { tone: 'success', title: 'Ce qui est conservé', items: kept },
    ],
  };
}

/** Annulation d'une visite : qui est prévenu, ce qui reste ; une visite effectuée est figée. */
export function visitCancelImpact(visit: {
  status?: string;
  clientName?: string;
  agentName?: string;
}): ImpactSummary {
  if (visit.status === 'DONE') {
    return {
      blocked: true,
      groups: [
        {
          tone: 'blocked',
          title: 'Cette visite a déjà eu lieu',
          items: ['Une visite effectuée ne peut plus être annulée : elle reste dans l’historique.'],
        },
      ],
    };
  }
  const notified = [
    visit.clientName ? `${visit.clientName} (client)` : 'Le client',
    visit.agentName && `${visit.agentName} (agent assigné)`,
  ].filter(Boolean);

  return {
    blocked: false,
    groups: [
      {
        tone: 'warning',
        title: 'Ce qui change',
        items: [
          'La visite passe au statut « Annulée » : le créneau est libéré.',
          `Prévenu${notified.length > 1 ? 's' : ''} par notification : ${notified.join(', ')}.`,
        ],
      },
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: ['La visite reste dans l’historique', 'Le bien et ses réservations'],
      },
    ],
  };
}

/** Désactivation d'un membre (réversible) : accès suspendu, travail toujours assigné. */
export function memberDisableImpact(impact: IMemberImpact): ImpactSummary {
  const { visits, tickets, permissions } = impact;
  const changes = [
    visits.upcoming > 0 &&
      `${count(visits.upcoming, 'visite')} à venir ${visits.upcoming > 1 ? 'lui restent assignées' : 'lui reste assignée'} : réassignez-les si besoin.`,
    tickets > 0 &&
      `${count(tickets, 'ticket')} ${tickets > 1 ? 'lui restent assignés' : 'lui reste assigné'}.`,
  ].filter((item): item is string => !!item);

  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Suspendu',
        items: ["Son accès à l'agence", 'Ses sessions en cours : déconnexion immédiate'],
      },
      ...(changes.length
        ? [{ tone: 'warning' as const, title: 'À surveiller', items: changes }]
        : []),
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: [
          ...(permissions > 0 ? [`Ses ${count(permissions, 'permission')}`] : []),
          'Ses messages et son historique',
          'Son compte : vous pourrez le réactiver à tout moment',
        ],
      },
    ],
  };
}

/**
 * Fermeture de l'agence, différée : rien ne change avant la date effective (délai de grâce
 * appliqué par le backend), puis tout s'arrête. Annulable d'ici là.
 */
export function agencyCloseImpact(impact: IAgencyCloseImpact, now = new Date()): ImpactSummary {
  const { members, properties, bookings, subscription } = impact;
  const effective = impact.closeScheduledAt
    ? new Date(impact.closeScheduledAt)
    : new Date(now.getTime() + impact.closeDelayDays * 86_400_000);
  const date = effective.toLocaleDateString('fr-FR');

  const changes = [
    properties.online > 0 &&
      `${count(properties.online, 'bien')} en ligne ${properties.online > 1 ? 'seront retirés' : 'sera retiré'} de la recherche publique.`,
    bookings.upcoming > 0 &&
      `${count(bookings.upcoming, 'réservation confirmée')} à venir : prévenez les clients ou annulez-les avant le ${date}.`,
    bookings.pending > 0 &&
      `${count(bookings.pending, 'demande')} en attente ne ${bookings.pending > 1 ? 'seront' : 'sera'} plus traitée${bookings.pending > 1 ? 's' : ''}.`,
  ].filter((item): item is string => !!item);

  return {
    blocked: false,
    groups: [
      {
        tone: 'warning',
        title: `Fermeture programmée le ${date}`,
        items: [
          "Rien ne change d'ici là : votre agence, vos annonces et votre équipe fonctionnent normalement.",
          'Vous pouvez annuler la fermeture à tout moment avant cette date.',
        ],
      },
      {
        tone: 'danger',
        title: `Le ${date}, définitivement`,
        items: [
          'Votre accès propriétaire au tableau de bord',
          ...(members.active > 0
            ? [`L'accès de ${count(members.active, 'membre')} de l'équipe (déconnexion immédiate)`]
            : []),
          subscription ? `L'abonnement ${subscription.plan}` : "L'abonnement",
        ],
      },
      ...(changes.length
        ? [{ tone: 'warning' as const, title: 'Ce qui change', items: changes }]
        : []),
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: [
          `L'historique de l'agence (${count(properties.total, 'bien')}, réservations, paiements) pour vos obligations comptables`,
        ],
      },
    ],
  };
}

/** Fermeture de sessions (une ou toutes les autres) : appareils déconnectés, session actuelle gardée. */
export function sessionRevokeImpact(devices: string[]): ImpactSummary {
  return {
    blocked: devices.length === 0,
    groups: devices.length
      ? [
          {
            tone: 'danger',
            title: `Déconnecté${devices.length > 1 ? 's' : ''} immédiatement`,
            items: devices,
          },
          {
            tone: 'success',
            title: 'Ce qui est conservé',
            items: [
              'Votre session actuelle sur cet appareil',
              'Ces appareils pourront se reconnecter avec vos identifiants',
            ],
          },
        ]
      : [{ tone: 'blocked', title: 'Aucune autre session active', items: ['Rien à fermer.'] }],
  };
}

/** Régénération des codes de secours : les anciens cessent de fonctionner immédiatement. */
export function backupCodesRegenerateImpact(remaining: number): ImpactSummary {
  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Invalidés immédiatement',
        items: [
          remaining > 0
            ? `Vos ${count(remaining, 'code')} de secours actuel${remaining > 1 ? 's' : ''}, y compris ceux déjà enregistrés ou imprimés`
            : 'Vos anciens codes de secours',
        ],
      },
      {
        tone: 'success',
        title: 'Ce que vous obtenez',
        items: [
          '10 nouveaux codes, à télécharger et garder en lieu sûr',
          'Votre application d’authentification continue de fonctionner',
        ],
      },
    ],
  };
}

/** L'owner réinitialise la 2FA d'un membre qui a perdu son téléphone et ses codes. */
export function memberTwoFactorResetImpact(member: { name?: string }): ImpactSummary {
  const who = member.name ?? 'Le membre';
  return {
    blocked: false,
    groups: [
      {
        tone: 'danger',
        title: 'Supprimé',
        items: [
          'Sa configuration de double authentification et ses codes de secours',
          'Ses sessions en cours : déconnexion immédiate',
        ],
      },
      {
        tone: 'warning',
        title: 'Ce qui change',
        items: [
          `${who} se reconnectera avec son seul mot de passe, puis devra réactiver la double authentification.`,
          'Un e-mail le prévient de cette réinitialisation.',
        ],
      },
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: ['Son compte, ses permissions et son historique'],
      },
    ],
  };
}

/**
 * Résiliation de l'abonnement : rien ne change avant l'échéance ; ensuite annonces masquées et
 * tableau de bord en lecture seule, données, réservations confirmées et discussions conservées.
 */
export function subscriptionCancelImpact(impact: ISubscriptionCancelImpact): ImpactSummary {
  const { annonces, members, bookings } = impact;
  const date = impact.activeUntil ? new Date(impact.activeUntil).toLocaleDateString('fr-FR') : null;
  const team = members.active === 1 ? 'le membre' : `les ${members.active} membres`;

  return {
    blocked: false,
    groups: [
      {
        tone: 'success',
        title: date
          ? `Jusqu’au ${date}, rien ne change`
          : 'Jusqu’à la fin de la période, rien ne change',
        items: [
          'Votre agence, vos annonces et votre équipe fonctionnent normalement.',
          'Vous pouvez réactiver votre abonnement à tout moment, sans frais.',
        ],
      },
      {
        tone: 'warning',
        title: date ? `Le ${date}` : 'À la fin de la période',
        items: [
          ...(annonces.online > 0
            ? [
                `${count(annonces.online, 'annonce')} en ligne ${annonces.online > 1 ? 'seront masquées' : 'sera masquée'} du public.`,
              ]
            : []),
          members.active > 0
            ? `Le tableau de bord passera en lecture seule pour vous et ${team} de votre équipe.`
            : 'Le tableau de bord passera en lecture seule.',
        ],
      },
      {
        tone: 'success',
        title: 'Ce qui est conservé',
        items: [
          'Toutes vos données : biens, annonces, équipe et historique.',
          ...(bookings.upcoming > 0
            ? [
                `${count(bookings.upcoming, 'réservation confirmée', 'réservations confirmées')} à venir, à honorer.`,
              ]
            : []),
          'Les discussions avec vos clients, pour leur répondre.',
        ],
      },
    ],
  };
}
