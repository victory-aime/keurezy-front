# Plan : `subscription-checkout`

> Spec : [spec-subscription-checkout.md](./spec-subscription-checkout.md). Tâches : [todo-subscription-checkout.md](./todo-subscription-checkout.md).

## Vue d'ensemble
Le module couvre le renouvellement, la réactivation, l'upgrade et le downgrade, tous calculés par le backend.

Ordre de construction :
1. **Les quotas comptent les éléments actifs.** C'est un prérequis du downgrade : désactiver un élément doit libérer sa place.
2. **Le devis (`quote`).** C'est une fonction pure, testée seule.
3. **Le paiement**, en deux temps : la création du checkout, puis la confirmation.
4. **Le downgrade programmé et les rappels.**
5. **L'UI.**

Le plus risqué passe en premier : la confirmation de paiement, c'est-à-dire l'argent et la double application.

## Existant réutilisé
| Besoin | Existant |
|---|---|
| Fournisseur de paiement | `NabooService.createTransaction` / `getTransactionById` (module `payments`) |
| Réception du paiement | `PaymentsController.handleWebhook` (signature vérifiée par `NabooSignatureGuard`), rattrapage par polling dans `getPaymentStatus` |
| Quotas | `PlanFeaturePolicyService.checkCapacity` et les compteurs `countPropertyAssets`, `countAnnonces`, `countUserSeats` |
| Échéance | `SubscriptionService.expireEndedPeriods` (job horaire) |
| Communication entre modules | `DomainEventBus` (global) ; les écouteurs vivent dans `notifications/` (modèle `booking-email.listener`) |
| E-mail | `ResendService.sendTemplateEmail` ; modèle hébergé chez Resend et documenté dans `mail/templates/` |
| UI | `BillingCycleToggle`, `PlanCard`, `getAllPacksQueries`, `ActionImpactDialog`, la page `/dashboard/subscription` |

## Décisions d'architecture
- **Pas de dépendance circulaire.** Le graphe actuel est `PackModule → AgencyModule → PaymentsModule`, donc `payments` ne peut pas appeler `packs`.
  - Le webhook garde la vérification auprès de NabooPay.
  - Pour une transaction autre que `ONBOARDING`, il émet `subscription.payment.confirmed { orderId, paidAt }`.
  - `SubscriptionBillingService` (dans `packs`) écoute cet événement. En une seule transaction Prisma, il réclame la transaction (`updateMany where status = PENDING`, compte = 1), vérifie le montant, puis applique le paiement.
  - Si l'application échoue, la transaction reste `PENDING`, et le prochain webhook ou polling réessaie.
  - `PaymentsModule` exporte `NabooService` pour la création du checkout.
- **Devis en fonction pure** `quoteChange(current, target, now)`. Elle classe le changement (renouvellement, upgrade, downgrade, réactivation), calcule le montant et les dates, et sert au `GET quote` comme au `POST checkout`. Le montant est recalculé au checkout et figé dans `amount_to_pay`.
- **Réutilisation d'un checkout en attente.** Un checkout `PENDING` de la même agence est réutilisé s'il a le même type, le même plan, le même cycle et le même montant, et qu'il a moins d'une heure. Sinon, un nouveau est créé.
  - *ponytail : fenêtre fixe d'une heure, faute de connaître l'expiration côté NabooPay ; la caler sur la leur si elle est documentée.*
- **Suivi du paiement sur une route sécurisée.** Nouvelle route `GET agency/subscription/payment?agencyId&orderId`, réservée à l'owner, qui renvoie seulement `{ status }`. Elle reprend le rattrapage (si NabooPay dit `paid`, on émet l'événement).
  - La route publique `common/polling` n'est **pas** réutilisée : elle expose le mot de passe d'onboarding (tâche séparée déjà ouverte).
- **Date d'effet du downgrade.** Nouvelle colonne `scheduledAt` (migration 14 ; la future contraction des invitations passe en 15).
  - Raison : un renouvellement payé en avance repousse `currentPeriodEnd`, alors que le downgrade doit s'appliquer à l'ancienne échéance.
  - Le job applique le downgrade quand `scheduledAt < now`, avant l'expiration, dans une seule transaction : plan, prix, puis désactivation des éléments hors choix.
