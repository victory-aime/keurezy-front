/**
 * Libellés et formats d'affichage des abonnements (présentation seulement : les quotas, états et
 * montants viennent du backend).
 */

/** Libellés des fonctionnalités commerciales, par nom technique en majuscules. */
export const FEATURE_LABELS: Record<
  string,
  {
    singular?: string;
    plural?: string;
    unlimited?: string;
  }
> = {
  MANAGE_PROPERTIES: {
    singular: 'bien immobilier',
    plural: 'biens immobiliers',
    unlimited: 'Biens immobiliers illimités',
  },

  PUBLISH_PROPERTIES: {
    singular: 'annonce immobilière',
    plural: 'annonces immobilières',
    unlimited: 'Annonces immobilières illimitées',
  },

  MANAGE_USERS: {
    singular: 'collaborateur',
    plural: 'collaborateurs',
    unlimited: 'Collaborateurs illimités',
  },

  BOOST_ANNONCES: {
    singular: 'mise en avant',
    plural: 'mises en avant',
    unlimited: 'Mises en avant illimitées',
  },

  VIEW_REPORTS: {
    unlimited: 'Rapports et statistiques avancés',
  },

  MANAGE_ACCOUNTING: {
    unlimited: 'Module de comptabilité',
  },

  ANNONCE_STATS: {
    unlimited: 'Statistiques des annonces',
  },

  PREMIUM_SUPPORT: {
    unlimited: 'Support premium prioritaire',
  },
};

type FeatureLabel = (typeof FEATURE_LABELS)[string];

const labelOf = (name?: string): FeatureLabel | undefined =>
  name ? FEATURE_LABELS[name.toUpperCase()] : undefined;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Nom lisible d'une fonctionnalité : « Collaborateurs », « Module de comptabilité ». */
export function featureLabel(name: string): string {
  const config = labelOf(name);
  if (config?.plural) return capitalize(config.plural);
  return config?.unlimited ?? name;
}

/** Limite d'une fonctionnalité : « Jusqu’à 5 collaborateurs », ou son libellé illimité. */
export function formatFeatureLimit(name: string | undefined, limit: number | null): string {
  const config = labelOf(name);
  if (!config) return '';

  // Feature sans limite numérique
  if (limit === null) return config.unlimited ?? '';

  // Cas simple sans pluralisation
  if (!config.singular && !config.plural) return `${limit} ${config.unlimited}`;

  const label = limit === 1 ? config.singular : config.plural;
  return `Jusqu’à ${limit} ${label}`;
}

/** Ce qui reste avant la limite, selon l'état calculé par le backend. */
export function usageRemainingLabel(usage: {
  state: 'OK' | 'NEAR_LIMIT' | 'REACHED' | 'UNLIMITED';
  remaining: number | null;
}): string {
  if (usage.state === 'UNLIMITED') return 'Illimité';
  if (usage.state === 'REACHED' || !usage.remaining) return 'Limite atteinte';
  return `${usage.remaining} ${usage.remaining === 1 ? 'disponible' : 'disponibles'}`;
}
