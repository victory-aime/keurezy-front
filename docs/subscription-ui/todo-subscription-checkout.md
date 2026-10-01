# Tâches : `subscription-checkout`

Vérification commune :
- **web** : `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build` ;
- **[back]** : `pnpm test`, `pnpm build`, entrée dans `CHANGES.md` ;
- commit local après chaque tâche.

## T1 [back] : les quotas comptent les éléments actifs
- [ ] `countPropertyAssets` ignore `isActive = false` ; `countUserSeats` ne compte que les membres actifs (+ invitations en attente) ; `countAnnonces` ne compte que les annonces `ACTIVE` (décision 1).
- [ ] Contrôle de quota au passage en actif : annonce (`updateAnnonce` vers `ACTIVE`), membre (`team/change-status`).
- **Tests** : un élément désactivé libère sa place ; réactiver au-delà de la limite renvoie le code de capacité existant.
- **Fichiers** : `packs/plan-feature-policy.service.ts` (+ spec), `annonce/annonce.service.ts`, `team/team.service.ts`.
- **Taille** : M.

## T2 [back] : biens désactivés
- [ ] `publicAnnonceWhere` exige `property.isActive`.
- [ ] Mise à jour refusée sur un bien, terrain ou bâtiment inactif (`409 ASSET_INACTIVE`).
- [ ] Route d'activation (owner) avec contrôle de quota.
- **Tests** : annonce d'un bien inactif absente du public ; modification refusée ; réactivation dans la limite, refusée au-delà.
- **Fichiers** : `annonce/public-annonce.ts`, services `property`, `land`, `building`, `config/api.ts`.
- **Dépend de** : T1. **Taille** : M.

