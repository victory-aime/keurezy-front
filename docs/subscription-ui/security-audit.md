# Audit de sécurité : `subscription-ui` — module `subscription-overview`

> Skill `security-and-hardening`. Périmètre : migration `13_subscription_billing`, `GET agency/subscription`, page `/dashboard/subscription`, lien de la sidebar, `UpgradePlanModal`.

## Modèle de menace
- **Frontière** : `GET secured/agency/subscription?agencyId` (paramètre contrôlé par le client).
- **Actifs** : montants et période de facturation de l'agence, consommation (taille de l'équipe, nombre de biens).
- **Attaquants** : membre du staff (lecture des montants), utilisateur d'une autre agence (IDOR), visiteur non connecté.

## Constats

| # | Point | Résultat |
|---|---|---|
| 1 | Authentification | Route sous le préfixe sécurisé, `AuthGuard` global. Vérifié : **401** sans session. |
| 2 | IDOR sur `agencyId` | `agencyAccessControl(agencyId, userId)` ; `userId` vient de la session (`@AgencyProfileId`), jamais du client. Un `agencyId` absent ou étranger renvoie 403 `AGENCY_ACCESS_DENIED`. |
| 3 | Élévation (staff) | Contrôle `OWNER_ONLY` côté backend, testé. Le masquage du lien et l'écran « Accès réservé » ne sont que du confort. |
| 4 | Fuite de données | Réponse construite par `select` explicite : aucun champ de `PaymentTransaction`, ni `metadata`, ni `commissionRate`. Le catalogue ne contient que des features commerciales (nom, catégorie, description). |
| 5 | Agence fermée | Refusée par `agencyAccessControl` (`AGENCY_CLOSED`). |
| 6 | XSS | Rendu React uniquement, aucun `dangerouslySetInnerHTML` ; libellés et dates formatés côté client. |
| 7 | Déni de service | Lecture seule, 5 requêtes `count`/`findUnique` indexées par `agencyId`. Limiteur global `SessionThrottlerGuard` appliqué. |
| 8 | Dépendances | Aucune ajoutée (Chakra `Progress` et `framer-motion` déjà présents). |
| 9 | Secrets | Aucun dans le diff. La migration ne contient pas de données. |

## À traiter dans un module suivant
- **Rattachement des anciennes transactions (`billing-history`)** : la migration relie une transaction à une agence via `metadata.agencyEmail`. `initiateAgencyPayment` ne vérifie pas que l'e-mail d'agence est libre. Quelqu'un pourrait donc lancer un onboarding avec l'e-mail d'une agence existante, et sa transaction `PENDING` ou `FAILED` apparaîtrait dans l'historique de cette agence. Seuls le plan, le montant et le statut seraient visibles (jamais le `metadata`). **Parade prévue** : l'historique n'affiche que les transactions `ONBOARDING` au statut `PAID`, et `initiateAgencyPayment` refuse un e-mail d'agence déjà utilisé. Ajouté à la spec `billing-history`.
- **Hors périmètre, signalé à part** : `GET unsecured/common/polling` renvoie le mot de passe déchiffré de l'owner à quiconque connaît l'`orderId` (tâche dédiée proposée).

## Conclusion
Aucune faille bloquante dans le module. Deux points sont reportés aux modules concernés.

---

# Audit de sécurité : module `subscription-cancel`

| # | Point | Résultat |
|---|---|---|
| 1 | Contournement de la lecture seule | `ActiveSubscriptionGuard` est global et **refuse par défaut** : une route d'écriture oubliée est bloquée, pas ouverte. L'état vient de la base (agence de la session), jamais du client. |
| 2 | Allowlist | 18 routes `@AllowWhenInactive()`, validées le 2026-10-01. Aucune ne crée de contenu public ni n'élargit un accès : elles communiquent (discussions), clôturent (refus, annulations) ou retirent des accès (membres, invitations, intégrations). |
| 3 | Fuite d'annonces d'une agence expirée | Un seul filtre `publicAnnonceWhere` pour les 5 lectures publiques ; exécuté sur la base de dev sans erreur. Revue des `AnnonceStatus.ACTIVE` restants : écritures (fermeture de bien, publication), compteurs côté agence, et vignette de l'annonce dans une réservation ou une discussion **déjà existante**. Aucun ne permet de découvrir une annonce. |
| 4 | Résilier ou réactiver l'agence d'un autre | `cancel`, `resume` et `cancel-impact` : `agencyAccessControl` (identité de session) puis `OWNER_ONLY`. Staff refusé, testé. |
| 5 | Réactivation gratuite après expiration | `resume` refuse un abonnement `INACTIVE` (`409 SUBSCRIPTION_EXPIRED`) : la réactivation passe par un paiement. |
| 6 | Blocage massif accidentel | Le job n'expire les périodes non renouvelées qu'avec `SUBSCRIPTION_EXPIRY_ENABLED=true` (8 abonnements sur 14 en dev ont déjà une période échue). Les résiliations sont toujours appliquées. |
| 7 | Divulgation au staff | `subscription-info` n'expose que `status` en plus (ni prix, ni dates). |
| 8 | Dépendances | Aucune ajoutée. |

**À surveiller** : une nouvelle route d'écriture destinée à rester utilisable pendant l'expiration doit recevoir `@AllowWhenInactive()` explicitement (rappel dans `CHANGES.md`).

