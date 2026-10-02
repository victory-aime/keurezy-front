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

  MANAGE_INVOICES: {
    singular: 'facture émise par mois',
    plural: 'factures émises par mois',
    unlimited: 'Factures illimitées',
  },

  INVOICE_TEMPLATES: {
    singular: 'modèle de facture personnalisé',
    plural: 'modèles de facture personnalisés',
    unlimited: 'Modèles de facture personnalisés illimités',
  },

  PREMIUM_SUPPORT: {
    singular: 'demande de support prioritaire',
    plural: 'demandes de support prioritaire',
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
  // Limite à 0 : la fonctionnalité n'existe pas dans ce plan, rien à afficher
  if (limit === 0) return '';

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
  // Une limite à 0 vaut « non incluse » : traitée comme une fonctionnalité absente du plan
  const included = (features: PlanFeatureLimit[]) =>
    new Map(features.filter((f) => f.limit !== 0).map((f) => [f.name, f.limit]));
  const before = included(current);
  const after = included(target);
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
      // Sans libellé comptable, la nouvelle limite plutôt qu'un écart illisible
      const label = Math.abs(delta) === 1 ? config.singular : config.plural;
      (delta > 0 ? gain : loss)(
        label
          ? `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${label}`
          : `${config.unlimited ?? name} : ${limit}`,
      );
    }
  }
  for (const name of before.keys()) {
    const config = labelOf(name);
    if (config && !after.has(name)) {
      loss(`${config.plural ? capitalize(config.plural) : (config.unlimited ?? name)} non inclus`);
    }
  }
  // Gains d'abord : c'est ce qu'on lit en premier sur une carte
  return [...changes.filter((c) => c.tone === 'gain'), ...changes.filter((c) => c.tone === 'loss')];
}

const RENEWAL_WINDOW_MS = 7 * 86_400_000;

/** Plan Gratuit : ni prix, ni cycle, ni échéance (pas de renouvellement ni de résiliation). */
export const isFreePlan = (plan: { name: string } | null | undefined) => plan?.name === 'FREE_SUB';

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
  /** Nom technique (FREE_SUB…), libellé par `SUBSCRIPTION.PLANS.<name>` */
  name?: string;
  monthlyPrice: number;
  features: PlanFeatureLimit[];
}

/** Catalogue public réduit à ce qui sert à comparer les plans (plans sans prix mensuel écartés). */
export function toCatalog(
  plans: {
    id: string;
    name: string;
    pricings?: { billingCycle: string; price: number | string }[];
    planFeatures: { limit?: number | null; feature: { name: string; isCommercial?: boolean } }[];
  }[],
): CatalogPlan[] {
  return plans
    .filter((p) => p.pricings?.some((pr) => pr.billingCycle === 'MONTHLY'))
    .map((p) => ({
      id: p.id,
      name: p.name,
      monthlyPrice: Number(p.pricings?.find((pr) => pr.billingCycle === 'MONTHLY')?.price ?? NaN),
      features: p.planFeatures
        .filter((pf) => pf.feature?.isCommercial)
        .map((pf) => ({ name: pf.feature.name, limit: pf.limit ?? null })),
    }));
}

/**
 * Plan le moins cher qui inclut une fonctionnalité (limite non nulle) : celui qu'on propose
 * quand elle est verrouillée. null si aucun plan ne l'inclut.
 */
export function cheapestPlanWith(plans: CatalogPlan[], feature: string): CatalogPlan | null {
  return (
    plans
      .filter((p) =>
        p.features.some((f) => f.name === feature && (f.limit === null || f.limit > 0)),
      )
      .sort((a, b) => a.monthlyPrice - b.monthlyPrice)[0] ?? null
  );
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

/**
 * Phrase de la jauge « bientôt à la limite » : ce qu'il restera après l'ajout demandé.
 * Ex. « Après cet ajout, il en restera 3. » ; « Cet ajout utilisera votre dernière place. »
 */
export function remainingAfterAdd(usage: { used: number; limit: number | null }): string {
  if (usage.limit === null) return '';
  const left = Math.max(usage.limit - usage.used - 1, 0);
  if (left === 0) return 'Cet ajout utilisera votre dernière place.';
  return `Après cet ajout, il en restera ${left}.`;
}

const NEAR_LIMIT_SEEN_KEY = 'keurezy:near-limit-seen';
/** Repli quand le stockage de session est indisponible (navigation privée, etc.). */
const nearLimitSeenInMemory = new Set<string>();

/** L'alerte à 80 % ne s'affiche qu'une fois par session et par fonctionnalité. */
export function nearLimitAlreadySeen(feature: string): boolean {
  try {
    const seen = JSON.parse(sessionStorage.getItem(NEAR_LIMIT_SEEN_KEY) ?? '[]') as string[];
    return seen.includes(feature);
  } catch {
    return nearLimitSeenInMemory.has(feature);
  }
}

export function markNearLimitSeen(feature: string): void {
  nearLimitSeenInMemory.add(feature);
  try {
    const seen = JSON.parse(sessionStorage.getItem(NEAR_LIMIT_SEEN_KEY) ?? '[]') as string[];
    if (!seen.includes(feature)) {
      sessionStorage.setItem(NEAR_LIMIT_SEEN_KEY, JSON.stringify([...seen, feature]));
    }
  } catch {
    // Stockage indisponible : la mémoire du module suffit pour la page en cours
  }
}

/**
 * Lien de téléchargement du reçu PDF d'un paiement. Même origine (réécriture `/api/v1` vers le
 * backend) : le cookie de session part avec, sans passer par le client API.
 */
export const receiptDownloadUrl = (agencyId: string, paymentId: string) =>
  `/api/v1/secure/agency/subscription/payments/receipt?${new URLSearchParams({ agencyId, paymentId })}`;
