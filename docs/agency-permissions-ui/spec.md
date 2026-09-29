# Spec : `agency-permissions-ui`

> Module 1 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond au lot 1 du backend : permissions appliquées sur les routes agence.

## Objectif
Depuis le lot 1, le backend refuse avec un 403 « Accès non autorisé » toute action d'un membre (staff) qui n'a pas la permission requise. Aujourd'hui, le web affiche quand même ces actions : le membre clique, puis reçoit une erreur.

**Résultat attendu** : un membre ne voit que ce qu'il peut faire.
- Les liens de la sidebar et les boutons « Ajouter » qu'il ne peut pas utiliser sont masqués.
- Les actions de ligne interdites (modifier, supprimer, annuler…) sont désactivées.
- L'owner voit tout, comme avant.
- Le 403 reste un filet de sécurité, avec un message générique.

**Utilisateurs** : l'owner d'une agence et ses membres.

### Critères d'acceptation
1. `_utils/app-permissions` suit le seed backend :
   - retrait de `LEADS` ;
   - ajout de `LAND` (`manage_land`), `BUILDING` (`manage_batiment`), `VISITS` (`schedule_visit`, `view_visits`, `update_visit`, `cancel_visit`) et `INVITATIONS` (`send_invitation`, `resend_invitation`, `cancel_invitation`) ;
   - dans `PROPERTIES`, les permissions de publication restent (`publish_property`, `unpublish_property`).
2. La sidebar applique ces permissions à ses liens :

   | Lien | Permission |
   |---|---|
   | Terrains | `manage_land` |
   | Bâtiments | `manage_batiment` |
   | Annonces | `view_properties` |
   | Rendez-vous | `view_visits` |
   | Invitations | `view_users` |
   | Équipe | `view_users` |

   Propriétés et Messages sont déjà protégés. Tableau de bord, Réservations, Notifications, Agence et Profil restent visibles de tous.
3. Les boutons « Ajouter » sont masqués (`validatePermission`) sans la permission correspondante :

   | Bouton | Permission |
   |---|---|
   | Propriété | `create_property` |
   | Terrain | `manage_land` |
   | Bâtiment | `manage_batiment` |
   | Annonce | `publish_property` |
   | Visite | `schedule_visit` |
   | Invitation | `send_invitation` |

4. Les actions de ligne sont désactivées (`isDisabled`) sans la permission correspondante :

   | Liste | Action | Permission |
   |---|---|---|
   | Propriétés | modifier | `update_property` (déjà fait) |
   | Propriétés | publier | `publish_property` |
   | Annonces | modifier | `publish_property` |
   | Annonces | supprimer | `unpublish_property` |
   | Terrains et bâtiments | modifier, supprimer | `manage_land` / `manage_batiment` |
   | Visites | modifier | `update_visit` |
   | Visites | annuler | `cancel_visit` |
   | Invitations | annuler | `cancel_invitation` |

5. Une réponse 403 affiche le message renvoyé par l'API, « Accès non autorisé ». Le fallback existant de `handleApiError` couvre une réponse sans message. **Aucun nom de permission n'apparaît à l'écran.**
6. L'owner ne voit aucune différence. Un staff qui a toutes les permissions ne voit aucune différence non plus.

## Stack
- Next.js 16 (App Router), React, TypeScript, Chakra UI v3.
- TanStack Query via `rise-core-frontend`.
- Permissions : `usePermissions()` (`src/app/hooks/usePermissions.tsx`), où l'owner passe toujours.

## Commandes
- Typecheck : `npx tsc --noEmit`
- Build : `npm run build`
- Dev : `npm run dev` (port 5080)
- Tests, ajoutés par ce module : `npx vitest run`

## Structure
- Constantes : `src/utils/app-permissions.ts`
- Sidebar : `src/app/dashboard/Layout/sidebar/routes/routes.tsx` (champ `permission` déjà pris en charge par `Sidebar.tsx`)
- Listes : `src/app/dashboard/{properties,annonces,land,building,visits,invitations}/components/*List.tsx`
- Tests : à côté du fichier testé (`*.test.ts`)
- Documentation : `docs/agency-permissions-ui/`

## Style de code
On réutilise les mécanismes existants et on n'ajoute aucun nouveau composant :

```tsx
const { hasPermission } = usePermissions();

actions: [
  {
    name: 'delete',
    // Action refusée par le backend sans cette permission : désactivée plutôt que masquée
    isDisabled: () => !hasPermission(AppPermissions.LAND.MANAGE),
    handleClick: openDelete,
  },
],
actionsButtonProps={{
  validateTitle: 'Ajouter un terrain',
  validatePermission: hasPermission(AppPermissions.LAND.MANAGE),
}}
```

- Les constantes de permissions sont en `SCREAMING_CASE`, groupées par domaine.
- Une action de ligne est désactivée : on garde la ligne lisible et on montre qu'elle existe. Un point d'entrée (lien, bouton « Ajouter ») est masqué.
- Chaque décision non évidente porte un commentaire d'intention, et chaque fonction exportée une JSDoc.

## Stratégie de tests
- **Mise en place de Vitest** en dépendance de développement (environnement `node`). Aucune dépendance de production.
- **Logique extraite pour être testable.** `usePermissions` expose aujourd'hui `hasPermission` à partir du contexte. La règle devient une fonction pure `canAccess({ isOwner, permissions }, name)` dans `src/utils/permissions.ts`, que le hook appelle.
- **Tests** :
  - l'owner passe toujours ;
  - un membre passe avec la permission ;
  - un membre est refusé sans elle ;
  - une liste de permissions vide refuse tout.
- **Test manuel guidé**, pour un owner puis pour un staff qui n'a que `view_properties` :
  - vérifier la sidebar, les boutons « Ajouter » et les actions désactivées ;
  - appeler directement une route interdite et vérifier le message 403.

## Limites
- **Toujours** :
  - s'appuyer sur `usePermissions` et `AppPermissions`, sans chaîne de permission écrite en dur ;
  - garder le 403 du backend comme source de vérité : le web ne fait que masquer ou désactiver ;
  - lancer `npx tsc --noEmit` et `npx vitest run` ;
  - documenter le code ;
  - faire un audit de sécurité en fin de module.
- **Demander d'abord** :
  - toute autre dépendance que Vitest ;
  - un changement de comportement pour l'owner.
- **Jamais** :
  - afficher un nom de permission à l'utilisateur ;
  - considérer le masquage côté web comme un contrôle de sécurité.

## Mise à jour (après test manuel)
- **Réservations** : le backend ajoute `view_bookings` et `manage_bookings` (`docs/agency-booking-permission` côté backend). Le lien Réservations exige `view_bookings`. Les boutons confirmer et refuser exigent `manage_bookings`.
- **Sidebar** : les requêtes de badge ne partent qu'avec la permission du lien. Sans ça, un staff limité déclenchait des 403 à chaque chargement. Les badges « 5 » écrits en dur sont supprimés.

## Hors périmètre
- Les écrans des leads : ils sont retirés par le module `agency-remove-leads`.

## Questions ouvertes
Aucune. Les correspondances entre actions et permissions reprennent celles du backend (lot 1).