---

# Audit de sécurité : module `subscription-checkout`

> Skill `security-and-hardening`. Périmètre : quotas actifs, biens désactivés, `quote`, `checkout`, `payment`, `schedule-change`, `scheduled-change`, `assets/activate`, confirmation des paiements (webhook, polling), job d'échéance, rappels, UI de la page abonnement.

## Modèle de menace
- **Frontières** :
  - les routes owner (paramètres `agencyId`, `planId`, `keep`, `orderId`, en-tête `Idempotency-Key`) ;
  - le webhook NabooPay (anonyme, signé) ;
  - le retour du navigateur depuis NabooPay (`?payment=`).
- **Actifs** : argent encaissé, période et plan de l'agence, éléments actifs (membres, annonces, biens).
- **Attaquants** : membre du staff, owner d'une autre agence, client qui rejoue ou falsifie une requête, faux webhook.

## Constats
| # | Point | Résultat |
|---|---|---|
| 1 | Montant falsifié | Le client n'envoie jamais de montant. Le devis est recalculé au checkout et figé dans `amount_to_pay`. Le paiement n'est appliqué que si le montant **relu chez NabooPay** (pas celui du webhook) est au moins égal ; sinon `FAILED` et erreur journalisée. |
| 2 | Paiement appliqué deux fois | Clé `naboo_order_id` (unique), réclamation atomique `PENDING → PAID` dans la transaction qui applique : webhook et polling simultanés n'appliquent qu'une fois, testé. |
| 3 | Deux checkouts pour une même intention | `Idempotency-Key` obligatoire et unique en base. Même clé : même checkout, sans nouvel appel NabooPay. Course entre deux requêtes : départagée par la contrainte unique. |
| 4 | Clé d'une autre agence | Une clé déjà utilisée par une autre agence ou pour une autre demande renvoie `422 IDEMPOTENCY_KEY_REUSED`, **sans** renvoyer l'URL de paiement de l'autre agence. |
| 5 | Faux webhook | `NabooSignatureGuard`, puis statut relu chez NabooPay avant toute application. Le webhook n'apporte que l'`order_id`. |
| 6 | IDOR et élévation | Toutes les routes passent par `assertOwner` (identité de session). `payment` cherche la commande dans l'agence de l'appelant, hors onboarding. `assets/activate` cherche le bien avec l'`agencyId`. Staff refusé, testé. |
| 7 | Choix des éléments gardés | `validateKeep` n'accepte que des éléments actifs de l'agence (`SELECTION_INVALID`), dans la limite (`SELECTION_EXCEEDS_LIMIT`). Les désactivations filtrent toutes par `agencyId` : un identifiant étranger ne touche rien. |
| 8 | Contournement des quotas | Quota contrôlé au passage à l'état actif (annonce mise en ligne, membre réactivé, bien réactivé). Un bien désactivé est en lecture seule (`ASSET_INACTIVE`) et ses annonces sont retirées. |
| 9 | Contournement de la lecture seule | Seul `checkout` porte `@AllowWhenInactive()` (la réactivation est un paiement). `schedule-change`, l'annulation du downgrade et `assets/activate` restent bloqués pendant l'expiration. |
| 10 | Fuite de données | `payment` ne renvoie que `{ status }`. `quote` ne liste les éléments (libellés) qu'à l'owner. Aucun `metadata` exposé. |
| 11 | Redirection ouverte | L'URL de paiement vient de NabooPay via le backend, et les URL de retour sont construites depuis l'environnement. Le front ne lit de l'URL que la présence de `?payment` ; le statut vient toujours du backend. |
| 12 | Rappels en double | Palier réclamé (`updateMany` conditionnel) avant l'émission : pas de doublon si le job est relancé ou tourne sur deux instances. |
| 13 | Déni de service | Le suivi interroge toutes les 3 s pendant 2 min au plus, par onglet ouvert, et chaque appel relit NabooPay (limite de 100 req/min). `SessionThrottlerGuard` s'applique. *ponytail : sans cache du statut NabooPay ; en ajouter un si plusieurs onglets posent problème.* |
| 14 | Dépendances, secrets | Aucune dépendance ajoutée. Aucun secret dans le diff. Nouvelle variable : `RESEND_TEMPLATE_SUBSCRIPTION_RENEWAL_REMINDER_ID`. |

## À surveiller
- **Paiement inférieur au devis** : il passe `FAILED` et doit être vérifié à la main (remboursement ou application manuelle). Il n'y a pas encore d'écran admin pour ça.
- **`common/polling` (onboarding)** :
  - Appelée avec l'`orderId` d'un abonnement, elle échoue en 500 (pas de mot de passe à déchiffrer), sans rien divulguer.
  - Son rattrapage passe désormais par l'événement, donc il est sans effet sur l'onboarding.
  - Le défaut connu (mot de passe renvoyé) reste traité par la tâche séparée.
- **Surplus apparu après le choix d'un downgrade** : il n'est pas réduit. L'agence est simplement bloquée à la création jusqu'à revenir sous la limite (`ponytail` dans `applyScheduledChanges`).

## Conclusion
Aucune faille bloquante. Les vérifications manuelles du checkpoint B restent à faire (sandbox NabooPay, navigateur).
