/**
 * Libellés et formats d'affichage des abonnements (présentation seulement : les quotas, états et
 * montants viennent du backend).
 */

/** « 30 octobre 2026 » */
export const formatLongDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

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

/** Fonctionnalité d'un plan : nom technique et limite (null = illimitée ou sans compteur). */
export interface PlanFeatureLimit {
  name: string;
  limit: number | null;
}

/** Un changement entre deux plans : gain (plus de capacité, module inclus) ou perte. */
export interface PlanDifference {
  label: string;
  tone: 'gain' | 'loss';
}

/** Ce qui change entre deux plans : « +15 biens immobiliers » (gain), « Comptabilité non incluse » (perte). */
export function planDifferences(
  current: PlanFeatureLimit[],
  target: PlanFeatureLimit[],
): PlanDifference[] {
  const before = new Map(current.map((f) => [f.name, f.limit]));
  const after = new Map(target.map((f) => [f.name, f.limit]));
  const changes: PlanDifference[] = [];
  const gain = (label: string) => changes.push({ label, tone: 'gain' });
  const loss = (label: string) => changes.push({ label, tone: 'loss' });

  for (const [name, limit] of after) {
    const config = labelOf(name);
    if (!config) continue;
    if (!before.has(name)) {
      gain(limit === null ? `${config.unlimited} inclus` : formatFeatureLimit(name, limit));
      continue;
    }
    const previous = before.get(name)!;
    if (previous === limit) continue;
    if (limit === null) gain(config.unlimited ?? name);
    else if (previous === null) loss(formatFeatureLimit(name, limit));
    else {
      const delta = limit - previous;
      const label = Math.abs(delta) === 1 ? config.singular : config.plural;
      (delta > 0 ? gain : loss)(`${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${label}`);
    }
  }
  for (const name of before.keys()) {
    const config = labelOf(name);
    if (config && !after.has(name)) {
      loss(`${config.unlimited ?? capitalize(config.plural ?? name)} non inclus`);
    }
  }
  // Gains d'abord : c'est ce qu'on lit en premier sur une carte
  return [...changes.filter((c) => c.tone === 'gain'), ...changes.filter((c) => c.tone === 'loss')];
}

const RENEWAL_WINDOW_MS = 7 * 86_400_000;

/**
 * « Renouveler » est proposé à partir de J-7 (rappels par e-mail au même moment) et après
 * expiration, jamais si une résiliation est programmée.
 */
export function canRenew(
  subscription: {
    status: 'ACTIVE' | 'INACTIVE';
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  },
  now: Date,
): boolean {
  if (subscription.status === 'INACTIVE') return true;
  if (subscription.cancelAtPeriodEnd || !subscription.currentPeriodEnd) return false;
  return new Date(subscription.currentPeriodEnd).getTime() - now.getTime() <= RENEWAL_WINDOW_MS;
}

/**
 * Le choix couvre-t-il chaque fonctionnalité en surplus sans dépasser sa limite ? Même règle que
 * le backend (qui la revérifie) : le bouton de confirmation reste désactivé tant que c'est faux.
 */
export function keepFitsLimits(
  excess: { feature: string; limit: number }[],
  keep: Record<string, string[]>,
): boolean {
  return excess.every(({ feature, limit }) => (keep[feature]?.length ?? 0) <= limit);
}

/** Plan du catalogue, réduit à ce qui sert à le comparer. */
export interface CatalogPlan {
  id: string;
  monthlyPrice: number;
  features: PlanFeatureLimit[];
}

/**
 * Plus petit plan, plus cher que l'actuel, qui lève la limite d'une fonctionnalité (limite plus
 * haute ou illimitée). null s'il n'y en a pas (déjà au plus haut).
 */
export function nextPlanFor(
  plans: CatalogPlan[],
  currentPlanId: string,
  feature: string,
): CatalogPlan | null {
  const current = plans.find((p) => p.id === currentPlanId);
  if (!current) return null;
  const limitIn = (plan: CatalogPlan) => plan.features.find((f) => f.name === feature);
  const currentLimit = limitIn(current)?.limit ?? 0;
  const lifts = (plan: CatalogPlan) => {
    const target = limitIn(plan);
    return !!target && (target.limit === null || target.limit > currentLimit);
  };
  return (
    plans
      .filter((p) => p.monthlyPrice > current.monthlyPrice && lifts(p))
      .sort((a, b) => a.monthlyPrice - b.monthlyPrice)[0] ?? null
  );
}
