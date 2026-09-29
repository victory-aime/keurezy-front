# Plan : `agency-remove-leads`

Spécification : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md).

## Décisions
- **Store.** Nouvelle requête `VisitsModule.agencyClientsQueries`, qui appelle `visits/agency-clients`. Les biens et l'équipe réutilisent les requêtes existantes.
- **Formulaire.** Les identifiants (client, bien, agent) sont lus par la fonction pure `pickVisitRefs`, testée avec Vitest.
- **Modification d'une visite.** Le backend (`UpdateVisitDto`) ne permet pas de changer le client ni le bien. Ces deux champs sont donc désactivés en modification, comme l'était le lead. L'agent reste modifiable.
- **Biens proposés.** On demande 100 biens (`limitPerPage: 100`).
  ```ts
  // ponytail: au-delà de 100 biens, passer à une recherche asynchrone
  ```

## Ordre
1. Types et store.
2. `pickVisitRefs` et ses tests.
3. Formulaire, agenda et détail.
4. Suppression du code des leads.
5. Vérification, revue et audit.
