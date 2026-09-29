# Carte des modules : branchement du dashboard agence (lots backend 1 à 7)

Le backend est prêt sur la branche `feat/agency-management` (commits locaux). Le web doit maintenant :
- consommer les nouvelles routes ;
- afficher les boutons correspondants ;
- ne plus appeler les leads, dont les routes n'existent plus.

Chaque module aura son dossier `docs/<module-id>/` avec `spec.md`, `plan.md` et `todo.md`.

| Module id | Responsabilité | Lots backend | Dépend de |
|---|---|---|---|
| `agency-permissions-ui` | Actions masquées ou désactivées selon les permissions (`usePermissions().hasPermission`, `_utils/app-permissions`). Message 403 générique « Accès non autorisé ». Constantes de permissions alignées sur le seed : ajout terrain, bâtiment, visites, invitations ; retrait des leads. | 1 | — |
| `agency-remove-leads` | Visites rattachées au client : le formulaire liste `visits/agency-clients` et envoie `clientId` ; la liste et le détail lisent `client` et `property`. Suppression du code leads : store, services, types, stats et traductions. | 1 (tâche 1) + 7 | `agency-permissions-ui` |
| `property-lifecycle` | Terrain : branchement de `LandDelete`, déjà présent mais non relié, sur `land/delete-land`. Propriété : actions « Voir » (`property/detail`), « Fermer » (`property/close`) et « Supprimer » (`property/delete`), avec les refus `PROPERTY_HAS_BOOKINGS` et `PROPERTY_IN_USE` expliqués. | 2 | `agency-permissions-ui` |
| `booking-agency-cancel` | Bouton « Annuler la réservation » dans `BookingDetailsModal` pour une réservation confirmée qui n'a pas commencé, avec une modale de motif (sur le modèle de `RejectBookingModal`). Affichage du statut « Terminée ». | 3 | `agency-permissions-ui` |
| `team-lifecycle` | Action « Retirer de l'équipe » dans `TeamList` (owner uniquement, avec confirmation). « Renvoyer » dans la liste des invitations. Messages des refus `USER_NOT_INVITABLE` et `INVITATION_ALREADY_PENDING`. | 4 + réinvitation | `agency-permissions-ui` |
| `visits-period-filter` | Filtre par période (du / au) sur la liste des visites, passé à `agency-visits?from&to`. | 5 | `agency-remove-leads` |
| `dashboard-real-stats` | Le tableau de bord ne génère plus de données aléatoires (`DashboardStats`). Revenus mensuels réels (`property/monthly-revenue`) et taux d'occupation réel (`property/occupation-rate-property-type`), avec sélecteur d'année. | 6 | `agency-permissions-ui` |

**Ordre de construction :**
1. `agency-permissions-ui`
2. `agency-remove-leads`
3. `property-lifecycle`, `booking-agency-cancel` et `team-lifecycle`, indépendants entre eux
4. `visits-period-filter`
5. `dashboard-real-stats`

## Chantier suivant : `destructive-impact-rollout`
Il faut étendre la règle « impact avant l'action », avec `ActionImpactDialog` et un endpoint `impact` côté backend si besoin, aux confirmations qui utilisent encore l'ancien `DeleteModalAnimation` :
- suppression d'annonce (`DeleteAnnonce`) ;
- annulation de visite (`VisitsList`) ;
- désactivation d'un membre par l'interrupteur de statut (`TeamList`) ;
- déconnexion du Drive et corbeille (`integrations`) ;
- désactivation du compte (`profile`, `security`).

## Processus pour chaque module
1. Spécification (`spec-driven-development`), validée par toi.
2. Plan et tâches (`planning-and-task-breakdown`).
3. Implémentation incrémentale (`incremental-implementation`) avec le skill de design `frontend-ui-engineering` : états de chargement, vide, erreur et permission ; accessibilité ; design system Chakra existant.
4. Revue (`code-review-and-quality`), puis **audit de sécurité** (`security-and-hardening`).
5. Code documenté (JSDoc et commentaires d'intention), commit local sur la branche `feat/agency-dashboard-wiring`, sans push.

## Constats sur le dépôt web
- **Aucun framework de test ni script de lint.** La vérification repose sur `npx tsc --noEmit`, `npm run build` et un test manuel guidé.
- Les actions de liste passent par la prop `actions` de `BaseContainer`/table (`name`, `isDisabled`, `handleClick`). Les suppressions utilisent `DeleteModalAnimation`, comme `LandDelete` et `BuildingDelete`.
- Les permissions sont déjà gérées par `usePermissions` (l'owner passe toujours). Seules la liste des propriétés, la sidebar, le chat et les réservations s'en servent aujourd'hui.
