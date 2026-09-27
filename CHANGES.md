# Changements majeurs — Front (dashboard web)

Résumé des évolutions structurantes depuis `main`. `CHANGELOG.md` reste géré par semantic-release.

## 1. Stabilité et sécurité

- **Builds typés à nouveau.** `next build` vérifie le typage, et plus aucun jeton de session n'est écrit dans les logs.
- **Service worker désactivé.** Il ne fonctionne pas avec Turbopack ; il sera réactivé dans un lot dédié à la PWA.
- **Plus d'identité dans les requêtes.** Le front n'envoie plus de `userId` : le backend lit l'identité dans la session.
- **Clés de requête.** Les clés TanStack incluent leurs paramètres, et l'invalidation se fait par préfixe.

## 2. Formulaire de bien : modalités de location

- Nouvelle section `RentalConfigsSection`. Pour chaque modalité (journalière, nocturne, mensuelle, annuelle) : prix, caution, durées et périodes de disponibilité, avec l'explication de chaque type.
- Le prix et la caution ne sont plus saisis dans « Informations principales » : ils sont dérivés des modalités par le backend.
- La validation Yup reproduit les règles du backend, qui reste la référence. Une période couvre au moins une unité : 2 jours, 1 mois ou 1 an.
- Ordre du formulaire : informations, localisation, caractéristiques, puis modalités.
- `FormDatePicker` accepte `minDate`, qui grise les jours sans bloquer la navigation. `FormErrorFocus` fait défiler la page jusqu'au premier champ en erreur.

## 3. Réservations côté agence

- **La page « Demandes » (`/dashboard/leads`) devient « Réservations » (`/dashboard/bookings`).**
  - Statistiques : à traiter, confirmées, refusées ou annulées, montant confirmé.
  - Filtres par statut, et tableau avec client, bien, modalité, période et montants.
  - Détail d'une demande avec confirmation. Un avertissement s'affiche quand d'autres demandes en attente portent sur les mêmes dates : elles seront refusées automatiquement.
  - Refus avec un motif obligatoire, transmis au client.
- Nouveau module de store `BookingsModule` (liste de l'agence, confirmation, refus). Le badge de la barre latérale affiche le nombre de demandes à traiter.
- Le store `LeadsModule` est conservé : les visites et le chat l'utilisent encore.

## 4. Notifications

- Nouveau type `BOOKING`. Un type inconnu du front s'affiche comme une notification système au lieu de faire planter le dashboard.
