# Tâches : reçus de paiement

Vérification : back `pnpm test`, `pnpm build`, `CHANGES.md` ; web `tsc`, `pnpm test`, `pnpm build`. Commit local par tâche.

- [x] **R1 [back] Numérotation** : migration 20 (`receiptNumber`, séquence, numéros pour les paiements déjà payés) ; attribution dans la transaction qui marque le paiement payé (abonnement et inscription). Tests : format, attribution unique.
- [x] **R2 [back] PDF** : dépendance `pdfkit` ; `ReceiptPdfService` (données figées → PDF) ; route de téléchargement (owner) ; `receiptNumber` dans l'historique. Tests : contenu, accès.
- [x] **R3 [back] E-mail** : pièce jointe dans l'avis « paiement confirmé » (échec de génération : e-mail sans pièce jointe).
- [x] **R4 [web]** : bouton « Reçu » dans l'historique de facturation.
- [x] Tests et builds (back 362, web 79) ; audit ci-dessous ; reçu de dev généré et relu (mise en page vérifiée).
- [ ] Dev : téléchargement depuis l'historique dans le navigateur ; e-mail reçu avec la pièce jointe (modèle Resend requis).
- [ ] Renseigner les variables `KEUREZY_*` (informations légales de Keurezy) dans `.env` et `.env.uat`.

## Précisions d'implémentation
- La route est `GET …/subscription/payments/receipt?agencyId&paymentId` (paramètres en requête, comme les autres routes de l'abonnement).
- Le web télécharge par un lien direct sur la même origine (`/api/v1/secure/…`, réécrit vers le backend) : le cookie de session part avec, sans passer par le client API.
- Correctif découvert au passage : le webhook d'inscription ne rattachait pas le paiement à l'agence (`agencyId` vide). C'est corrigé.

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Reçu d'une autre agence (IDOR) | Requête toujours filtrée par l'`agencyId` vérifié par `assertOwner`, en plus de l'identifiant du paiement : `404` sinon (testé). Staff refusé (testé). |
| 2 | Données exposées | Le reçu ne contient que des données de facturation : jamais la `metadata` brute d'une inscription (mot de passe chiffré, documents). Seules les clés de période et de cycle sont lues. |
| 3 | Numéros de reçu | Séquence Postgres : uniques et continus même en concurrence ; attribués dans la transaction qui réclame le paiement (une seule fois). Contrainte unique en base. |
| 4 | Reçu modifié après coup | Agence figée au jour du paiement (`receiptAgency`) ; montant, plan et période figés sur le paiement. |
| 5 | Injection dans le PDF | Texte écrit par `pdfkit` (pas d'interprétation de balises). Les variables de l'e-mail restent échappées. |
| 6 | Dépendances | `pdfkit` 0.17 (et `@types/pdfkit`) : bibliothèque répandue, sans script d'installation. |
