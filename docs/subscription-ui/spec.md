# Spec : `subscription-ui`

> Source : [ui-sepc.md](./ui-sepc.md). Skills appliqués : `spec-driven-development`, `api-and-interface-design`, `frontend-ui-engineering`, `planning-and-task-breakdown`.
> Statut : **à valider** — aucun code avant validation.

## 0. Constat (état réel du code au 2026-09-30)

| Besoin de ui-sepc | Backend aujourd'hui | Front aujourd'hui |
|---|---|---|
| Plan, statut, cycle, prix, période | `Subscription` a tout (`status`, `billingCycle`, `price`, `currency`, `currentPeriodStart/End`, `cancelAtPeriodEnd`, `canceledAt`). **Aucun endpoint ne l'expose** : `GET agency/subscription-info` ne renvoie que `{ plan, features }`. | `IAgencySubscriptionInfo` déclare un `expiresAt` que le backend ne renvoie pas. |
| Statuts | `SubscriptionStatus` = `ACTIVE` \| `INACTIVE` uniquement. Pas d'essai, pas de suspension. | — |
| Consommation | Compteurs existants dans `PlanFeaturePolicyService` : `countPropertyAssets`, `countUserSeats` ; annonces comptées en ligne dans `annonce.service.ts`. `checkCapacity()` calcule déjà `remaining`. **Pas d'endpoint.** | — |
| Fonctionnalités | `PlanFeature` (enabled, limit), `Feature.isCommercial`. | `FEATURE_LABELS` + `formatLimit()` dans `components/pricing/functions/pricing.ts`. |
| Plans disponibles | `GET common/packs` (public). | `getAllPacksQueries`, `PlanCard` (ombre + scale : contraire à la DA demandée). |
| Renouvellement | **Inexistant.** NabooPay = checkout ponctuel, utilisé seulement à l'onboarding. Rien ne se passe à `currentPeriodEnd` (commentaire `ponytail:` dans `plan-feature-policy.service.ts`). | — |
| Changement de plan | **Inexistant.** Le flux de paiement crée une *nouvelle* agence (metadata d'onboarding). | — |
| Résiliation / réactivation | Champs présents, **aucun endpoint, aucun job**. | — |
| Factures | `PaymentTransaction` n'a **ni `agencyId` ni `userId` renseigné** à l'onboarding : impossible de retrouver l'historique d'une agence proprement. | — |

Conclusion : seule la **lecture** peut être livrée sans décision métier. Le reste demande des règles que ui-sepc interdit d'inventer.

## 1. Carte des modules

| Module id | Responsabilité | Dépend de | Bloqué par |
|---|---|---|---|
| `subscription-overview` | Page « Mon abonnement » en lecture : plan, statut, période, échéance, consommation, fonctionnalités | — | rien → **spécifié ci-dessous** |
| `subscription-cancel` | Résilier en fin de période, réactiver, job d'expiration à `currentPeriodEnd` | overview | Q2, Q3 |
| `subscription-checkout` | Paiement NabooPay pour une agence **existante** : renouvellement et changement de plan (choisir → vérifier → confirmer) | overview | Q1, Q4, Q5 |
| `billing-history` | Rattacher `PaymentTransaction` à l'agence + liste paginée | overview | Q6 |

Ordre : `subscription-overview` → `subscription-cancel` → `subscription-checkout` → `billing-history`.
Chaque module suivant aura sa propre spec dans ce dossier (`spec-<module>.md`) une fois ses questions tranchées.

## 2. Hypothèses (à corriger maintenant)

1. La page et son endpoint sont **réservés à l'owner** (comme la fermeture d'agence) : le staff ne voit ni le lien ni les montants.
2. Seuil « limite bientôt atteinte » = **80 %**, décidé et calculé par le backend.
3. Seules les fonctionnalités qui ont un compteur réel ont une jauge : biens (`manage_properties`), annonces (`publish_properties`), places utilisateurs (`manage_users`). `boost_annonces` et `premium_support` apparaissent comme fonctionnalités avec leur limite, sans jauge, tant qu'aucun compteur n'existe.
4. Plans commission (`COMMISSION_BASED`) : **hors produit** (décision du 2026-09-30). Le modèle reste en base, aucune UI ni logique ne les traite.
5. Page web uniquement (pas de mobile, donc rien dans `keurezy-rise-core-apis`).

---

## 3. Spec du module `subscription-overview`

### Objectif
L'owner répond en quelques secondes à : *quel est mon plan, combien je paie, quand est l'échéance, combien j'ai consommé, combien il me reste, quelles fonctionnalités j'ai.*

