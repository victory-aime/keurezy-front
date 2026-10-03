# Audit de sécurité : inscription « compte d'abord » (O1, O2)

| Menace | Avant | Après |
|---|---|---|
| Fuite de mot de passe | `GET unsecured/common/polling` public : il renvoyait le mot de passe déchiffré et toutes les données d'inscription à qui connaissait l'`orderId`. | Route supprimée. Le suivi (`GET secured/agency/onboarding/status`) est réservé à l'auteur du paiement (`userId` en base, 404 sinon) et ne renvoie que deux statuts. |
| Stockage réversible du mot de passe | Chiffré en AES dans `payment_transaction.metadata` (clé `INVITATION_ENCRYPTION_KEY`). | Aucun mot de passe stocké ni transmis : le compte est créé par Better Auth (mot de passe haché), avant tout paiement. La migration 27 purge les anciennes valeurs. Code de chiffrement supprimé. |
| Usurpation (inscrire une agence pour quelqu'un d'autre) | Route anonyme qui créait le compte. | Route authentifiée : l'identité vient de la session (`@CurrentUserId`), jamais du corps de la requête. Le DTO ne contient plus de champ de compte (liste blanche globale). |
| Inscriptions au Gratuit en masse | Aucune vérification d'e-mail. | E-mail vérifié obligatoire (`403 EMAIL_NOT_VERIFIED`), code à 6 chiffres limité à 5 essais (Better Auth) et `SIGNUP_THROTTLE` sur la création. |
| Injection de documents | `documents` acceptait des URL arbitraires dans le JSON. | Champ retiré du DTO. Seuls les fichiers reçus comptent : 5 au plus, 5 Mo chacun, PDF, PNG, JPEG ou WebP, un seul champ texte. |
| Prise de contrôle d'un compte existant | — | Refus pour un compte déjà owner ou staff (`ALREADY_ONBOARDED`) et pour un compte client mobile (`CLIENT_ACCOUNT`). Nom ou e-mail d'agence déjà pris : `AGENCY_EXISTS`. |
| Double paiement | — | Le webhook ne crée pas de seconde agence pour un utilisateur déjà owner. Le paiement est marqué payé et journalisé pour remboursement ; l'alerte e-mail à l'équipe viendra avec B1. |
| Rejeu du webhook | Idempotent (PENDING, puis PAID). | Inchangé : le statut et la création sont dans la même transaction. |

**Reste à vérifier dans le navigateur** :
- inscription Gratuit complète ;
- code faux, puis renvoi du code ;
- reprise après déconnexion (e-mail non vérifié, puis vérifié) ;
- paiement en UAT.

# Audit de sécurité : codes promo (P1 à P3)

| Menace | Mesure |
|---|---|
| Montant falsifié par le client | Le front n'envoie que le code. Le montant est recalculé par le backend (`resolvePromo` puis `evaluatePromo`) au devis **et** au paiement, puis figé dans la transaction. Le webhook compare le montant réglé au montant figé. |
| Énumération des codes | Codes inconnus et désactivés donnent la même erreur. Limitation à 15 essais par minute sur les routes qui acceptent un code. Codes de 3 à 32 caractères, normalisés. |
| Réutilisation | Une utilisation par compte (contrainte unique `promoCodeId, userId`) et une par paiement (`paymentTransactionId` unique). Le refus vient de la règle, la base garantit le reste. |
| Course entre deux paiements | L'utilisation est enregistrée au paiement confirmé, dans sa transaction et de façon idempotente. Le plafond peut être dépassé d'une unité en cas de paiements simultanés : c'est accepté, un paiement réglé n'est jamais refusé. |
| Remise de 100 % détournée | Le changement passe par le même chemin qu'un paiement (statut PENDING, puis application unique). Le reçu porte « Aucun montant à régler ». La référence `promo_…` ne peut pas être confondue avec une commande NabooPay. |
| Création de codes | Script local (accès à la base requis) ou routes `SUPER_ADMIN` (`AuthGuard`, `MiddlewareGuard`). Valeurs bornées : DTO, fonction de création et contrainte `CHECK` en base. Un code n'est jamais supprimé, seulement désactivé. |
| Fuite par le reçu | Seuls le code et la remise sont lus dans les métadonnées. |
