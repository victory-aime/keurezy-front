# Plan : `agency-permissions-ui`

Spécification : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md).

## Décisions
- **Règle d'accès.** Elle passe dans une fonction pure, `canAccess` (`src/utils/permissions.ts`), testée avec Vitest. `usePermissions().hasPermission` l'appelle : il n'existe qu'une seule règle, partagée entre les tests et l'interface.
- **Masquer ou désactiver.**
  - Les points d'entrée sont masqués : liens de la sidebar et boutons « Ajouter » (`validatePermission`).
  - Les actions de ligne sont désactivées (`isDisabled`).
- **Aucun nouveau composant, aucune dépendance de production.**

## Ordre
1. Vitest, `canAccess` et ses tests.
2. Constantes `AppPermissions`.
3. Sidebar.
4. Listes : boutons « Ajouter » et actions.
5. Vérification (typecheck, build), revue, audit de sécurité.

## Risques
| Risque | Mitigation |
|---|---|
| Une page affichée à un membre sans permission, qui déclenche des 403 en boucle | Les liens de la sidebar sont filtrés. Les requêtes de liste restent protégées par le backend, et le toast est générique. |
| Un owner bloqué par erreur | `canAccess` renvoie toujours vrai pour l'owner, et un test le garantit. |
