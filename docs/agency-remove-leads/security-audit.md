# Audit de sécurité : `agency-remove-leads`

Date : 2026-09-29. Méthode : skill `security-and-hardening`.

## Modèle de menace
- **Données personnelles des clients** (nom, e-mail, téléphone). La liste `visits/agency-clients` exige `schedule_visit`. Le backend ne renvoie que les clients qui ont réservé ou écrit à **cette** agence, et le filtre est côté serveur. Le web ne demande la liste qu'à l'ouverture du formulaire, et seulement avec la permission. ✅
- **Accès aux ressources d'une autre agence (IDOR).** Le client et le bien envoyés sont revérifiés par le backend (`CLIENT_NOT_LINKED`, `PROPERTY_NOT_FOUND` pour une autre agence). Le web ne sert pas de contrôle. ✅
- **Altération.** En modification, le client et le bien ne sont plus envoyés : le backend ne les accepte pas, et le web ne tente pas de les changer. ✅
- **XSS.** Les libellés (nom, e-mail, titre du bien) passent par le rendu React, qui échappe le contenu. Ni `innerHTML` ni `dangerouslySetInnerHTML`. ✅
- **Surface réduite.** Suppression du code des leads, qui appelait des routes supprimées. ✅

## Diff et dépendances
- Aucun secret ajouté (vérifié par une recherche dans le diff). Aucune nouvelle dépendance. ✅

## Constat hors périmètre (backend)
- `PaginationDto.limitPerPage` n'a **pas de maximum**. Un appelant authentifié peut demander une page très grande (charge serveur). Recommandation : `@Max(100)` sur `limitPerPage`, à traiter avec les mises à jour de sécurité prévues à la fin des modules 1 à 7.

## Verdict
Rien à signaler dans le périmètre.
