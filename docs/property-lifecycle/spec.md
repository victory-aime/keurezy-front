# Spec : `property-lifecycle`

> Module 3 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond au lot 2 du backend : suppression d'un terrain, et détail, fermeture et suppression d'une propriété.

## Objectif
Le backend sait désormais supprimer un terrain et voir, fermer ou supprimer une propriété. Le web n'en expose rien :
- `LandDelete` existe mais aucune action ne l'ouvre ;
- la liste des propriétés n'a ni « Voir », ni « Fermer », ni « Supprimer ».

**Résultat attendu** : depuis les listes, l'agence gère le cycle de vie de ses biens. Les refus du backend sont expliqués clairement : terrain qui porte des bâtiments, bien qui a des réservations ou des discussions.

### Critères d'acceptation
1. **Terrains : action « Supprimer »** (`manage_land`).
   - Elle ouvre `LandDelete`. Le texte est corrigé : « …supprimera également tout l'historique… » devient « Le terrain doit être libre de bâtiments et de villas. »
   - Elle appelle ensuite `DELETE land/delete-land?id` via `LandModule.deleteLandMutation`, puis recharge la liste.
   - Le refus `LAND_HAS_BUILDINGS` affiche le message du backend.
2. **Propriétés : action « Voir »** (`view_properties`). Elle ouvre un panneau de détail qui appelle `GET property/detail?id` et affiche :
   - le titre, le type, le statut, le loyer et la caution ;
   - l'adresse (ville, quartier) ;
   - le nombre de pièces et de salles de bain, la surface ;
   - les annonces liées, avec leur statut ;
   - les modalités de location (type de location et prix).
3. **Propriétés : action « Fermer »** (`update_property`). Une confirmation explique : « Ses annonces ne seront plus en ligne ; le bien et son historique sont conservés. » L'action appelle ensuite `POST property/close?id`, puis recharge la liste.
4. **Propriétés : action « Supprimer »** (`delete_property`).
   - Une confirmation précise : « Seul un bien sans réservation ni discussion peut être supprimé ; sinon, fermez-le. »
   - L'action appelle ensuite `DELETE property/delete?id`, puis recharge la liste.
   - Les refus `PROPERTY_HAS_BOOKINGS` et `PROPERTY_IN_USE` affichent le message du backend, qui propose de fermer le bien.
5. Les actions sont désactivées sans la permission, selon la règle du [module 1](../agency-permissions-ui/spec.md).
6. Le typecheck, le build et les tests passent.

## Règle de design : prendre conscience avant d'agir
Toute suppression ou fermeture affiche **l'impact réel**, et non une simple question « Êtes-vous sûr ? ». Les données viennent du backend (`GET property/impact`, `GET land/impact`). Un composant partagé, **`ActionImpactDialog`**, présente des groupes colorés :

| Groupe | Couleur | Exemple |
|---|---|---|
| Supprimé définitivement | rouge (`red`) | « 2 annonces et leurs photos », « Les modalités et disponibilités » |
| Change | orange (`orange`) | « 3 annonces en ligne ne seront plus visibles des clients » |
| Conservé | vert (`green`) | « 4 réservations, dont 1 à venir, restent valides » |
| Bloque l'action | rouge, bouton désactivé | « 2 réservations et 1 discussion : fermez le bien plutôt » |

- **Suppression d'une propriété** :
  - si le backend répond `canDelete: false`, le groupe « Bloque l'action » liste les réservations (à venir, en attente), les discussions et les visites ;
  - le bouton « Supprimer » est alors désactivé, et un bouton « Fermer le bien » est proposé à la place.
- **Fermeture d'une propriété** :
  - annonces en ligne retirées, en orange ;
  - réservations, discussions et visites conservées, en vert.
  - Précision explicite : **les réservations confirmées à venir ne sont pas annulées.**
- **Suppression d'un terrain** : liste des bâtiments (par nom) et nombre de villas qui bloquent. Sinon, le terrain et ses documents sont supprimés, en rouge.
- **Constructeurs purs** : `propertyDeleteImpact`, `propertyCloseImpact` et `landDeleteImpact` transforment l'impact en groupes. Ils sont testés avec Vitest. Le composant ne fait que l'affichage.
- **Accessibilité** : chaque groupe a un titre textuel, et la couleur n'est jamais la seule information. Les nombres sont écrits en toutes lettres dans les phrases. Le bouton désactivé est expliqué par le groupe « Bloque l'action ».

## Store
- `route.ts` :
  - ajout de `PROPERTY_DETAIL` (GET) et `DELETE_PROPERTY` (DELETE) ;
  - `CLOSE_PROPERTY` existe déjà (POST) et passe `id` en query.
- `PropertyService` : `getPropertyDetail`, `getPropertyImpact`, `closeProperty` et `deleteProperty`. `LandService` : ajout de `getLandImpact`. `LandService.delete_land` existe déjà.
- `PropertyModule` :
  - `getPropertyDetailQueries`, activée seulement à l'ouverture du panneau ;
  - `closePropertyMutation` et `deletePropertyMutation`.

## Design (skill `frontend-ui-engineering`)
- **Composants** :
  - le détail s'inspire de `LandDetails` et `BuildingDetails` (`BaseDrawer`, `DetailsModalSection`, `DetailsInfoItem`, `BaseTag` pour les statuts) ;
  - les confirmations utilisent `DeleteModalAnimation`, comme `LandDelete` et `BuildingDelete`.
- **Libellés** : le bouton de confirmation dit l'action (« Fermer le bien », « Supprimer »). La fermeture utilise l'action `cancel` du tableau, avec l'icône de fermeture et le titre « Fermer le bien ».
- **États** :
  - détail : squelette pendant le chargement, « Aucune annonce » et « Aucune modalité » quand c'est vide ;
  - boutons de confirmation : chargement pendant l'appel ;
  - erreur : toast global.
- **Accessibilité** : les actions ont des titres explicites (infobulle et libellé), et le focus est géré par les modales existantes.

## Stratégie de tests
- **Vitest** : les constructeurs d'impact (groupes, tons, blocage, pluriels). Les libellés de modalité viennent de `CONSTANTS.rentalTypes`, déjà existant.
- **Test manuel** :
  - supprimer un terrain vide, puis un terrain avec un bâtiment (refus) ;
  - voir le détail d'une propriété ;
  - fermer une propriété, puis vérifier que ses annonces sont hors ligne ;
  - supprimer une propriété qui a une réservation (refus), puis un bien neuf.

## Limites
- **Toujours** :
  - afficher le message du backend en cas de refus, sans le réinterpréter ;
  - recharger la liste après succès ;
  - documenter le code ;
  - faire l'audit de sécurité.
- **Demander d'abord** : toute suppression en cascade côté web.
- **Jamais** : supprimer sans confirmation ; masquer une erreur backend.

## Questions ouvertes
Aucune.
