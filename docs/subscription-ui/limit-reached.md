# Module `limit-reached` : blocage des créations au-delà du plan

> Demande du 2026-10-01. Décisions validées le même jour. Spec, plan et tâches réunis (petit module).

## Objectif
Quand une fonctionnalité limitée est utilisée à 100 %, par exemple après un downgrade Premium → Standard ou Basic, les boutons « Ajouter » n'ouvrent plus le formulaire. Ils ouvrent un pop-up « limite atteinte ».

## Règles
- **Concerné** : biens, terrains et bâtiments (`manage_properties`), annonces (`publish_properties`), invitations de membres (`manage_users`).
- **Points d'entrée** : bouton « Ajouter » des listes, menu « Créer » de l'accueil, « Ajouter un bien » du détail d'un bâtiment. La modification d'un élément existant n'est pas concernée.
- **Pop-up pour tous** : « Vous utilisez X sur Y … de votre plan ».
  - L'owner a un bouton « Changer de plan ».
  - Le staff est invité à contacter le propriétaire.
- **Aperçu du plan supérieur**, seulement pour une agence **sans historique de paiement** (aucun paiement payé autre que l'inscription). C'est le plus petit plan qui lève la limite. L'aperçu montre son nom, son prix mensuel, sa nouvelle limite et ce qu'il apporte en plus. Avec un historique, le pop-up s'affiche sans cet aperçu.
- **Le backend reste la barrière** : les créations au-delà de la limite sont déjà refusées. Le pop-up évite seulement de remplir un formulaire pour rien.

## Contrat
`GET secured/agency/subscription/limits?agencyId` (owner **et** staff de l'agence) :
`{ plan: { id, name }, usage: FeatureUsage[], hasPaymentHistory: boolean }`

Mêmes compteurs que la page abonnement. Aucun prix ni montant payé n'est renvoyé.

## Tâches
- [ ] T1 [back] : route `limits` (+ tests : membre de l'agence OK, autre agence refusée, historique = paiement payé hors inscription).
- [ ] T2 : `useFeatureGuard(feature)` et `LimitReachedModal` (aperçu calculé depuis le catalogue public des plans).
- [ ] T3 : branchement sur les points d'entrée listés.
- [ ] Checkpoint : tests et builds, audit de sécurité, vérification manuelle sur Mobelite.
