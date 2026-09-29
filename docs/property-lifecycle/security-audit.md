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
