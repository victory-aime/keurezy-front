import type { IconType } from 'react-icons';
import type { variantColorType } from '_components/custom/button';
import { Icons, NavIcons } from '_components/custom';

/**
 * Contenu de la page d'accueil. Uniquement des fonctions qui existent dans le produit :
 * aucun chiffre inventé, aucun avis client (voir docs/landing-redesign/proposition.md).
 */

export const ANCHORS = {
  video: 'video',
  features: 'fonctionnalites',
  pricing: 'tarifs',
  faq: 'faq',
} as const;

export const TRUST_ITEMS: { icon: IconType; label: string }[] = [
  { icon: Icons.Wallet, label: 'Wave, Orange Money, Mobile Money' },
  { icon: Icons.Payment, label: 'Prix en francs CFA' },
  { icon: Icons.Shield, label: 'Agences vérifiées (NINEA, RCCM)' },
  { icon: Icons.World, label: '100 % en français' },
];

export const AUDIENCES: {
  icon: IconType;
  title: string;
  description: string;
  points: string[];
  soon?: boolean;
}[] = [
  {
    icon: Icons.Office,
    title: 'Agences immobilières',
    description: 'Vous gérez un parc, une équipe et des clients au quotidien.',
    points: [
      'Biens, annonces et réservations au même endroit',
      'Équipe avec des rôles et des permissions',
      'Facturation et statistiques de l’agence',
    ],
  },
  {
    icon: Icons.Home,
    title: 'Petits commerces et propriétaires',
    description: 'Vous louez quelques biens à côté de votre activité.',
    points: [
      'Une offre simplifiée, pensée pour quelques biens',
      'Les mêmes réservations sans double location',
      'Paiement mobile, sans paperasse',
    ],
    soon: true,
  },
];

export const PAINS: { before: string; after: string }[] = [
  {
    before: 'Deux clients pour le même appartement, le même week-end.',
    after: 'Le calendrier se met à jour tout seul : un créneau, une seule réservation confirmée.',
  },
  {
    before: 'Des prospects perdus entre WhatsApp, les appels et les carnets.',
    after: 'Chaque prospect, chaque visite et chaque échange suivis dans une messagerie dédiée.',
  },
  {
    before: 'Des factures refaites à la main sur Word, un reçu égaré.',
    after: 'Factures et reçus générés en un clic, à vos couleurs, retrouvés à tout moment.',
  },
];

/** Ligne d'un aperçu de fonctionnalité (petite maquette à droite de l'onglet). */
export interface PreviewRow {
  title: string;
  meta: string;
  tag?: { label: string; color: variantColorType };
}

export interface Feature {
  label: string;
  icon: IconType;
  title: string;
  description: string;
  bullets: string[];
  preview: { title: string; rows: PreviewRow[] };
}

