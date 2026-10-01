# Spec : reçus de paiement d'abonnement (Keurezy → agence)

> Demande du 2026-10-02 : 2ᵉ chantier du [backlog abonnement](../subscription-ui/backlog-abonnement.md), après les [informations légales](../agency-legal-info/spec.md). Décisions validées le même jour.

## Objectif
Chaque paiement d'abonnement réglé (inscription, renouvellement, upgrade, réactivation) a un **reçu PDF standard**, émis par Keurezy avec les informations de la plateforme. L'agence le télécharge depuis l'historique de facturation et le reçoit en pièce jointe de l'e-mail « paiement confirmé ».

Le reçu a un format standard et n'est pas personnalisable. La facturation personnalisée concerne seulement les factures de l'agence à ses clients (chantier suivant).

## Décisions
| Sujet | Décision |
|---|---|
| Document | **Reçu de paiement**, sans TVA. Une facture avec TVA viendra si Keurezy y est assujettie. |
| Accès | Téléchargement dans l'historique de facturation, **et** pièce jointe de l'e-mail « paiement confirmé ». |
| Informations Keurezy | Variables d'environnement : `KEUREZY_LEGAL_NAME`, `KEUREZY_NINEA`, `KEUREZY_RCCM`, `KEUREZY_ADDRESS`, `KEUREZY_BILLING_EMAIL`. Valeur « à compléter » tant qu'elles sont absentes. |
| Génération | Backend, avec `pdfkit` (nouvelle dépendance, plus `@types/pdfkit`). Le PDF est **régénéré à la demande** à partir de données figées (montant, plan, période, numéro) : pas de stockage de fichier. |

## Règles
1. **Numérotation continue** : `KRZ-2026-000001`. Une séquence Postgres unique, sans trou ni doublon même en concurrence. L'année est celle du paiement. Le numéro est attribué une seule fois, dans la transaction qui marque le paiement payé (abonnement et inscription).
2. **Paiements déjà payés** : la migration leur attribue un numéro dans l'ordre de leur date de paiement.
3. **Contenu du reçu** :
   - émetteur (Keurezy, ses informations légales), numéro, date du paiement ;
   - client : l'agence, avec sa raison sociale si elle est renseignée (sinon son nom), son adresse de facturation, son NINEA et son RCCM s'ils sont renseignés ;
   - ligne : « Abonnement {plan} ({cycle}) », période couverte, montant réglé ;
   - total réglé, moyen de paiement (NabooPay : Wave ou Orange Money), référence de la commande ;
   - mention « Reçu de paiement, non soumis à la TVA » ;
   - les informations de l'agence sont figées **au moment du téléchargement** (pas d'historique des changements ; voir la question).
4. **Accès** : owner uniquement (comme l'historique de facturation). Paiement de l'agence, payé, avec un numéro ; sinon `404`.
5. **E-mail** : le reçu est joint à l'avis « paiement confirmé ». Si la génération échoue, l'e-mail part quand même sans pièce jointe (journalisé).

## Contrat
- **Migration 20** : `payment_transaction.receiptNumber` (texte, unique, nullable) et séquence `receipt_number_seq`.
- `GET secured/agency/subscription/payments/:paymentId/receipt?agencyId` (owner) → `application/pdf`, `Content-Disposition: attachment; filename="recu-KRZ-2026-000001.pdf"`.
- `GET …/payments` : chaque paiement a en plus `receiptNumber` (null si aucun).

## Web
Historique de facturation : bouton « Reçu » sur chaque paiement payé, qui télécharge le PDF.

## Hors périmètre
Factures de l'agence à ses clients ; TVA ; avoirs et remboursements.

## Critères de succès
- Deux paiements appliqués en même temps reçoivent deux numéros distincts et consécutifs (séquence).
- Le reçu d'une autre agence, d'un paiement non payé ou demandé par le staff est refusé (testé).
- Le PDF contient le numéro, le montant, la période et les informations des deux parties (test sur le texte extrait).
- L'e-mail « paiement confirmé » porte le reçu en pièce jointe.

## Question
Les informations de l'agence sur un reçu déjà émis doivent-elles être **figées à la date du paiement** (copie stockée avec le paiement), ou peut-on afficher ses informations **actuelles** au téléchargement ? Je propose de les figer : un reçu ne doit pas changer après coup.