## T3 [back] : devis
- [ ] Fonction pure `quoteChange(current, target, now)` : classe le changement (`RENEWAL`, `UPGRADE`, `DOWNGRADE`, `REACTIVATION`), puis calcule le montant (arrondi à l'unité XOF supérieure), `effectiveAt` et `newPeriodEnd`.
- [ ] `GET agency/subscription/quote` (owner) : devis, plus `excess` (éléments en surplus par fonctionnalité limitée, avec id, libellé et type).
- **Tests** : prorata sur le même cycle ; mensuel vers annuel avec crédit ; dernier jour ; arrondi ; renouvellement au prix du plan programmé ; plan inactif ou `COMMISSION_BASED` refusé ; staff 403.
- **Fichiers** : `packs/subscription-quote.ts` (+ spec), `packs/subscription.service.ts`, `packs/subscription.controller.ts`, `config/api.ts`.
- **Taille** : M.

## T4 [back] : création du checkout et suivi
- [ ] `PaymentsModule` exporte `NabooService`.
- [ ] `POST agency/subscription/checkout` (owner, `@AllowWhenInactive()`) : recalcule le devis, refuse un downgrade, crée la transaction (`agencyId`, `kind`, `metadata` = plan, cycle et choix éventuel), puis renvoie `{ checkoutUrl, orderId }`. Un checkout `PENDING` identique de moins d'une heure est réutilisé.
- [ ] `GET agency/subscription/payment?orderId` (owner) : renvoie `{ status }` ; si NabooPay dit `paid` alors qu'on est encore `PENDING`, émet l'événement de confirmation.
- **Tests** : montant figé = devis ; réutilisation ; downgrade → 400 ; `orderId` d'une autre agence → 404.
- **Fichiers** : `payments/payments.module.ts`, `packs/subscription.service.ts`, `packs/subscription.controller.ts`, `packs/pack.module.ts`.
- **Dépend de** : T3. **Taille** : M.

## T5 [back] : confirmation du paiement
- [ ] Le webhook émet `subscription.payment.confirmed` pour toute transaction autre que `ONBOARDING` (après vérification auprès de NabooPay) ; l'onboarding est inchangé.
- [ ] `SubscriptionBillingService`, dans une seule transaction :
  - réclamation atomique (`updateMany where PENDING`, compte = 1) ;
  - vérification du montant ;
  - puis application selon le type :
    - renouvellement : période depuis l'ancienne échéance ;
    - réactivation : période depuis le paiement, plus le choix éventuel ;
    - upgrade : changement de plan immédiat, et annulation du downgrade programmé.
- [ ] Remise à zéro de `cancelAtPeriodEnd` et de `lastRenewalReminder`.
- **Tests** : double confirmation → un seul effet ; montant insuffisant → non appliqué et journalisé ; chaque type de paiement ; renouvellement anticipé avec downgrade programmé.
- **Fichiers** : `payments/services/payment.service.ts`, `events/domain-events.ts`, nouveau `packs/subscription-billing.service.ts` (+ spec).
- **Dépend de** : T4. **Taille** : M.

## T6 [back] : downgrade programmé
- [ ] Migration `14_subscription_schedule_at` : `scheduledAt`.
- [ ] `POST agency/subscription/schedule-change` : choix limité aux éléments de l'agence ; `422 SELECTION_EXCEEDS_LIMIT` au-delà de la limite.
- [ ] `DELETE agency/subscription/scheduled-change`.
- [ ] Le job applique le downgrade quand `scheduledAt < now`, avant l'expiration : plan, prix et désactivation des éléments hors choix, en une transaction.
- **Tests** : choix au-delà de la limite → 422 ; élément d'une autre agence → 422 ; application exacte du choix ; quotas recalculés ; annulation.
- **Fichiers** : `prisma/schema.prisma`, migration, `packs/subscription.service.ts` (+ spec), contrôleur, `config/api.ts`.
- **Dépend de** : T1, T3. **Taille** : M.

## T7 [back] : rappels de renouvellement
- [ ] Job quotidien : abonnement `ACTIVE`, sans résiliation, échéance à J-7, J-3 ou J-1, palier pas encore envoyé ; émet `subscription.renewal.due`, puis met à jour `lastRenewalReminder`.
- [ ] Écouteur dans `notifications/` : e-mail Resend (nouveau modèle, `.html` et `.md`, ligne ajoutée au README) et notification in-app, avec un lien vers `/dashboard/subscription`.
- **Tests** : un seul envoi par palier ; rien si une résiliation est programmée ; relancer le job ne renvoie rien.
- **Fichiers** : `packs/subscription.service.ts`, `events/domain-events.ts`, `notifications/subscription-reminder.listener.ts`, `mail/` (resend, types, templates).
- **Dépend de** : T5. **Taille** : M.

## Checkpoint A
- [ ] Tests back verts, build OK.
- [ ] Dev : upgrade payé en sandbox NabooPay, limites débloquées, échéance inchangée.
- [ ] Dev : downgrade programmé puis appliqué (`scheduledAt` avancé à la main).

## T8 : UI changement de plan, renouvellement et réactivation
- [ ] Données : routes, services, requêtes (`quote`, `payment`), mutation `checkout`.
- [ ] Drawer « Changer de plan » (plein écran sur mobile) :
  - **Choisir** : cartes légères, plan actuel marqué, `BillingCycleToggle`, différence avec le plan actuel ;
  - **Vérifier** : « À payer aujourd'hui », échéance ;
  - **Confirmer** : redirection NabooPay.
- [ ] Retour depuis NabooPay : suivi par `payment?orderId` jusqu'au statut final, puis invalidation des requêtes abonnement.
- [ ] Bouton « Renouveler » à partir de J-7 et après expiration ; le bandeau d'expiration de l'owner mène au checkout de réactivation.
- **Fichiers** : `store/…`, `subscription/components/ChangePlanDrawer.tsx`, `PaymentReturn.tsx`, `CurrentPlan.tsx`, `SubscriptionInactiveBanner.tsx`.
- **Dépend de** : T5. **Taille** : M.

## T9 : UI downgrade
- [ ] Étape « Vérifier » d'un downgrade : liste à cocher par fonctionnalité en surplus (« Gardez 1 collaborateur sur 8 »), compteur en direct, bouton désactivé tant que le choix dépasse.
- [ ] Bandeau « Passage au plan Basic le 30 oct. », avec « Modifier » et « Annuler ».
- [ ] Biens désactivés : badge « Désactivé » et action « Réactiver » dans les listes.
- **Fichiers** : `subscription/components/KeepSelection.tsx`, `ScheduledChangeBanner.tsx`, listes de biens.
- **Dépend de** : T6, T8. **Taille** : M.

## Checkpoint B
- [ ] Navigateur, mobile compris : upgrade, renouvellement, réactivation, downgrade (choix, modification, annulation).
- [ ] `security-audit.md` complété.
- [ ] Décision sur l'activation de `SUBSCRIPTION_EXPIRY_ENABLED` (délai de grâce, plan, décision 5).