export const FEATURES: Feature[] = [
  {
    label: 'Biens & annonces',
    icon: NavIcons.Properties,
    title: 'Tout votre parc, rangé',
    description:
      'Appartements, villas, immeubles et terrains : chaque bien a sa fiche, ses photos, ses prix et son statut.',
    bullets: [
      'Quatre modes de location : à la nuit, à la journée, au mois, à l’année',
      'Un prix par mode de location',
      'Annonces publiées en quelques clics',
    ],
    preview: {
      title: 'Mes biens',
      rows: [
        {
          title: 'Villa F5 · Almadies',
          meta: '650 000 XOF / mois',
          tag: { label: 'Disponible', color: 'success' },
        },
        {
          title: 'Studio meublé · Plateau',
          meta: '35 000 XOF / nuit',
          tag: { label: 'Réservé', color: 'info' },
        },
        {
          title: 'Terrain 300 m² · Diamniadio',
          meta: '300 000 XOF / an',
          tag: { label: 'Annonce', color: 'purple' },
        },
      ],
    },
  },
  {
    label: 'Réservations',
    icon: NavIcons.Bookings,
    title: 'Des réservations sans double location',
    description:
      'Les demandes arrivent, vous confirmez : les disponibilités du bien se recalculent automatiquement.',
    bullets: [
      'Une demande en attente ne bloque pas le calendrier',
      'Jamais deux réservations confirmées sur le même créneau',
      'Annulation ou refus : les dates se libèrent seules',
    ],
    preview: {
      title: 'Réservations',
      rows: [
        {
          title: 'Moussa Sarr · Studio Plateau',
          meta: '05/08 → 10/08',
          tag: { label: 'Confirmée', color: 'success' },
        },
        {
          title: 'Fatou Ndiaye · Villa Almadies',
          meta: '12/08 → 15/08',
          tag: { label: 'En attente', color: 'warning' },
        },
        {
          title: 'Ibrahima Fall · F3 Mermoz',
          meta: '01/09 → 30/09',
          tag: { label: 'Refusée', color: 'danger' },
        },
      ],
    },
  },
  {
    label: 'Prospects & messages',
    icon: NavIcons.Messages,
    title: 'Aucun prospect ne se perd',
    description:
      'Chaque contact devient un prospect suivi : visites planifiées, échanges en direct, notifications.',
    bullets: [
      'Messagerie en temps réel : envoyé, distribué, lu',
      'Rendez-vous de visite dans l’agenda',
      'Notifications sur le web et le mobile',
    ],
    preview: {
      title: 'Prospects',
      rows: [
        {
          title: 'Aïssatou Ba',
          meta: 'Visite demain · 10 h 30',
          tag: { label: 'Visite', color: 'tertiary' },
        },
        {
          title: 'Cheikh Diallo',
          meta: '« Le F3 est-il meublé ? »',
          tag: { label: 'Nouveau', color: 'primary' },
        },
        { title: 'Mariama Sow', meta: 'Bail signé', tag: { label: 'Client', color: 'success' } },
      ],
    },
  },
  {
    label: 'Facturation',
    icon: NavIcons.Invoices,
    title: 'Factures et reçus en un clic',
    description:
      'Des factures à l’identité de votre agence, et un historique toujours à portée de main.',
    bullets: [
      'Modèles de factures à vos couleurs',
      'Reçus PDF téléchargeables',
      'Suivi des factures payées et en attente',
    ],
    preview: {
      title: 'Factures',
      rows: [
        {
          title: 'FAC-2026-0142 · M. Sarr',
          meta: '210 000 XOF',
          tag: { label: 'Payée', color: 'success' },
        },
        {
          title: 'FAC-2026-0143 · Mme Ndiaye',
          meta: '140 000 XOF',
          tag: { label: 'En attente', color: 'warning' },
        },
        {
          title: 'FAC-2026-0144 · M. Fall',
          meta: '650 000 XOF',
          tag: { label: 'Envoyée', color: 'info' },
        },
      ],
    },
  },
  {
    label: 'Équipe & sécurité',
    icon: NavIcons.Team,
    title: 'Votre équipe, vos règles',
    description: 'Invitez vos agents et décidez de ce que chacun peut voir et faire.',
    bullets: [
      'Invitations par e-mail',
      'Rôles et permissions par membre',
      'Double authentification et codes de secours',
    ],
    preview: {
      title: 'Équipe',
      rows: [
        { title: 'Awa Diop', meta: 'Gérante', tag: { label: 'Propriétaire', color: 'primary' } },
        {
          title: 'Ousmane Gueye',
          meta: 'Biens, réservations',
          tag: { label: 'Agent', color: 'tertiary' },
        },
        {
          title: 'Khady Mbaye',
          meta: 'Invitation envoyée',
          tag: { label: 'En attente', color: 'warning' },
        },
      ],
    },
  },
];

export const STEPS: { icon: IconType; title: string; description: string }[] = [
  {
    icon: Icons.UserPlus,
    title: 'Créez votre compte',
    description: 'Votre e-mail, un mot de passe, puis le code reçu par e-mail.',
  },
  {
    icon: Icons.Office,
    title: 'Présentez votre agence',
    description: 'Nom, e-mail, téléphone et adresse. Les justificatifs viendront plus tard.',
  },
  {
    icon: Icons.Rocket,
    title: 'Choisissez votre plan',
    description: 'Commencez gratuitement, ou payez par Wave, Orange Money ou Mobile Money.',
  },
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'Le plan Gratuit est-il vraiment gratuit ?',
    answer:
      'Oui. Il ne demande aucun paiement et n’a pas de durée limite. Vous passez à un plan payant seulement quand votre activité en a besoin.',
  },
  {
    question: 'Puis-je changer de plan plus tard ?',
    answer:
      'À tout moment, depuis votre tableau de bord. Un plan supérieur est facturé au prorata des jours restants ; un plan inférieur prend effet à l’échéance.',
  },
  {
    question: 'Comment se passe le paiement ?',
    answer:
      'Par Wave, Orange Money ou Mobile Money, en francs CFA. L’abonnement ne se renouvelle pas tout seul : vous êtes prévenu avant l’échéance et vous choisissez de renouveler.',
  },
  {
    question: 'Que se passe-t-il si je ne renouvelle pas ?',
    answer:
      'Votre agence repasse au plan Gratuit. Ce qui dépasse ses limites est mis en pause, jamais supprimé, et revient dès le renouvellement.',
  },
  {
    question: 'Pourquoi faire vérifier mon agence ?',
    answer:
      'Le badge « Agence vérifiée » montre à vos clients que Keurezy a contrôlé vos statuts, votre NINEA et votre RCCM. Vous joignez ces pièces depuis la page Agence, après l’inscription.',
  },
  {
    question: 'Mes données sont-elles protégées ?',
    answer:
      'Chaque membre n’accède qu’à ce que son rôle permet, la double authentification est disponible, et vos données ne sont jamais revendues.',
  },
];
