# Spec : `subscription-checkout`

> Carte : [spec.md](./spec.md) §1. Dépend de `subscription-overview` et `subscription-cancel`. Statut : **à valider**.

## Objectif
Payer, pour une agence **existante**, un renouvellement, une réactivation ou un changement de plan, avec le montant exact calculé par le backend avant confirmation.

## Règles métier (décisions du 2026-09-30)
### Renouvellement (Q1) : manuel avec rappels
- Pas de prélèvement automatique (NabooPay = paiement ponctuel Wave / Orange Money, validé par l'owner).
- Rappels par e-mail et notification à **J-7, J-3 et J-1**, uniquement si `cancelAtPeriodEnd = false`. Le lien pointe vers la page abonnement (pas vers un checkout qui pourrait expirer).
- Le checkout est créé à la demande (« Renouveler »). Payé avant l'échéance : la nouvelle période démarre à l'**ancienne échéance** (rien de perdu). Payé après expiration : elle démarre au paiement (= réactivation, cf. `subscription-cancel` règle 3).
- Le prix du renouvellement est celui du plan prévu pour la période suivante (plan actuel, ou plan du downgrade programmé).

### Upgrade (Q4) : option B, différence au prorata
- **Upgrade** = plan dont le prix mensuel est plus élevé, même cycle ou cycle plus long.
- Même cycle : montant = `(prixNouveau − prixActuel) × joursRestants / joursPériode`, arrondi à l'unité XOF supérieure. Le plan change **au paiement**, l'échéance reste la même, le prix enregistré devient celui du nouveau plan.
- Cycle mensuel → annuel : nouvelle période qui démarre au paiement ; montant = `prixNouveau − crédit`, crédit = `prixActuel × joursRestants / joursPériode`.
- Tout est calculé par le backend (`quote`) et recalculé au paiement ; le front n'affiche que la réponse.

### Downgrade (Q5) : programmé, avec choix de ce qui reste actif
- **Downgrade** = plan moins cher, ou cycle plus court. Pas de paiement immédiat ; il s'applique à `currentPeriodEnd`.
- S'il y a du surplus sur une **fonctionnalité limitée** (collaborateurs `manage_users`, annonces `publish_properties`, biens `manage_properties`), l'owner voit la liste et **choisit ce qui reste actif**, dans la limite du plan cible. Le reste sera désactivé à la date d'effet.
  - Exemple : 8 collaborateurs → Basic (1) : l'owner en garde 1, les 7 autres passent inactifs.
- Désactivé signifie :
  - collaborateur : `Staff.isActive = false` (ne peut plus se connecter à l'agence) ;
  - annonce : `INACTIVE` ;
  - bien : nouveau champ `isActive = false` sur `Property` / `Land` / `Batiment`, invisible au public et non modifiable.
  Un élément désactivé **ne compte plus dans le quota**. Rien n'est supprimé.
- Jusqu'à la date d'effet, l'owner peut modifier son choix ou annuler le downgrade. Les éléments créés après le choix sont désactivés sauf s'il les ajoute au choix (l'écran le dit).
- Après un upgrade ultérieur, les éléments désactivés se réactivent manuellement, dans la limite du plan.
- Les fonctionnalités sans limite chiffrée ou sans compteur ne sont pas concernées.

## Contrat backend
| Méthode | Route | Rôle | Réponse / effet |
|---|---|---|---|
| `GET` | `secured/agency/subscription/quote?agencyId&planId&billingCycle` | owner | `{ kind: 'UPGRADE' \| 'DOWNGRADE' \| 'RENEWAL', amount, currency, effectiveAt, newPeriodEnd, excess: { feature, limit, items: { id, label, type }[] }[] }` |
| `POST` | `secured/agency/subscription/checkout` `{ agencyId, kind, planId?, billingCycle? }` | owner | crée la transaction NabooPay, renvoie `{ checkoutUrl, orderId }` ; réutilise un checkout `PENDING` identique au lieu d'en créer un second |
| `POST` | `secured/agency/subscription/schedule-change` `{ agencyId, planId, billingCycle, keep: { feature, ids[] }[] }` | owner | enregistre le downgrade et le choix ; `422 SELECTION_EXCEEDS_LIMIT` si le choix dépasse la limite |
| `DELETE` | `secured/agency/subscription/scheduled-change?agencyId` | owner | annule le downgrade programmé |

Migrations (validées par cette spec) :
- `PaymentTransaction` : `agencyId?` (FK), `kind` (`ONBOARDING` \| `RENEWAL` \| `UPGRADE` \| `REACTIVATION`).
- `Subscription` : `scheduledPlanId?`, `scheduledBillingCycle?`, `scheduledKeep Json?`, `lastRenewalReminder Int?` (dernier rappel envoyé : 7, 3 ou 1, pour ne pas renvoyer).
- `Property`, `Land`, `Batiment` : `isActive Boolean @default(true)`.

Webhook NabooPay : il branche sur `kind`. Il réclame la transaction de façon atomique (`updateMany where status = PENDING`, compte = 1) pour qu'un webhook et un polling simultanés ne prolongent pas deux fois. Il vérifie le montant auprès de NabooPay avant d'appliquer.

Job d'échéance (étend celui de `subscription-cancel`) : à `currentPeriodEnd`, applique d'abord le downgrade programmé (plan, choix, désactivations, en une transaction), puis l'expiration si la période n'a pas été renouvelée.

## UI (flux « Choisir → Vérifier → Confirmer »)
- Bouton principal « Changer de plan » dans l'en-tête de la page ; « Renouveler » dans le bloc Échéance à partir de J-7 et après expiration.
- **Choisir** : drawer (plein écran sur mobile), cartes légères sans ombre, plan actuel marqué, bascule mensuel / annuel (`BillingCycleToggle` existant), limites et différence avec le plan actuel (« +15 biens », « Comptabilité incluse »). Sélection : bordure et fond accent, transition 200 ms.
- **Vérifier** : récapitulatif du `quote`.
  - Upgrade : « À payer aujourd'hui : 1 667 XOF », « Prochaine échéance inchangée : 30 oct. ».
  - Downgrade : « À partir du 30 oct. », puis une liste à cocher par fonctionnalité en surplus (« Gardez 1 collaborateur sur 8 »), compteur en direct, bouton désactivé tant que le choix dépasse.
- **Confirmer** : upgrade → redirection NabooPay, retour sur la page avec suivi du paiement (polling existant) ; downgrade → bandeau « Passage au plan Basic le 30 oct. » avec « Modifier » et « Annuler ».
- Boutons désactivés pendant les mutations ; invalidation des requêtes abonnement après chaque action.

## Tests
- **Back** : prorata (même cycle, mensuel → annuel, dernier jour, arrondi) ; montant recalculé au checkout ; double webhook → un seul effet ; checkout `PENDING` réutilisé ; choix au-delà de la limite → 422 ; application du downgrade : éléments hors choix désactivés, quotas recalculés ; rappels envoyés une seule fois par palier ; staff → 403.
- **Front** : manuel sur les trois parcours, mobile compris.

## Limites
- **Toujours** : montants et dates uniquement issus du backend ; vérification du paiement auprès de NabooPay.
- **Demander d'abord** : tout autre moyen de paiement ; tout remboursement.
- **Jamais** : calcul de prix côté front ; suppression d'éléments lors d'un downgrade.

## Critères de succès
1. L'owner voit le montant exact avant de payer, et c'est celui qui est facturé.
2. Un upgrade payé débloque immédiatement les nouvelles limites, sans changer l'échéance.
3. Un downgrade s'applique à la date prévue, avec exactement le choix de l'owner.
4. Aucun rappel en double ; aucun paiement appliqué deux fois.
