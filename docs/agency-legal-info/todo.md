# Tâches : informations légales de l'agence

Vérification : back `pnpm test`, `pnpm build`, entrée `CHANGES.md` ; web `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build`. Commit local par tâche.

## L1 [back] Schéma et règles
- [ ] Migration 19 (additive) : énumération `LegalForm` ; colonnes nullables `companyName`, `legalForm`, `ninea`, `rccm`, `billingAddress`, `billingEmail` sur `agency` ; les agences vérifiées repassent non vérifiées (aucune n'a d'informations légales).
- [ ] Fonctions pures `normalizeLegal` (NINEA et RCCM en majuscules, espaces retirés) et `legalMissing` (champs manquants).
- **Tests** : normalisation, champs manquants.

## L2 [back] Routes
- [ ] `PATCH secured/agency/legal?agencyId` (owner) : `UpdateAgencyLegalDto` (liste blanche, formats) ; changement d'identité (raison sociale, NINEA, RCCM) sur une agence vérifiée → vérification retirée. Réponse `{ legal, legalMissing, isVerified }`.
- [ ] `GET secured/agency/info` : ajoute `legalMissing`.
- [ ] `PATCH admin/agency/status` : `isVerified` = informations complètes ; la réponse liste ce qui manque.
- **Tests** : staff refusé ; retrait de la vérification ; adresse modifiée sans retrait ; vérification refusée si incomplet ; aucune donnée légale dans les réponses publiques.

## L3 [web] Page Agence
- [ ] Types, service, mutation.
- [ ] Section « Informations légales » : formulaire (owner), lecture seule (staff) ; avertissement avant d'enregistrer un changement d'identité sur une agence vérifiée.
- [ ] Note de vérification : incomplète (liste), en attente, vérifiée.

## Checkpoint
- [ ] Tests et builds verts ; audit de sécurité ; vérification dans le navigateur (mobile compris).
- [ ] Dev : Mobelite remise vérifiée après la migration.
