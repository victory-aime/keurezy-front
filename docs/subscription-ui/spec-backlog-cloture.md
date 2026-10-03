# Spec : clôture du backlog abonnement (sections 3 à 6)

> Demande du 2026-10-03 : terminer tout le [backlog abonnement](./backlog-abonnement.md) avant la mise en production.
>
> Décisions prises le même jour :
> - inscription : **le compte d'abord** ;
> - codes promo : **table et script**, plus des routes admin prêtes pour le back-office, qui gérera les codes plus tard ;
> - tests : **scénarios backend** ;
> - alertes internes : **e-mail à l'équipe** ;
> - `SUBSCRIPTION_EXPIRY_ENABLED=true` en dev et en UAT.

## Capability map
| Module | Responsabilité | Dépend de |
|---|---|---|
| `onboarding` | Parcours d'inscription d'agence : compte, e-mail vérifié, puis agence et plan | auth, abonnement, paiements |
| `promo-codes` | Codes de remise : création (script, admin), validation, application au devis, utilisations | abonnement (devis) |
| `expiry-reminders` | Relances J+3 et J+15 après expiration | abonnement, e-mail |
| `billing-ops` | Alertes internes (webhook en échec, paiement inférieur au devis) et scénarios de tests | paiements, e-mail |

Ordre de réalisation : `onboarding` d'abord (faille de sécurité), puis `promo-codes`, `expiry-reminders`, `billing-ops`.

---

## 1. `onboarding` : le compte d'abord

### Problèmes actuels (constatés dans le code)
1. **Faille.** `GET unsecured/common/polling?orderId` est public et renvoie toutes les données d'inscription, avec le **mot de passe déchiffré**. Le mot de passe est stocké chiffré, mais de façon réversible, dans `payment_transaction.metadata`. La faille est aussi présente sur `develop`.
2. **Bug.** Le webhook crée le compte avec `meta.password`, c'est-à-dire la valeur **chiffrée**. Le mot de passe choisi par l'utilisateur ne fonctionne donc pas après une inscription payante.
3. **Inscriptions au Gratuit en masse possibles** : agence créée sans e-mail vérifié.
4. **Gratuit** : les documents envoyés à l'inscription sont ignorés (`documents: []`).

### Nouveau parcours (web)
| Étape | Écran | Appel |
|---|---|---|
| 1 | Compte : nom, e-mail, mot de passe | Inscription Better Auth (`sign-up/email`), puis envoi d'un code à 6 chiffres (`email-otp`, type `email-verification`) |
| 2 | **Vérification de l'e-mail** : code à 6 chiffres, renvoi possible | `email-otp/verify-email` : e-mail vérifié, session ouverte |
| 3 | Agence : nom, e-mail, adresse, téléphone, description, documents, conditions | (local) |
| 4 | Plan et cycle | `POST secured/agency/create` (multipart, désormais authentifié) |
| 5a | Gratuit : l'agence est créée tout de suite | réponse `{ agencyId }` |
| 5b | Payant : redirection vers NabooPay, puis retour sur la page | réponse `{ checkout_url, order_id }` ; suivi par `GET secured/agency/onboarding/status?orderId` |
| 6 | Fin : tableau de bord | session rafraîchie (rôle OWNER) |

**Reprise.** Un utilisateur web connecté qui n'a pas encore d'agence (rôle `USER`, sans profil client mobile) est renvoyé vers l'inscription, à l'étape qui manque :
- e-mail non vérifié : étape 2 ;
- e-mail vérifié : étape 3 ;
- paiement en attente : écran de suivi du paiement.

### Règles backend
- `POST secured/agency/create` (session obligatoire ; la route n'est plus anonyme) :
  - **E-mail vérifié** obligatoire : sinon `403 EMAIL_NOT_VERIFIED`.
  - L'utilisateur ne doit être ni owner, ni staff, ni client de l'application mobile (profil `Client`) : sinon `409 ALREADY_ONBOARDED` ou `409 CLIENT_ACCOUNT`.
  - Plusieurs paiements d'inscription peuvent être ouverts. Le premier payé crée l'agence ; un second payé ne crée rien, il est journalisé et une alerte part à l'équipe pour remboursement.
  - Limitation de débit : celle de l'inscription (`SIGNUP_THROTTLE`).
  - **Gratuit** : owner, rôle OWNER, agence (avec ses documents) et abonnement, dans une seule transaction.
  - **Payant** : transaction NabooPay de type `ONBOARDING`. Les métadonnées gardent `userId` et les informations de l'agence, **jamais de mot de passe**.
- **Webhook ONBOARDING** : crée owner, agence et abonnement pour `metadata.userId`. Il ne crée plus aucun compte. L'opération est idempotente (statut PENDING puis PAID dans la même transaction, comme aujourd'hui).
- `GET secured/agency/onboarding/status?orderId` : seulement pour l'auteur de la transaction (sinon 404). Réponse : `{ local_status, naboo_status }`, sans aucune donnée personnelle.
- **Suppressions** :
  - `GET unsecured/common/polling` ;
  - la création anonyme du compte et de l'agence en un bloc (`@AllowAnonymous` retiré de `secured/agency/create`) ;
  - `encryptPassword` et `decryptPassword` ;
  - le champ `password` des métadonnées.
- **Transactions d'inscription en attente au déploiement** : elles contiennent un mot de passe chiffré. Une migration de données retire `metadata.password` de toutes les transactions.

