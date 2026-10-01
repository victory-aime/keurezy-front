# Tâches : informations légales de l'agence

Vérification : back `pnpm test`, `pnpm build`, entrée `CHANGES.md` ; web `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build`. Commit local par tâche.

## L1 [back] Schéma et règles
- [x] Migration 19 (additive) : énumération `LegalForm` ; colonnes nullables `companyName`, `legalForm`, `ninea`, `rccm`, `billingAddress`, `billingEmail` sur `agency` ; les agences vérifiées repassent non vérifiées (aucune n'a d'informations légales).
- [x] Fonctions pures `normalizeLegal` (NINEA et RCCM en majuscules, espaces retirés) et `legalMissing` (champs manquants).
- **Tests** : normalisation, champs manquants.

## L2 [back] Routes
- [x] `PATCH secured/agency/legal?agencyId` (owner) : `UpdateAgencyLegalDto` (liste blanche, formats) ; changement d'identité (raison sociale, NINEA, RCCM) sur une agence vérifiée → vérification retirée. Réponse `{ legal, legalMissing, isVerified }`.
- [x] `GET secured/agency/info` : ajoute `legalMissing`.
- [x] `PATCH admin/agency/status` : `isVerified` = informations complètes ; la réponse liste ce qui manque.
- **Tests** : staff refusé ; retrait de la vérification ; adresse modifiée sans retrait ; vérification refusée si incomplet ; aucune donnée légale dans les réponses publiques.

## L3 [web] Page Agence
- [x] Types, service, mutation.
- [x] Section « Informations légales » : formulaire (owner), lecture seule (staff) ; avertissement avant d'enregistrer un changement d'identité sur une agence vérifiée.
- [x] Note de vérification : incomplète (liste), en attente, vérifiée.

## Checkpoint
- [x] Tests et builds verts (back 352, web 79) ; audit ci-dessous.
- [ ] Vérification dans le navigateur (mobile compris) : note selon les 3 cas, formulaire owner, lecture seule staff, confirmation de retrait.
- [x] Dev : Mobelite remise vérifiée après la migration.

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Modification par un tiers | `PATCH agency/legal` : identité de session (`agencyAccessControl`), owner uniquement ; staff `403` (testé). |
| 2 | Contourner la vérification | `isVerified` n'est posé que par le SUPER_ADMIN, et seulement si les informations sont complètes (testé) ; l'owner ne peut pas l'écrire (DTO en liste blanche, testé). Changer l'identité le retire (testé). |
| 3 | Fuite des informations légales | Les réponses publiques sélectionnent leurs champs : seul `isVerified` sort (testé sur la liste publique des biens). `GET agency` est réservé à l'owner et au staff. |
| 4 | Validation | Formats NINEA et RCCM, longueurs, e-mail, énumération de forme juridique, côté backend (le front n'est qu'un confort). |
| 5 | Données personnelles | Données d'entreprise (pas de donnée personnelle sensible) ; supprimées avec l'agence. |
| 6 | Dépendances, secrets | Aucun ajout. |
