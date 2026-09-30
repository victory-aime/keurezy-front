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