### Contrat backend (nouveau, additif)
`GET secured/agency/subscription?agencyId=` — owner uniquement (403 sinon). L'endpoint `subscription-info` reste **inchangé** (utilisé par `useAccessControl` pour tout le staff).

```ts
interface AgencySubscriptionOverview {
  subscription: {
    status: 'ACTIVE' | 'INACTIVE';
    plan: { id: string; name: Plan };           // Plan = enum Prisma
    billingCycle: 'MONTHLY' | 'YEARLY' | null;
    price: number | null;                       // Decimal converti en number
    currency: string | null;
    currentPeriodStart: string | null;          // ISO
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
  } | null;                                     // null = aucune souscription
  usage: {
    feature: string;                            // nom technique, ex. "manage_users"
    used: number;
    limit: number | null;                       // null = illimité
    remaining: number | null;
    percentage: number | null;                  // 0–100, null si illimité
    state: 'OK' | 'NEAR_LIMIT' | 'REACHED' | 'UNLIMITED';
  }[];
  features: {
    name: string;
    category: string;
    description: string | null;
    limit: number | null;
    included: boolean;                          // false = présente dans un autre plan actif
  }[];
}
```

Règles :
- `usage` réutilise **les mêmes compteurs** que l'enforcement (`countPropertyAssets`, `countUserSeats`, et un nouveau `countAnnonces` extrait de `annonce.service.ts`) et `checkCapacity()`. Une jauge ne peut donc jamais contredire un refus de création.
- `features` = features commerciales de tous les plans `SUBSCRIPTION_BASED` actifs, `included` selon le plan courant. Aucun prix d'autre plan ici.
- Un abonnement `INACTIVE` n'échoue pas (contrairement à `getAgencyFeatureContext`) : la page doit pouvoir l'afficher.

### UI (skill `frontend-ui-engineering`, DA de ui-sepc)
Route `/dashboard/subscription`, lien « Abonnement » dans le groupe **Compte** de la sidebar, owner uniquement (nouveau champ `ownerOnly` sur `INavItem`).

```
Mon abonnement                                     
Gérez votre plan, votre consommation et votre facturation.
┌ Plan actuel ─────────────────┬ Échéance ─────────────────┐
│ Standard  [Actif]            │ 30 oct. 2026               │
│ 10 000 XOF / mois            │ 10 000 XOF · Mensuel       │
│ Période : 30 sept. → 30 oct. │                            │
└──────────────────────────────┴────────────────────────────┘
Votre utilisation
  Biens            14 / 20   6 disponibles  ▬▬▬▬▬▬▬▭▭▭ 70 %
  Annonces         19 / 20   1 disponible   ▬▬▬▬▬▬▬▬▬▭ 95 %  Bientôt atteint
  Collaborateurs    5 / 5    Limite atteinte ▬▬▬▬▬▬▬▬▬▬
Fonctionnalités de votre plan
  ✓ Statistiques des annonces   ✓ Support premium   ○ Comptabilité — Disponible avec un autre plan
```

- Surfaces : bordure 1px `border.muted`, fond légèrement teinté, **aucune ombre**, radius du design system. Deux colonnes ≥ `md`, empilé en dessous.
- Statut : badge sobre. `ACTIVE` → « Actif », `INACTIVE` → « Inactif ». Si `cancelAtPeriodEnd` → « Résiliation programmée » et le bloc Échéance devient « Votre abonnement reste actif jusqu'au [date] » (pas de montant).
- Jauges : `Progress` Chakra v3 fin (4px), animé 0 → valeur en ~500 ms. `NEAR_LIMIT` = accent orange + texte « Bientôt atteint » ; `REACHED` = texte « Limite atteinte » + icône (jamais la couleur seule, pas de rouge systématique) ; `UNLIMITED` = « Illimité », sans barre.
- Libellés des features : réutiliser `FEATURE_LABELS` (déplacé/exporté si nécessaire, pas dupliqué). Noms de plans : `t('SUBSCRIPTION.PLANS.<name>')`. Montants : `BaseFormatNumber`. Dates : `toLocaleDateString('fr-FR')`.
- Animations : sections en `MotionBox` opacity 0→1, y 6→0, stagger 60 ms ; tout désactivé si `useReducedMotion()` (framer-motion).
- États : squelette (chargement), erreur avec « Réessayer », `subscription: null` → état vide explicite, données partielles (champ `null` → ligne masquée, jamais « undefined »).
- Pas de bouton « Changer de plan » ni « Résilier » dans ce module : ils arrivent avec leurs modules (un bouton qui ne fait rien casse la confiance). `UpgradePlanModal` (sidebar) redirige vers cette page et passe en français.

### Commandes
- Front : `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build`
- Back : `pnpm test`, `pnpm build`

