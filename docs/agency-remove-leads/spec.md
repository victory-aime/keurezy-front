# Spec : `agency-remove-leads`

> Module 2 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond aux lots 1 (tâche 1) et 7 du backend : les visites sont rattachées au client, et les leads sont supprimés.

## Objectif
Le backend a supprimé les leads (`leads/*` n'existe plus). Une visite se crée maintenant avec `clientId` et `propertyId`, et la liste renvoie `client`, `property` et `agent` au lieu de `lead`. Aujourd'hui, la page Rendez-vous du web est cassée :
- le formulaire liste les leads (404) ;
- il envoie `leadId`, que le backend refuse ;
- l'agenda et le détail lisent `lead.*`.

**Résultat attendu** : l'agence planifie et consulte ses visites sans aucune notion de lead, et plus aucun code des leads ne subsiste dans le web.

### Critères d'acceptation
1. **Formulaire de visite** : trois listes remplacent la liste des leads.
   - **Client** (obligatoire) : alimenté par `GET visits/agency-clients`, c'est-à-dire les clients ayant réservé ou écrit à l'agence. Libellé : nom et e-mail.
   - **Bien** (obligatoire) : les propriétés de l'agence (`PropertyModule.getAllPropertiesByAgency`, déjà utilisé).
   - **Agent** (facultatif) : les membres actifs de l'équipe (`TeamModule.getAllTeamByAgency`, déjà utilisé).
   - La requête envoie `clientId`, `propertyId` et `agentId`, sans `leadId`.
   - En modification, les trois champs sont préremplis depuis la visite.
2. **Liste vide** : si aucun client n'a encore contacté l'agence, le champ Client affiche un message explicite (« Aucun client : un client apparaît ici après une réservation ou un message »), et le bouton d'enregistrement reste désactivé.
3. **Agenda et détail** : ils lisent `visit.property` (titre, prix), `visit.client` (nom, e-mail, téléphone) et `visit.agent`. Plus aucun accès `lead.*`.
4. **Suppression du code leads** :
   - store : service, instance, requêtes, constantes, routes `LEADS`, exports ;
   - types : `models/leads.ts`, `ILeadsAgency`, `leadId` et `lead` dans les visites, `leads` dans les stats de l'agence ;
   - validation Yup (`leadId`) ;
   - KPI et graphiques « Leads » de la page Statistiques ;
   - ligne « Gestion des leads » de la page tarifs ;
   - traductions qui ne servent plus.
5. **Conservé** : le type de notification `LEAD` (`Layout.tsx`, `notification-config.ts`). Les notifications déjà reçues de ce type doivent continuer à s'afficher correctement.
6. Le typecheck et le build passent. Aucune référence à `LeadsModule`, `ILeadsAgency` ou `leadId` ne reste dans `src/`.

## Stack et commandes
Voir le [module 1](../agency-permissions-ui/spec.md). Les commandes sont `npx tsc --noEmit`, `pnpm build` et `pnpm test`.

## Structure
- Visites : `src/app/dashboard/visits/components/{VisitsList,VisitForm,VisiteDetails}.tsx`
- Store : `src/store/{endpoints/route.ts,services,state-management}`. Nouvelle requête `VisitsModule.agencyClientsQueries`, sur le modèle des requêtes existantes.
- Types : `src/types/models/visits.ts`, avec un nouveau type `IVisitClient`.
- Validation : `src/types/validation/visits.ts`

## Style de code
Les listes suivent le modèle `createListCollection` déjà utilisé :

```tsx
/** Clients proposés : ceux qui ont réservé ou écrit à l'agence (backend `visits/agency-clients`). */
const clientList = createListCollection({
  items: (agencyClients ?? []).map((client) => ({
    label: `${client.user.name} · ${client.user.email}`,
    value: client.id,
  })),
});
```

- Le formulaire envoie les identifiants tels quels. On ne déduit plus le bien ni l'agent à partir d'un autre objet.
- Chaque fonction exportée a une JSDoc, et chaque choix non évident un commentaire d'intention.

## Design (skill `frontend-ui-engineering`)
- Même disposition que le formulaire actuel (`FormSelect` et grille existants). Le champ Lead devient Client, et deux champs sont ajoutés : Bien et Agent.
- États gérés :
  - chargement des listes (champ désactivé et indicateur) ;
  - liste vide (message) ;
  - erreur (toast global existant).
- Accessibilité : chaque liste a un libellé visible. Les champs obligatoires sont signalés par le composant de formulaire existant.

## Stratégie de tests
- **Vitest** : la fonction pure `toVisitPayload(values)`, extraite de `handleSubmitValues`. Elle assemble la date et les heures, et renvoie `clientId`, `propertyId` et `agentId`, sans `leadId`.
- **Test manuel** :
  - créer une visite pour un client qui a réservé ;
  - la modifier ;
  - vérifier l'agenda et le détail ;
  - vérifier l'état vide avec une agence sans client.

## Limites
- **Toujours** : réutiliser les requêtes existantes pour les biens et l'équipe ; audit de sécurité en fin de module ; code documenté.
- **Demander d'abord** : un changement de l'API backend.
- **Jamais** : conserver du code des leads « au cas où » ; afficher des clients qui ne sont pas liés à l'agence (c'est le backend qui filtre).

## Questions ouvertes
Aucune. Les champs du formulaire découlent du contrat backend (`CreateVisitDto`).
