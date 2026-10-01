# Plan : clôture du module abonnement (à faire maintenant)

> Décisions du 2026-10-01. Les chantiers reportés sont dans [backlog-abonnement.md](./backlog-abonnement.md).
>
> **Hors périmètre** : l'application mobile (réservée aux clients finaux), le back-office administrateur, la faille de `common/polling` (refonte de l'onboarding).

## Objectif
Terminer l'abonnement côté agence, sur un modèle unique :
- quatre plans par abonnement : **Gratuit**, Basic, Standard, Premium ;
- plus de modèle à la commission ;
- des limites prévenues dès 80 % ;
- des paiements qui ne se perdent pas ;
- un cycle de vie complet par e-mail.

## Décisions déjà prises
| Sujet | Décision |
|---|---|
| Modèle commission | Supprimé (données de dev, schéma, code back et front). Seul l'abonnement reste. |
| Plan Gratuit | 4ᵉ plan, l'entrée de gamme. Pas de paiement, pas d'échéance, pas de rappel, pas d'expiration. |
| Alerte de limite | À **80 %** d'une fonctionnalité, au clic sur « Ajouter » : un pop-up montre l'usage, avec « Continuer » qui poursuit l'action demandée. À 100 %, le blocage actuel reste. |
| Questionnaire | **Optionnel**, à la fermeture de l'agence et à la résiliation de l'abonnement, pour recueillir les raisons. |
| Codes promo | Champ **visible mais désactivé** (« Bientôt disponible »), à des fins de design seulement. |
| Changement de prix | Ne touche pas la période en cours. S'applique au **prochain** renouvellement (déjà le cas côté calcul ; il reste à l'afficher et à le tester). |
| `SUBSCRIPTION_EXPIRY_ENABLED` | Présente dans `.env` (dev, `true`). À ajouter dans `.env.uat`. |

## Tâches

### Phase 1 : catalogue (Gratuit, fin de la commission)
**C1 [back] Plan Gratuit**
- [x] Ajouter la valeur `FREE_SUB` à l'enum `Plan`. Seed : prix 0 (mensuel et annuel), limites validées (2 biens, 2 annonces, 0 collaborateur).
- [x] Un abonnement Gratuit n'a pas d'échéance : le job d'expiration et les rappels l'ignorent.
- [x] Passer au Gratuit est un downgrade programmé. Quitter le Gratuit est un upgrade payé plein tarif, avec une nouvelle période à partir du paiement (libellé « Changement de plan », pas « Réactivation »). Un checkout à 0 reste refusé.
- **Tests** : devis depuis et vers le Gratuit ; aucun rappel ni expiration en Gratuit ; downgrade programmé appliqué vers le Gratuit.

**C2 [back] Suppression du modèle commission** (migration 17, contraction)
- [x] Données de dev : les 4 agences sur un plan commission passent au Gratuit, puis les 3 plans commission sont supprimés.
- [x] Schéma :
  - retirer `commissionRate` de `SubscriptionPlan` et de `Subscription` ;
  - retirer `pricingType` (2 tables) et `planCategory` ;
  - supprimer les enums `PricingType` et `PlanCategory` ;
  - retirer les valeurs `*_COMMISSION` de `Plan`.
- [x] Code : `payment.service`, `agency.service`, `pack.dto`, `pack-admin.service`, `naboo.ts`, `subscription-change.service`, seed.
- [x] Avant l'UAT : contrôle en lecture seule des agences UAT encore sur un plan commission, puis même passage au Gratuit avant la migration.
- **Tests** : suite verte. Plus aucune occurrence de `commission` hors historique des migrations.

**C3 [front] Suppression du modèle commission**
- [x] Retirer le choix commission / abonnement de l'onboarding et du pricing (`PlanSelectMode`, branches de `PlanCard`, `PrincingSection`, `pricing.ts`), ainsi que les types, enums et traductions.
- [x] Afficher le plan Gratuit dans le catalogue et dans le changement de plan : « Gratuit » au lieu de « 0 F CFA », et pas de bascule mensuel / annuel pour lui.

### Checkpoint A
- [x] Tests et builds verts (back 321, front 71). Catalogue : 4 plans.
- [ ] Navigateur : une agence de dev passée au Gratuit voit sa page abonnement sans échéance.

### Phase 2 : alerte à 80 %
**C4 [front] Pop-up « bientôt à la limite »**
- [x] `useFeatureGuard` : dans l'état `NEAR_LIMIT`, un pop-up s'ouvre avant l'action. Il contient :
  - une jauge, « 16 sur 20 biens » et « il en restera 3 après cet ajout » ;
  - l'aperçu du plan supérieur, selon la même règle d'historique que le blocage ;
  - le bouton **« Continuer »**, qui lance l'action d'origine ;
  - le bouton « Voir les plans » (owner).
