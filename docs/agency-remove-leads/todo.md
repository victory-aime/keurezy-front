# Tâches : `agency-remove-leads`

- [x] **T1. Types et store.**
  - `IVisitClient`.
  - `IVisitResponse` : `client`, `property` et `agent`, sans `lead`.
  - Route, service, requête et constante `AGENCY_CLIENTS`.
- [x] **T2. `pickVisitRefs` et tests Vitest.** Renvoie client, bien, agent et statut, sans `leadId`.
- [x] **T3. Formulaire.**
  - Listes Client, Bien et Agent, avec les états chargement et vide.
  - Validation Yup (`clientId`, `propertyId`).
  - Préremplissage en modification.
- [x] **T4. Agenda et détail.** Ils lisent `property`, `client` et `agent`.
- [x] **T5. Suppression du code des leads.** Store, types, statistiques, page tarifs, traductions. On garde le type de notification `LEAD`.
- [x] **T6. Vérification.**
  - Typecheck, build, tests.
  - Aucune référence aux leads (hors notifications).
  - Revue et audit de sécurité.