### Hors périmètre
- L'application mobile : elle est réservée aux clients et n'a pas d'inscription d'agence.
- La suppression automatique des comptes jamais finalisés : elle pourra être faite par un cron plus tard.

---

## 2. `promo-codes`

### Modèle
| Table `promo_code` | Règle |
|---|---|
| `code` | Unique, 3 à 32 caractères (majuscules, chiffres, tirets), insensible à la casse à la saisie |
| `kind` | `PERCENT` (1 à 100) ou `AMOUNT` (XOF > 0) |
| `value` | Pourcentage ou montant |
| `planIds` | Plans concernés (vide = tous les plans payants) |
| `billingCycles` | Cycles concernés (vide = tous) |
| `kinds` | Types de paiement concernés : `ONBOARDING`, `UPGRADE`, `RENEWAL`, `REACTIVATION` (vide = tous) |
| `startsAt`, `endsAt` | Fenêtre de validité (`endsAt` facultatif) |
| `maxRedemptions` | Nombre total d'utilisations (facultatif) |
| `isActive` | Désactivation sans suppression |

Table `promo_redemption` : `promoCodeId`, `userId` (le compte qui paie), `agencyId`, `paymentTransactionId` (unique), `discountXOF`, `createdAt`.

**Simplifications retenues à l'implémentation** :
- une seule utilisation par compte (contrainte unique), au lieu d'un `maxPerAgency` réglable ;
- la remise ne porte que sur le paiement en cours : pas de `durationCycles` ;
- la vérification passe par le devis (`GET subscription/quote?promoCode=`) et, à l'inscription, par `GET secured/agency/onboarding/promo`, au lieu d'une route `promo/check` séparée.

### Règles
- **Validation** côté backend uniquement : le devis renvoie le montant remisé ou une erreur précise :
  - `PROMO_NOT_FOUND`, `PROMO_EXPIRED`, `PROMO_NOT_APPLICABLE` (plan, cycle ou type de paiement), `PROMO_EXHAUSTED`, `PROMO_ALREADY_USED`.
  - Limitation de débit stricte, pour empêcher l'énumération des codes.
- **Devis** (`quoteChange`) et **checkout** acceptent `promoCode`. Le montant est recalculé côté serveur et vaut au moins 0 XOF.
  - Une remise de 100 % règle le paiement sans passer par NabooPay, par le même chemin qu'un devis à 0.
- **Utilisation comptée au paiement confirmé**, pas à la saisie. L'opération est idempotente : un `paymentTransactionId` unique ne peut pas compter deux fois. Le plafond `maxRedemptions` est revérifié dans la transaction.
- Le code et la remise sont imprimés sur le **reçu**.
- **Création** :
  - script `npm run promo:create -- --code ETE25 --percent 25 [--plans STANDARD_SUB,PREMIUM_SUB] [--ends 2026-12-31] [--max 100]` ;
  - routes admin `SUPER_ADMIN` pour le back-office : créer, lister avec le nombre d'utilisations, désactiver.
- **Front** :
  - le champ code promo du récapitulatif devient actif : saisie, « Appliquer », montant barré puis remisé, message d'erreur clair ;
  - le même champ apparaît à l'étape « Plan » de l'inscription.

---

## 3. `expiry-reminders`
- Cron quotidien. Il cible les agences dont l'abonnement payant est **expiré** depuis 3 jours, puis depuis 15 jours, et qui ne sont ni réactivées ni passées au Gratuit.
- E-mail via le modèle Resend `SUBSCRIPTION_NOTICE`, existant : sujet et texte selon J+3 ou J+15, avec un lien vers la page abonnement (réactivation).
- **Un seul envoi par palier** : colonne `subscription.lastExpiryReminder` (`J3` ou `J15`), remise à zéro à la réactivation.
- Rien n'est envoyé si `SUBSCRIPTION_EXPIRY_ENABLED` est faux, ni pour une agence fermée ou en cours de fermeture.

---

## 4. `billing-ops`
- **Alerte sur un webhook en échec** : chaque échec de traitement est compté. À partir de 3 échecs sur 1 heure, un e-mail part vers `KEUREZY_OPS_EMAIL`, avec au plus une alerte par heure.
  - Ce compteur et cet intervalle sont gardés en mémoire du processus. Limite : une seule instance sur Render.
- **Paiement inférieur au devis** : le montant payé est comparé au montant attendu. Aujourd'hui, l'écart est seulement journalisé ; il donnera désormais un e-mail à `KEUREZY_OPS_EMAIL` (référence de commande, agence, attendu, payé).
- Les e-mails internes sont envoyés en **HTML simple, sans modèle Resend**. Ils sont internes et ne contiennent aucune donnée sensible au-delà de la référence, de l'agence et des montants.
- **Scénarios de tests backend**, enchaînés sur les vrais services avec Prisma et NabooPay simulés :
  - montée de plan payée ;
  - descente programmée puis appliquée à l'échéance ;
  - renouvellement ;
  - expiration puis réactivation ;
  - blocage à la limite et alerte à 80 % ;
  - code promo appliqué de bout en bout ;
  - inscription Gratuit et payante.

## Variables d'environnement
- `KEUREZY_OPS_EMAIL` : nouvelle variable, adresse de l'équipe pour les alertes internes.
- `SUBSCRIPTION_EXPIRY_ENABLED=true` : déjà fait en UAT.

## Tâches
Voir [todo-backlog-cloture.md](./todo-backlog-cloture.md).
