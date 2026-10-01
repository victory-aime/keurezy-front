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
- [x] T1 [back] : route `limits` (+ tests : membre de l'agence OK, autre agence refusée, historique = paiement payé hors inscription).
- [x] T2 : `useFeatureGuard(feature)` et `LimitReachedModal` (aperçu calculé depuis le catalogue public des plans).
- [x] T3 : branchement sur les points d'entrée listés.
- [x] Tests (back 316, front 71) et builds OK ; audit ci-dessous.
- [ ] Vérification manuelle : Mobelite (historique de paiement simulé, donc pop-up sans aperçu) et une agence sans historique (avec aperçu).

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Contournement du pop-up (URL directe du formulaire, appel API) | Sans effet sur les quotas : le backend refuse toute création au-delà de la limite (`*_CAPACITY_REACHED`). Le pop-up n'est qu'un confort. |
| 2 | Données exposées au staff | `limits` ne renvoie que le plan, les compteurs et un booléen d'historique. Ni prix payé ni transaction ; les prix de l'aperçu viennent du catalogue public. |
| 3 | IDOR | `agencyAccessControl` (identité de session) : une autre agence est refusée, testé. |
| 4 | Dépendances, secrets | Aucun ajout. |