### Structure
```
keurezy-backend/src/modules/packs/         subscription.controller.ts, subscription.service.ts (+ spec),
                                           plan-feature-policy.service.ts (countAnnonces, toUsage)
keurezy-front/src/app/dashboard/subscription/
  page.tsx
  components/  SubscriptionOverview.tsx, CurrentPlan.tsx, UsageOverview.tsx, PlanFeatures.tsx
keurezy-front/src/store/…                  route, service, query, constante (conventions agency)
keurezy-front/src/types/models/agency.ts   IAgencySubscriptionOverview
```

### Tests
- **Back (Jest)** : owner → payload complet ; staff → 403 ; sans souscription → `subscription: null` ; `INACTIVE` renvoyé sans erreur ; `state` à 79 %, 80 %, 100 % et illimité ; `price` est un `number`.
- **Front (Vitest)** : un helper pur de présentation (`usageLabel`) si de la logique d'affichage apparaît ; rien d'autre (pas de calcul métier côté front).
- **Manuel** : owner Standard, créer des biens jusqu'à la limite, vérifier jauge = refus de création ; staff sans lien ; 320 / 768 / 1440 px ; navigation clavier ; reduced motion.

### Limites
- **Toujours** : backend source de vérité ; même compteur pour l'affichage et l'enforcement ; audit sécurité en fin d'implémentation ; code documenté ; commits locaux.
- **Demander d'abord** : toute migration Prisma ; tout nouveau statut ; toute modification de `subscription-info`.
- **Jamais** : calcul de prix, de prorata ou de limite côté front ; données fictives ; bouton d'action sans backend.

### Critères de succès
1. L'owner voit plan, statut, prix, cycle, période et échéance réels de son agence.
2. Chaque jauge correspond exactement au compteur qui bloque la création.
3. Le staff n'a ni lien ni accès (403 vérifié côté API, pas seulement UI).
4. Tous les états listés s'affichent sans erreur console, aux 4 largeurs, au clavier.
5. Audit sécurité rédigé dans `security-audit.md`.

---

## 4. Décisions (2026-09-30)

- **Q2** : à l'expiration, toutes les annonces de l'agence sont masquées et le dashboard passe en **lecture seule** (plus aucune écriture).
- **Q3** : la réactivation est possible **à tout moment**.
- **Q5** : un downgrade s'applique en fin de période, avec les mêmes effets que tout downgrade.
- **Q6** : `agencyId` est ajouté sur `PaymentTransaction`, pour un historique par agence.
- **Q7** : page et endpoint réservés à l'owner.
- **Commission** : hors produit, le modèle reste en base.
- **Q1** : renouvellement manuel via NabooPay, avec rappels par e-mail (pas de changement de prestataire).
- **Q4** : option B, différence au prorata, échéance inchangée.
- **Précisions** : réservations confirmées honorées et discussions ouvertes pendant l'expiration ; réactivation avant l'échéance (sans paiement) et après expiration (avec paiement) ; au downgrade, l'owner choisit ce qui reste actif sur les fonctionnalités limitées, le reste est désactivé.
- Specs détaillées : [spec-subscription-cancel.md](./spec-subscription-cancel.md), [spec-subscription-checkout.md](./spec-subscription-checkout.md), [spec-billing-history.md](./spec-billing-history.md).

## 5. Questions ouvertes (historique de la première version)

- **Q1 — Renouvellement.** Aucun prélèvement automatique n'existe. Que doit-il se passer à `currentPeriodEnd` ? (a) l'owner paie manuellement via NabooPay (bouton « Renouveler » quelques jours avant) ; (b) rien pour l'instant et la page dit « Échéance » sans promettre de facturation. *Pour `overview`, je pars sur (b).*
- **Q2 — Après expiration** (résiliation ou non-renouvellement) : `INACTIVE` bloque déjà les créations. Faut-il aussi masquer les annonces publiques ? Période de grâce ?
- **Q3 — Réactivation** : possible seulement tant que `cancelAtPeriodEnd` et avant `currentPeriodEnd` (proposé), ou aussi après expiration (= nouveau paiement) ?
- **Q4 — Upgrade** : immédiat avec paiement du nouveau plan plein tarif et nouvelle période, ou prorata calculé par le backend ?
- **Q5 — Downgrade** : appliqué en fin de période ? Refusé si la consommation dépasse les limites du plan cible (ex. 8 collaborateurs → Basic à 1) ?
- **Q6 — Historique** : on ajoute `agencyId` sur `PaymentTransaction` (migration + rattrapage des transactions d'onboarding via l'e-mail d'agence du metadata) ? Pas de PDF de facture NabooPay connu : afficher un reçu simple ?
- **Q7** — Hypothèse 1 (owner seul) confirmée ?
