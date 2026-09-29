import type { IPropertyImpact } from '../types/models/property';
import type { ILandImpact } from '../types/models/land';
import type { IBuildingImpact } from '../types/models/building';

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
