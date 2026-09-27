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

## 5. Messages : chat avec les clients

- **Page Messages** (`/dashboard/chat`, lien réactivé dans la sidebar avec le badge des non-lus) : les conversations de l'agence, une par client et par bien. Recherche (client ou bien), filtre « Non lues », pagination au défilement. La conversation ouverte est dans l'URL (`?c=`).
- **Conversation** : client (présence, téléphone), bien et réservation en contexte ; photos, PDF et notes vocales envoyées depuis le mobile ; envoi de texte et de 3 pièces jointes (PDF, JPG, PNG, 2 Mo chacune) ; statuts envoyé / distribué / lu, « Réessayer » en cas d'échec. Les messages des collègues sont signés.
- **Réservations** : « Contacter le client » dans le détail d'une réservation ouvre la discussion du bien, réservation en contexte.
- **Permissions** : `view_conversations` (voir les messages) et `reply_conversations` (répondre) ; sans la seconde, la conversation est en lecture seule. L'owner a tous les droits.
- **Temps réel** : `ChatProvider` est monté dans le layout du dashboard ; les messages reçus mettent à jour la liste et le badge sur toutes les pages. L'ancienne création de conversation (équipe / lead) est supprimée.

## 6. Équipe : modifier les permissions d'un membre

- Dans le détail d'un membre, l'owner peut « Modifier les permissions » avec le même sélecteur qu'à l'invitation (permissions du plan uniquement), puis enregistrer.
- Le bouton Activer / Désactiver du détail inversait l'action : il bascule désormais correctement le statut.
