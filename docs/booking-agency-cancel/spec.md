# Spec : `booking-agency-cancel`

> Module 4 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond au lot 3 du backend : annulation par l'agence (`PATCH bookings/agency-cancel`) et passage automatique à `COMPLETED`.

## Objectif
L'agence peut maintenant annuler une réservation **confirmée qui n'a pas commencé**, avec un motif. Le web n'expose pas encore cette action. Conformément à la règle de design, **l'annulation montre d'abord ce qu'elle entraîne** : qui est prévenu, quelles dates se libèrent, ce qui est conservé.

### Critères d'acceptation
1. **Bouton « Annuler la réservation »** dans `BookingDetailsModal`, en action secondaire.
   - Il n'apparaît que pour une réservation `CONFIRMED` dont le début est après aujourd'hui, et seulement avec la permission `manage_bookings`.
   - Le backend refuse les autres cas (`BOOKING_NOT_CANCELLABLE`), et le message s'affiche.
2. **Dialogue d'impact** (`ActionImpactDialog`), qui reçoit un champ **Motif** obligatoire (500 caractères maximum). Le composant accepte pour cela un contenu additionnel. Les groupes affichés :
   - **Ce qui change** (orange) :
     - « Awa Diop sera prévenue par notification et par e-mail, avec votre motif. »
     - « Les dates du 5 au 10 octobre redeviennent réservables. »
     - « Le séjour de 150 000 FCFA n'aura pas lieu. »
   - **Ce qui est conservé** (vert) :
     - « La réservation reste dans l'historique, avec le statut Annulée et votre motif. »
     - « La discussion avec le client. »
   - Le bouton de confirmation « Annuler la réservation » est rouge. Il reste désactivé tant que le motif est vide.
3. **Après succès** : le dialogue et le détail se ferment, et la liste ainsi que le badge de la sidebar se rechargent.
4. **Filtre « Terminées »** : ajouté à la liste des réservations. Le statut `COMPLETED`, posé par le cron du backend, s'affiche déjà « Terminée ».

## Store
- `route.ts` : `BOOKINGS.AGENCY_CANCEL` (PATCH, `id` en query, `reason` dans le corps).
- `BookingsService.agency_cancel`.
- `BookingsModule.agencyCancelBookingMutation`.

## Design (skill `frontend-ui-engineering`)
- On réutilise `ActionImpactDialog`, qui accepte un `children` affiché sous les groupes (le champ Motif) et un `confirmDisabled` en plus du blocage par l'impact.
- Constructeur pur `bookingCancelImpact({ clientName, period, totalAmount })` dans `_utils/impact`. Le montant est formaté en FCFA (`fr-FR`).
- Accessibilité : le champ Motif a un libellé visible et un message d'erreur lié. Le bouton désactivé est expliqué par l'aide du champ.

## Stratégie de tests
- **Vitest** : `bookingCancelImpact` (phrases, pluriel ou singulier, montant formaté, absence de client).
- **Test manuel** :
  - annuler une réservation confirmée à venir ;
  - vérifier la notification et l'e-mail côté client, puis que les dates sont de nouveau réservables ;
  - vérifier que le bouton est absent pour une réservation en attente ou déjà commencée.

## Limites
- **Toujours** : un motif obligatoire, une confirmation avec l'impact, la documentation et l'audit.
- **Jamais** : annuler sans motif ; laisser croire qu'un remboursement a lieu, puisqu'il n'y a pas de paiement en ligne.
