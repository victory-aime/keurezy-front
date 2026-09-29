# Audit de sécurité : `property-lifecycle`

Date : 2026-09-29. Méthode : skill `security-and-hardening`.

- **Actions destructrices.**
  - Aucune suppression ni fermeture sans confirmation explicite, et le bouton reste désactivé tant que l'impact n'est pas chargé.
  - Le backend garde la règle réelle (`canDelete`, refus `PROPERTY_HAS_BOOKINGS`, `PROPERTY_IN_USE` et `LAND_HAS_BUILDINGS`). Un contournement de l'interface est refusé côté serveur. ✅
- **Permissions.** Voir (`view_properties`), fermer (`update_property`), supprimer (`delete_property`) et terrains (`manage_land`) sont désactivés sans permission, et le backend les vérifie de nouveau (guard global). ✅
- **Accès aux ressources d'une autre agence (IDOR).** Les identifiants envoyés sont revérifiés par le backend, qui contrôle l'agence propriétaire de la ressource. ✅
- **XSS.** Les noms de bâtiments, titres et adresses passent par le rendu React, qui les échappe. Ni `innerHTML` ni `dangerouslySetInnerHTML`. ✅
- **Données.** L'impact ne contient que des comptages et des noms de bâtiments de l'agence. Aucune donnée client. ✅
- **Diff.** Aucun secret, aucune nouvelle dépendance. ✅

**Verdict** : rien à signaler.

## Correctifs après test manuel (2026-09-29)
- **Données de l'élément précédent** : `rise-core-frontend` applique `keepPreviousData` à toutes les requêtes. Les requêtes propres à un élément (détail et impact d'un bien, impact d'un terrain ou d'un bâtiment, conversation) passent désormais par `ENTITY_QUERY_OPTIONS`. Il n'y a plus d'affichage furtif des données d'un autre élément, ce qui évite aussi de confirmer une action en voyant l'impact d'un autre bien. ✅
- **Dialogue bloqué** : `BaseModal.saveDisabled` ne désactive que la confirmation. « Retour » et l'alternative restent utilisables. ✅
- **Suppression d'un bâtiment** : l'impact est affiché (biens supprimés en cascade), et le backend refuse avec `BUILDING_IN_USE` au lieu d'une erreur 500. ✅
