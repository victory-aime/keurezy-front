# Contrat de design : changement de plan (plein écran, 3 étapes)

> Demande du 2026-10-01 : remplacer le tiroir par une modale plein écran avec un stepper, et ajouter une étape de récapitulatif où se fait la confirmation.

## Rôle de l'écran
Faire changer de plan, renouveler ou réactiver **en connaissance de cause** : l'owner doit savoir ce qu'il gagne, ce qu'il perd, ce qu'il paie et quand, avant de confirmer.

**Action principale** : « Confirmer » à l'étape 3, et seulement là.

## Étapes
| # | Étape | Contenu | Pour passer à la suivante |
|---|---|---|---|
| 1 | **Choisir** | Bascule mensuel / annuel ; plans côte à côte à partir de `lg`, empilés sur mobile ; chaque carte montre son prix, ses limites et les écarts avec le plan actuel | un plan choisi (le plan actuel seulement s'il est renouvelable) |
| 2 | **Vérifier** | Devis du backend (montant, dates) ; choix des éléments gardés si l'usage dépasse le plan visé | devis chargé, choix dans les limites |
| 3 | **Récapitulatif** | Avant / après (plan, prix, limites) ; « Ce que vous gagnez » ; « Ce qui change » ; éléments désactivés et date ; montant et moyen de paiement | « Payer … » ou « Programmer le changement » |

Renouvellement, réactivation ou modification d'un downgrade : on arrive directement à l'étape 2, et l'étape 1 est marquée faite.

## États
- **Chargement** : squelettes à la forme du contenu.
- **Erreur de devis** : message, puis « Réessayer ».
- **Mutation en cours** : boutons désactivés, fermeture bloquée.
- **Rien à garder** : l'étape 2 montre seulement le montant.

## Règles responsives
- Pied de page **collant** avec « Retour » et l'action, toujours visible.
- Contenu centré, 72rem au plus.
- Stepper : libellés visibles à partir de `md`, numéros seuls en dessous, plus « Étape x sur 3 ».

## Accessibilité
- Stepper en liste ordonnée, `aria-current="step"`.
- Focus sur le titre de l'étape à chaque changement.
- Groupe radio natif pour les plans (flèches du clavier).
- Gains et pertes distingués par une icône, pas seulement par la couleur.
- Animations coupées avec `prefers-reduced-motion`.

## À éviter
- Montants calculés côté front.
- Ombres lourdes, dégradés, violet codé en dur (on utilise la couleur de l'agence, `primary.*`).
- Confirmer depuis l'étape 2.
- Grille de cartes identiques sans hiérarchie : le plan actuel et le plan choisi doivent se distinguer.
