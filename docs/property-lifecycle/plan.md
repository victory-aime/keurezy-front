# Plan : `property-lifecycle`

Spécification : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md).

## Décisions
- **Impact fourni par le backend.** Le backend expose `property/impact` et `land/impact` (voir `docs/destructive-action-impact` côté backend). Le web n'invente aucune règle : `canDelete` décide.
- **Logique et affichage séparés.**
  - `src/utils/impact.ts` contient les fonctions pures qui transforment l'impact en groupes colorés.
  - `ActionImpactDialog` (`src/app/dashboard/components/`) ne fait qu'afficher.
- **Composant réutilisable.** Le même dialogue servira aux modules 4 (annulation de réservation) et 5 (retrait d'un membre).
- **Alternative proposée.** Une suppression bloquée propose « Fermer le bien » à la place, via le bouton secondaire de `BaseModal`.

## Ordre
1. Types et store.
2. `impact.ts` et ses tests.
3. `ActionImpactDialog`.
4. Terrains : suppression avec impact.
5. Propriétés : détail, fermeture et suppression avec impact.
6. Vérification, revue et audit de sécurité.