- [x] Fréquence : une fois par session et par fonctionnalité.
- [x] Contrat de design et revue UX / accessibilité, comme pour le changement de plan.

### Phase 3 : paiements fiables
**C5 [back] Rattrapage et nettoyage des paiements**
- [x] Job toutes les 15 min : les paiements d'abonnement `PENDING` âgés de 5 min à 48 h sont relus chez NabooPay. S'ils sont payés, l'événement de confirmation est émis (application unique) ; s'ils sont annulés ou échoués, leur statut local est mis à jour.
- [x] Au-delà de 48 h toujours en attente : `CANCELLED` (« abandonné »).
- **Tests** : webhook perdu → appliqué par le job ; abandonné → annulé ; jamais appliqué deux fois.

**C6 [back] E-mails du cycle de vie** (Resend : finalement **un seul modèle générique** `SUBSCRIPTION_NOTICE`, texte rédigé par le backend ; le rappel de renouvellement y passe aussi)
- [x] Paiement confirmé : montant, plan, période. Pas de PDF (module facturation).
- [x] Abonnement expiré.
- [x] Downgrade appliqué : éléments désactivés et comment les réactiver.
- [x] Rappel 3 jours avant un downgrade programmé.
- [x] Clés des nouveaux modèles dans `.env` et `.env.uat`.

### Checkpoint B
- [x] Tests : rattrapage (webhook perdu, abandon à 48 h, NabooPay indisponible), avis (4 cas). Back 335 tests.
- [ ] Dev : modèle `SUBSCRIPTION_NOTICE` créé dans Resend, e-mails reçus.

### Phase 4 : expérience
**C7 Questionnaire optionnel** (back et front, migration 18)
- [x] Table `CancellationFeedback` : agence, contexte (`SUBSCRIPTION_CANCEL` | `AGENCY_CLOSE`), raison, commentaire, date.
- [x] Les routes de résiliation et de fermeture acceptent `{ reason?, comment? }`.
- [x] Questionnaire facultatif dans les deux dialogues d'impact (raison + commentaire, sous l'impact) : le laisser vide revient à le passer, sans étape en plus.
- [x] Raisons : voir les réponses validées.

**C8 [front] Code promo (design seulement)**
- [x] Champ « Code promo » désactivé, avec le badge « Bientôt disponible », dans le récapitulatif du changement de plan. Aucun appel API.

**C9 Changement de prix** (back et front)
- [x] Test : le renouvellement est facturé au tarif du catalogue, et la période en cours garde son prix.
- [x] Page abonnement : si le tarif du catalogue diffère du prix payé, afficher « Nouveau tarif de X à partir du prochain renouvellement ».

### Phase 5 : mise en service
**C10 Environnements**
- [ ] `SUBSCRIPTION_EXPIRY_ENABLED` dans `.env.uat` (`false`, puis `true` à l'étape 4), plus les clés Resend de C6.
- [ ] Procédure UAT dans `CHANGES.md` :
  1. déployer le code ;
  2. migrations 15 et 16, puis passage des agences commission au Gratuit, puis 17 et 18 ;
  3. script de délai de grâce ;
  4. flag d'expiration.

### Checkpoint final
- [ ] Audit de sécurité des phases 1 à 4, tests et builds verts, vérification dans le navigateur (mobile compris).

## Réponses validées (2026-10-01)
1. **Plan Gratuit** : 2 biens, 2 annonces en ligne, 0 collaborateur, sans support premium.
2. **Agences de dev sur un plan commission** : passage au Gratuit ; ce qui dépasse est désactivé, les éléments les plus anciens sont gardés.
3. **Alerte à 80 %** : une fois par session et par fonctionnalité.
4. **Flag en UAT** : `false` jusqu'à l'étape 4 de la procédure, puis `true`.
5. **Raisons du questionnaire** : trop cher ; il manque des fonctionnalités ; je n'utilise pas assez la plateforme ; je passe à un autre outil ; problème technique ; fermeture de l'activité ; autre.

## Précisions d'implémentation
- Migrations : **16** ajoute `FREE_SUB` (une valeur d'enum ajoutée ne peut pas servir dans la même transaction) ; un script passe les agences commission au Gratuit ; **17** retire la commission ; **18** crée la table du questionnaire.
- Un abonnement Gratuit n'a ni cycle ni échéance (`currentPeriodEnd` nul) : ni rappel, ni expiration, ni résiliation.
- Une agence expirée peut repasser au Gratuit tout de suite, sans paiement (montant 0) ; les autres y passent à l'échéance.
