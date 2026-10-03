# Tâches : clôture du backlog abonnement

Spec : [spec-backlog-cloture.md](./spec-backlog-cloture.md).

Vérifications :
- back : `npx jest`, `npm run build`, une entrée dans `CHANGES.md` ;
- web : `npx tsc --noEmit`, `npx vitest run`, `npm run build`.

Un commit local par tâche, et un audit de sécurité par module.

## O : inscription « compte d'abord » (sécurité d'abord)
- [x] **O1 [back]** (commit backend `6ee544b`)
  - `secured/agency/create` authentifié : e-mail vérifié, pas déjà owner, staff ou client ; Gratuit en une transaction avec les documents ; payant sans mot de passe en métadonnées.
  - Webhook : agence créée pour `metadata.userId`, sans création de compte.
  - `GET secured/agency/onboarding/status` réservé à l'auteur.
  - Suppression du polling public et de `encrypt` / `decryptPassword`.
  - Migration de données : `metadata.password` retiré partout.
  - Tests.
- [x] **O2 [web]**
  - Étapes : compte, puis code e-mail, puis agence, puis plan, puis fin. Suivi du paiement par la route authentifiée.
  - Reprise de l'inscription pour un utilisateur connecté sans agence.
- [x] **O3** [Audit de sécurité](./security-audit-onboarding.md) et `CHANGES.md` (section 63).

## P : codes promo
- [x] **P1 [back]** (commit backend `7e50646`)
  - Migration `promo_code` et `promo_redemption`.
  - Validation (fonction pure et tests).
  - `promoCode` dans le devis et le checkout ; utilisation comptée au paiement confirmé, de façon idempotente.
  - Reçu avec la remise.
- [x] **P2 [back]**
  - Script `promo:create`.
  - Routes admin (créer, lister, désactiver).
  - Route `promo/check` avec limitation de débit.
- [x] **P3 [web]** Champ code promo actif (récapitulatif et inscription). Code à 100 % : pas de redirection vers le paiement.
- [x] **P4** [Audit de sécurité](./security-audit-onboarding.md#audit-de-sécurité--codes-promo-p1-à-p3).

## R : relances après expiration
- [x] **R1 [back]** (commit backend `935d22f`)
  - Colonne `lastExpiryReminder`.
  - Cron J+3 et J+15, un envoi par palier, remis à zéro à la réactivation.
  - Tests.

## B : exploitation
- [x] **B1 [back]** (commit backend `fada064`) Service d'alertes internes (`KEUREZY_OPS_EMAIL`, intervalle minimal entre deux alertes) : webhook en échec, paiement inférieur au devis. Tests.
- [x] **B2 [back]** Scénarios de bout en bout des parcours d'abonnement (commit backend `3e8c8a2`).
- [x] **B3** Mise à jour du backlog (sections 3 à 6 terminées).

## Reste à faire de ton côté
- **Migrations 26 à 29 en UAT**, avec la base réactivée : `npm run migrate:deploy:uat`.
- **`KEUREZY_OPS_EMAIL`** à renseigner en dev, en UAT et en prod.
- **Navigateur** :
  - inscription Gratuit complète : compte, code reçu, agence ;
  - reprise après déconnexion ;
  - code promo dans le changement de plan et à l'inscription.
- **UAT** : paiements NabooPay réels, avec un code partiel puis un code à 100 %.
