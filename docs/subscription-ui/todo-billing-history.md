# Tâches : `billing-history`

> Spec : [spec-billing-history.md](./spec-billing-history.md). Petit module, plan intégré ici.

## T1 [back] : historique
- [x] `GET agency/subscription/payments` (owner, pagination du projet `initialPage` / `limitPerPage`, 50 au plus).
- [x] Onboarding visible seulement payé ; aucun champ de `metadata` brut.
- [x] Période couverte enregistrée à l'application du paiement ; déduite pour les anciens onboardings.
- [x] `initiateAgencyPayment` refuse l'e-mail d'une agence existante.
- **Tests** : filtre agence et onboarding payé, pagination bornée, pas de fuite de `metadata`, staff 403, refus de l'e-mail d'agence.

## T2 : section « Historique de facturation »
- [x] Tableau sur desktop, liste compacte sur mobile, état vide, pagination.

## Checkpoint
- [x] Tests back (313) et front (68) verts, builds OK.
- [ ] Navigateur à 320 et 1440 px (Mobelite a une transaction simulée payée).
- [x] `security-audit.md` complété.
