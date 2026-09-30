# Spec : `subscription-cancel`

> Carte : [spec.md](./spec.md) §1. Dépend de `subscription-overview`. Statut : **à valider**.

## Objectif
L'owner peut résilier sans crainte (l'abonnement reste actif jusqu'à l'échéance), changer d'avis à tout moment, et sait exactement ce qui se passe à l'expiration.

## Règles métier (décisions du 2026-09-30)
1. **Résilier** = `cancelAtPeriodEnd = true`, `canceledAt = now`. Rien ne change avant `currentPeriodEnd`.
2. **Réactiver avant l'échéance** = `cancelAtPeriodEnd = false`, `canceledAt = null`, sans paiement.
3. **Réactiver après expiration** = nouveau paiement (module `subscription-checkout`) ; la période démarre au paiement.
4. **Expiration** (résilié, ou échéance passée sans renouvellement) : `status = INACTIVE`.
   - Toutes les annonces de l'agence disparaissent du public (liste, détail, recherche, nouvelle réservation, nouvelle discussion). **Leur statut n'est pas modifié** : elles réapparaissent seules à la réactivation.
   - Le dashboard passe en **lecture seule** pour l'owner et le staff.
   - **Restent autorisés** : répondre aux conversations existantes ; gérer les réservations **déjà confirmées** (les honorer, les terminer) ; tout ce qui concerne le compte (profil, sécurité, 2FA, récupération) ; la page abonnement et le paiement ; la fermeture d'agence.
5. Un abonnement expiré n'est jamais supprimé ; les données restent intactes.

## Contrat backend
| Méthode | Route | Rôle | Effet |
|---|---|---|---|
| `POST` | `secured/agency/subscription/cancel` `{ agencyId }` | owner | règle 1, idempotent |
| `POST` | `secured/agency/subscription/resume` `{ agencyId }` | owner | règle 2 ; `409 SUBSCRIPTION_EXPIRED` si déjà `INACTIVE` (le front bascule alors vers le paiement) |
| `GET` | `secured/agency/subscription/cancel-impact?agencyId` | owner | `{ activeUntil, annonces: { online }, members: { active }, bookings: { upcoming } }` pour le dialogue |

Mécanismes :
- **Job d'expiration** (`@Cron` horaire, comme `account-recovery`) : `updateMany` des souscriptions `ACTIVE` dont `currentPeriodEnd < now` → `INACTIVE`. Idempotent. Remplace le commentaire `ponytail:` de `plan-feature-policy.service.ts`.
- **Lecture seule** : un guard global `ActiveSubscriptionGuard` refuse `POST/PUT/PATCH/DELETE` des utilisateurs OWNER/AGENT d'une agence `INACTIVE` avec `403 SUBSCRIPTION_INACTIVE`. Les routes autorisées portent `@AllowWhenInactive()`. Liste explicite, testée ; toute nouvelle route d'écriture est bloquée par défaut.
- **Annonces masquées** : un fragment Prisma partagé `publicAnnonceWhere` (`status: ACTIVE` et abonnement de l'agence `ACTIVE`) remplace les `status: ACTIVE` des requêtes publiques (`annonce`, `bookings`, `chat`). Une seule définition.

## UI
- Page abonnement : action secondaire « Résilier mon abonnement » (lien discret, pas de bouton rouge).
- Dialogue : réutilise `ActionImpactDialog`.
  - **Orange (change à la date)** : « Le [date], vos N annonces seront masquées et le tableau de bord passera en lecture seule. »
  - **Vert (conservé)** : données, équipe, réservations confirmées honorées, discussions ouvertes.
  - Confirmation : « Résilier à la fin de la période ».
- Après résiliation : badge « Résiliation programmée », « Actif jusqu'au [date] », bouton principal « Réactiver mon abonnement ».
- Expiré : bandeau global dans le dashboard (« Votre abonnement a expiré — lecture seule ») avec « Réactiver ». Les boutons d'écriture restent visibles mais le 403 `SUBSCRIPTION_INACTIVE` affiche ce même message (pas de logique d'autorisation dupliquée côté front).

## Tests
- **Back** : cancel/resume idempotents ; resume après expiration → 409 ; staff → 403 ; job : seules les périodes échues passent `INACTIVE` ; guard : écriture bloquée, routes autorisées passent, GET toujours permis ; annonces d'une agence `INACTIVE` absentes de la liste publique puis présentes après réactivation.
- **Front** : manuel (résilier, réactiver, simuler l'expiration en base).

## Limites
- **Toujours** : backend seul juge de l'état ; allowlist explicite.
- **Demander d'abord** : ajouter une route à l'allowlist non listée ci-dessus.
- **Jamais** : modifier le statut des annonces à l'expiration ; supprimer des données.

## Critères de succès
1. Résilier puis réactiver ne change rien pour l'agence avant l'échéance.
2. À l'échéance, les annonces disparaissent du public et toute écriture non autorisée renvoie 403.
3. Réponses aux discussions et gestion des réservations confirmées fonctionnent pendant l'expiration.
4. Après paiement, tout revient sans action manuelle.
