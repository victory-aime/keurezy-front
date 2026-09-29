# Plan : `dashboard-quick-actions`

Spec : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md).

## Décisions d'architecture
- **Une fonction pure `createActions(hasPermission)`**, dans `src/app/dashboard/components/create-actions.ts`. Elle renvoie les entrées autorisées `{ label, icon, route }` et elle est testée par Vitest. Le composant ne fait que l'affichage.
- **Le composant `CreateMenu`** repose sur le `Menu` de Chakra v3 (clavier et ARIA natifs). On évite un nouveau composant générique : un seul usage aujourd'hui.
- **L'emplacement** : les props d'action de l'en-tête de `BaseContainer`, si elles acceptent un nœud. Sinon, un `HStack` titre et bouton dans `DashboardStats`. Vérification à l'implémentation, sans modifier `BaseContainer`.
- **La visite guidée** : on garde l'identifiant d'étape `quick-actions` (étape déjà vue par les utilisateurs), en déplaçant sa cible `data-tour` sur le bouton.

## Risques
| Risque | Impact | Mitigation |
|---|---|---|
| Un utilisateur habitué aux cartes ne trouve plus « Voir les terrains » | Faible | C'est de la navigation, déjà présente dans la sidebar. |
| Permissions encore en chargement : le bouton apparaît puis disparaît | Faible | Le bouton n'est rendu qu'une fois les permissions de session lues, comme le filtrage de la sidebar. |

## Ordre
T1 (logique et test) → T2 (composant et intégration) → *checkpoint : ton test* → T3 (visite guidée et audit).
