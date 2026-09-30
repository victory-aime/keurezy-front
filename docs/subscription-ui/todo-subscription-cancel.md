# Tâches : `subscription-cancel`

Vérification commune :
- **web** : `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build` ;
- **[back]** : `pnpm test`, `pnpm build`, entrée dans `CHANGES.md` ;
- commit local après chaque tâche.

## T1 [back] : lecture seule à l'expiration
- [x] `@AllowWhenInactive()` (décorateur de métadonnée) et `ActiveSubscriptionGuard` en `APP_GUARD` : `OWNER`/`AGENT`, méthodes d'écriture, agence de l'utilisateur → abonnement ; `403 SUBSCRIPTION_INACTIVE` sinon.
- [x] Décorateur posé sur les routes de l'allowlist du plan.
- **Tests** : écriture refusée pour une agence `INACTIVE` ; route autorisée acceptée ; `GET` toujours permis ; `USER` et `SUPER_ADMIN` ignorés ; agence `ACTIVE` inchangée.
- **Fichiers** : `guard/active-subscription.guard.ts` (+ spec), `app.module.ts`, contrôleurs de l'allowlist.
- **Taille** : M.

## T2 [back] : annonces masquées
- [x] `publicAnnonceWhere` (dans `annonce/`) : `status: ACTIVE` et abonnement de l'agence `ACTIVE`.
- [x] Utilisé par la liste, le détail, `findPublicPropertyId`, la création de réservation et l'ouverture de discussion.
- **Tests** : annonce d'une agence `INACTIVE` absente de la liste, détail 404, réservation et discussion refusées ; réapparaît quand l'abonnement redevient `ACTIVE`.
- **Fichiers** : `annonce/annonce.service.ts`, `bookings/bookings.service.ts`, `chat/chat.service.ts`, nouveau `annonce/public-annonce.ts` (+ spec).
- **Taille** : M.

## T3 [back] : job d'expiration
- [x] `@Cron` horaire : `ACTIVE` et `currentPeriodEnd < now` → `INACTIVE`. Log du nombre expiré. Résiliations toujours appliquées ; périodes non renouvelées seulement avec `SUBSCRIPTION_EXPIRY_ENABLED=true` (8 abonnements de dev sur 14 ont déjà une période échue).
- [x] Suppression du commentaire `ponytail:` de `getAgencyFeatureContext` (l'expiration existe désormais).
- **Tests** : seules les périodes échues passent `INACTIVE` ; relancer ne change rien.
- **Fichiers** : `packs/subscription.service.ts` (+ spec), `packs/plan-feature-policy.service.ts`.
- **Taille** : S.

## Checkpoint A
- [x] Tests back verts ; filtre public exécuté sur la base de dev sans erreur.
- [ ] En dev, une agence passée `INACTIVE` à la main : écriture refusée, message envoyé, annonces absentes du public.

## T4 [back] : résilier, réactiver, impact
- [x] `POST agency/subscription/cancel` (idempotent), `POST agency/subscription/resume` (`409 SUBSCRIPTION_EXPIRED` si `INACTIVE`), `GET agency/subscription/cancel-impact` ; owner uniquement, `@AllowWhenInactive()` sur cancel et resume.
- **Tests** : idempotence ; resume après expiration → 409 ; staff → 403 ; impact : annonces en ligne, membres actifs, réservations à venir, `activeUntil`.
- **Fichiers** : `packs/subscription.controller.ts`, `packs/subscription.service.ts` (+ spec), `config/api.ts`.
- **Taille** : M.

## T5 : UI résiliation et réactivation
- [x] Données : routes, services, requête d'impact, mutations cancel et resume (invalidation de `AGENCY_SUBSCRIPTION`).
- [x] `subscriptionCancelImpact` dans `_utils/impact` (+ test) ; lien secondaire « Résilier mon abonnement » → `ActionImpactDialog`.
- [x] Résiliation programmée : bouton principal « Réactiver mon abonnement » ; boutons désactivés pendant les mutations.
- **Fichiers** : `store/…` (route, service, queries, constantes), `utils/impact.ts` (+ test), `subscription/components/CancelSubscription.tsx`, `CurrentPlan.tsx`.
- **Dépend de** : T4. **Taille** : M.

## T6 : bandeau d'expiration
- [ ] [back] `subscription-info` renvoie aussi `status` (additif, sous réserve de ton accord).
- [ ] Bandeau dans le layout du dashboard pour owner et staff : « Votre abonnement a expiré : le tableau de bord est en lecture seule. » ; lien « Réactiver » pour l'owner. Après expiration, « Réactiver » renvoie vers le paiement (module checkout) ; en attendant, lien vers la page abonnement.
- **Fichiers** : `agency/agency.service.ts` (back), `types/models/agency.ts`, `dashboard/layout.tsx` ou composant de bandeau.
- **Dépend de** : T1. **Taille** : S.

## Checkpoint B
- [ ] Navigateur : résilier (impact affiché), réactiver, expiration simulée (bandeau, écriture refusée avec message, discussion OK), staff.
- [ ] `security-audit.md` complété (guard, allowlist, fuite d'annonces).