- **Lecture seule.** `checkout` porte `@AllowWhenInactive()`, puisque la réactivation est un paiement. `schedule-change` et l'annulation du downgrade restent bloqués pendant l'expiration.
- **Renouvellement.** Il est facturé au prix du plan prévu pour la période suivante, donc au prix du plan cible si un downgrade est programmé. Payer annule une résiliation programmée (`cancelAtPeriodEnd = false`) et remet `lastRenewalReminder` à null.
- **Un upgrade annule le downgrade programmé.**
- **Rappels.** Un job quotidien émet `subscription.renewal.due` aux paliers J-7, J-3 et J-1. Un écouteur dans `notifications/` envoie l'e-mail et la notification in-app. `lastRenewalReminder` empêche les doublons.

## À valider avant l'implémentation
1. **Quota d'annonces = annonces en ligne.** Aujourd'hui, `publish_properties` compte toutes les annonces, y compris `INACTIVE`. Désactiver une annonce ne libère donc rien, ce qui contredit la règle « désactivé = hors quota ».
   - Proposition : compter seulement les annonces `ACTIVE`, et contrôler le quota au passage en `ACTIVE` (création et `updateAnnonce`).
2. **Quota de collaborateurs = membres actifs + invitations en attente.** Réactiver un membre (`team/change-status`) contrôle alors le quota.
3. **Biens désactivés :**
   - comptés hors quota ;
   - masqués au public (`publicAnnonceWhere` exige `property.isActive`) ;
   - non modifiables ;
   - réactivables par l'owner avec un contrôle de quota (nouvelle route d'activation).
4. **Réactivation après expiration :**
   - tout plan est possible, payé plein tarif, avec une nouvelle période à partir du paiement ;
   - vers un plan plus petit avec du surplus, le choix des éléments gardés se fait **au checkout** et s'applique au paiement.
5. **Activation de `SUBSCRIPTION_EXPIRY_ENABLED`** après le checkpoint B. Les agences dont la période est déjà échue expireraient dans l'heure (8 sur 14 en dev).
   - Proposition : au moment d'activer, repousser leur échéance de 7 jours (script ponctuel), pour qu'elles reçoivent les rappels et puissent payer.
6. **Modèle Resend « rappel de renouvellement »** à créer dans Resend. En attendant, l'e-mail est ignoré, comme les autres modèles non configurés.

## Graphe
```
T1 quotas actifs ─┬─ T2 biens désactivés ─────────────────────────┐
                  └─ T3 devis ── T4 checkout ── T5 confirmation ─┼─ T8 UI upgrade / renouvellement / réactivation
                                └─ T6 downgrade programmé ────────┴─ T9 UI downgrade
                   T7 rappels (après T5)
```

## Risques
| Risque | Impact | Parade |
|---|---|---|
| Paiement appliqué deux fois (webhook et polling simultanés) | Élevé | Réclamation atomique `updateMany where PENDING` dans la transaction qui applique ; test de concurrence |
| Montant payé inférieur au devis | Élevé | Montant figé au checkout, vérifié auprès de NabooPay avant application |
| Downgrade appliqué à la mauvaise date après un renouvellement anticipé | Moyen | `scheduledAt` distinct de `currentPeriodEnd` ; test dédié |
| Changement de sémantique des quotas | Moyen | Validation ci-dessus ; tests des trois compteurs ; contrôle au passage en actif |
| Expiration massive à l'activation du flag | Moyen | Délai de grâce ponctuel (décision 5) |
| L'écouteur échoue sans bruit (bus en mémoire) | Moyen | La transaction reste `PENDING`, rejouée par le webhook ou le polling ; erreur journalisée |

## Checkpoints
- **A**, après T1 à T7 : tests back verts ; en dev, un upgrade payé en sandbox NabooPay ; un downgrade programmé puis appliqué en avançant `scheduledAt` à la main.
- **B**, après T9 : les trois parcours dans le navigateur (mobile compris), audit de sécurité, puis décision sur l'activation du flag d'expiration.
