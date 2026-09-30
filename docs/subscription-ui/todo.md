# Tâches : `subscription-ui` — module `subscription-overview`

Vérification commune :
- **web** : `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build` ;
- **[back]** : `pnpm test`, `pnpm build`, entrée dans `CHANGES.md` ;
- commit local après ton test manuel.

## T1 [back] : compteurs et état de quota partagés
- [x] `PlanFeaturePolicyService.countAnnonces(agencyId)` extrait d'`annonce.service.ts`, qui l'utilise désormais.
- [x] `usageState(check)` : `UNLIMITED` / `REACHED` / `NEAR_LIMIT` (≥ 80 %, constante `NEAR_LIMIT_RATIO`) / `OK`, plus `percentage` arrondi.
- **Tests** : 79 %, 80 %, 100 %, limite `null`, feature désactivée.
- **Fichiers** : `packs/plan-feature-policy.service.ts` (+ spec), `annonce/annonce.service.ts`.
- **Taille** : S.

## T2 [back] : `GET secured/agency/subscription`
- [x] Route `API_URL.AGENCY.SUBSCRIPTION`, Swagger, owner uniquement (`OWNER_ONLY`). Placée dans `PackModule` (`SubscriptionService`, `SubscriptionController`) : `PackModule` importe déjà `AgencyModule`, l'inverse créerait un cycle.
- [x] `getSubscriptionOverview(agencyId, userId)` : souscription (Decimal → number, dates ISO), `usage` (biens, annonces, places), `features` (commerciales des plans actifs, `included`).
- [x] `INACTIVE` et absence de souscription renvoyés sans erreur.
- **Tests** : owner OK ; staff 403 ; sans souscription → `subscription: null` ; `price` est un number ; `included` correct.
- **Fichiers** : `config/api.ts`, `agency/agency.controller.ts`, `agency/agency.service.ts` (+ spec).
- **Dépend de** : T1. **Taille** : M.

## Checkpoint A
- [x] Tests back verts ; appel Swagger en owner, en staff, sur une agence sans souscription.

## T3 : couche données front
- [x] Route `AGENCY.AGENCY_SUBSCRIPTION`, `agency_subscription(agencyId)`, `getAgencySubscriptionQueries`, clé `AGENCY_SUBSCRIPTION`.
- [x] Type `IAgencySubscriptionOverview` ; suppression du faux `expiresAt` d'`IAgencySubscriptionInfo`.
- **Fichiers** : `store/endpoints/route.ts`, `store/services/agency/agency.service.ts`, `store/state-management/agency/{agency.queries,constants}.ts`, `types/models/agency.ts`.
- **Dépend de** : T2. **Taille** : S.

## T4 : page, plan actuel et échéance
- [x] `/dashboard/subscription` : en-tête, `CurrentPlan` (plan, badge statut, prix/cycle ou taux de commission, période), bloc Échéance ou « Actif jusqu'au… » si `cancelAtPeriodEnd`.
- [x] États : squelette, erreur + Réessayer, `subscription: null`, champs `null` masqués.
- [x] Entrée animée (stagger, `useReducedMotion`).
- **Fichiers** : `app/dashboard/subscription/page.tsx`, `components/SubscriptionOverview.tsx`, `components/CurrentPlan.tsx`.
- **Dépend de** : T3. **Taille** : M.

## T5 : consommation et fonctionnalités
- [x] `UsageOverview` : une ligne par quota (libellé `FEATURE_LABELS`, `used / limit`, restant, %, jauge 4px animée, textes `Bientôt atteint` / `Limite atteinte` / `Illimité`).
- [x] `PlanFeatures` : liste légère, incluses ✓, autres « Disponible avec un autre plan ».
- [x] `FEATURE_LABELS` exporté depuis un seul endroit (pas de copie).
- **Fichiers** : `components/UsageOverview.tsx`, `components/PlanFeatures.tsx`, `components/pricing/functions/pricing.ts`.
- **Dépend de** : T4. **Taille** : M.

## T6 : accès et points d'entrée
- [x] `ownerOnly` sur `INavItem`, filtré dans la sidebar (desktop + mobile) ; lien « Abonnement » dans Compte.
- [x] `UpgradePlanModal` : textes FR, bouton « Voir mon abonnement » → `/dashboard/subscription`.
- **Fichiers** : `Layout/sidebar/{types.ts,routes/routes.tsx,Sidebar.tsx}`, `components/UpgradePlanModal.tsx`.
- **Dépend de** : T4. **Taille** : S.

## Checkpoint B
- [ ] Owner : valeurs réelles ; créer des biens jusqu'à la limite → jauge = refus.
- [ ] Staff : pas de lien, API 403.
- [ ] 320 / 768 / 1024 / 1440 px, clavier, lecteur d'écran (titres h1/h2), reduced motion.
- [x] `security-audit.md` (skill `security-and-hardening`) : contrôle d'accès owner, aucune donnée de facturation au staff, pas d'IDOR sur `agencyId`.
