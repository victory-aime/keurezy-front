# Spec : loader Keurezy, sélecteur d'année, code promo au changement de plan

> Demande du 2026-10-04.

## 1. Loader global Keurezy

### Constat
Deux loaders incohérents cohabitent :
- `GlobalLoader` : trois points sur un fond quasi noir, utilisé pendant la validation du paiement à l'onboarding ;
- `KeurezyLogoAnimation` : celui du `LoaderProvider`.

Le second a plusieurs défauts :
- **Fond inversé** : quasi noir en thème clair, quasi blanc en thème sombre. En sombre, la maison blanche du pictogramme disparaît.
- **Durée imposée** : au moins 2 s d'affichage, même quand l'opération est instantanée.
- **Animations réduites** : plus de fond, la page reste visible et cliquable derrière.
- **Logo** : imitation en texte au lieu du vrai logo. Couleurs codées en dur, accroche figée.

### Proposition : un seul `KeurezyLoader`
- **Calque plein écran** aux couleurs du thème (`bg`, avec un flou), qui bloque l'interface derrière. Il est annoncé aux lecteurs d'écran (`role="status"`, `aria-live`, `aria-busy`).
- **Vrai logo** (`BrandLogo`), avec une respiration discrète.
- **Barre de progression indéterminée** aux couleurs de la charte (violet, turquoise, or).
- **Message optionnel** (titre et description), par exemple « Validation du paiement… ».
- **Durée minimale de 500 ms** une fois affiché, pour éviter un clignotement, au lieu de 2 s.
- **Animations réduites** : même calque, logo fixe, et une barre statique qui ne défile pas.
- **API du provider inchangée**, sauf un message optionnel : `showLoader(message?)`, `hideLoader()`, `withLoader(fn, message?)`.
- **Supprimés** : `GlobalLoader`, `KeurezyLogoAnimation`, `PulseRing`, `GlobeIcon` et leurs types. L'onboarding utilise `KeurezyLoader`.

## 2. `FormYearPicker` lié à Formik
- **Même modèle que les autres champs** (`FormDatePicker`…) : `useField(name)`, libellé traduit, astérisque si `required`, erreur affichée après contact ou après une soumission, squelette pendant le chargement, lecture seule, désactivé.
- **Valeur Formik** : l'année en nombre (`2026`).
- **Bornes** `minYear` / `maxYear` : par défaut, de 2020 à l'année en cours. Les années hors bornes sont grisées.
- **Ouverture** : directement sur la grille des années, en français, et la saisie au clavier reste possible.
- **Statistiques** : le tableau de bord pilote l'année des revenus mensuels avec ce champ, dans un petit formulaire Formik (`onChange` vers la requête). Aucun bouton de validation.
- **Effet de bord** : la modification `defaultView="year"` dans `FormDatePicker` ouvrait toutes les dates de l'application (réservations, visites…) sur la grille des années. Elle est retirée, puisque `FormYearPicker` couvre ce besoin.

## 3. Code promo dès le choix du plan (changement de plan)
- **Barre récapitulative à l'étape 1**, au-dessus des cartes, comme à l'onboarding (même composant, partagé) : plan choisi, prix, champ « Code promo » sur la même ligne. Le code est vérifié par le serveur (`subscriptionPromoQuoteMutation`).
- **Code accepté** : prix d'origine barré et nouveau montant en vert, puis devis remisé aux étapes 2 et 3.
- **Remise à zéro** au changement de plan ou de cycle, comme aujourd'hui.
- **Récapitulatif (étape 3)** : il affiche le code appliqué, avec « Retirer », mais plus le champ de saisie. Il n'y a qu'un seul endroit pour saisir.
- **Backend** : rien à changer, la route de devis avec code promo existe déjà.

## Branches
- **Front**
  - `feat/landing-redesign` : les deux commits de la landing et tes retouches de la landing.
  - `feat/loader-year-picker-promo` : ce lot.
- **Back** : aucun changement pour ce lot.

## Réalisé
- [x] **`KeurezyLoader`** (`components/custom/loader`), utilisé par le `LoaderProvider`, l'onboarding (validation du paiement), la redirection après connexion, la vérification de l'e-mail et l'acceptation d'invitation.
  - `showLoader(message?)` et `withLoader(fn, message?)`.
  - Durée minimale de 500 ms.
  - Supprimés : `GlobalLoader`, `KeurezyLogoAnimation`, `PulseRing`, `GlobeIcon`.
- [x] **`FormYearPicker`** lié à Formik (`useField`, erreurs, squelette, bornes, `onChangeFunc`). La saisie libre est convertie par `parseYearInput` (`utils/year.ts`, 4 tests).
  - Statistiques : choix de l'année dans l'en-tête du graphique des revenus. Pendant le chargement, le squelette reste dans le cadre et le champ reste visible.
  - `defaultView="year"` est retiré de `FormDatePicker`.
- [x] **`PlanSummaryBar`**, partagé entre l'onboarding et le changement de plan : le code promo se vérifie dès l'étape 1, et le devis remisé sert aux étapes 2 et 3. Le récapitulatif n'affiche plus que le code appliqué, avec « Retirer ».
- **Vérifié dans le navigateur** (page de contrôle supprimée ensuite) :
  - la grille des années s'ouvre directement ; 2027 et après sont grisées ; un clic et la saisie « 25 » donnent 2025 ;
  - mauvais code refusé avec le message du serveur ; bon code : pastille et montant « à payer » ;
  - le loader couvre et bloque la page, et affiche le message.
- **Tests et build** : 120 tests, build OK.

### Sécurité
- **Aucune nouvelle route, aucune nouvelle donnée.**
- **Code promo** : il reste vérifié et appliqué par le serveur. Le montant affiché vient du devis, et le code est revérifié au paiement.
- **Loader** : il n'affiche que des messages statiques, aucune donnée utilisateur.
