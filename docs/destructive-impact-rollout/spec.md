# Spec : `destructive-impact-rollout`

> Suite de [`property-lifecycle`](../property-lifecycle/spec.md). Règle produit (voir la mémoire `destructive-action-impact`) : une suppression, une fermeture ou une annulation montre d'abord **ce qu'elle entraîne**. On y trouve l'historique lié, des comptes, des groupes colorés et une alternative plus sûre, jamais un simple « êtes-vous sûr ».
> **Drive et la corbeille sont hors périmètre** (décision du 29/09).

## Objectif
Migrer les dernières confirmations de l'ancien `DeleteModalAnimation` vers `ActionImpactDialog` et les builders purs de `src/utils/impact.ts`.

## Actions couvertes

### 1. Suppression d'annonce (`DeleteAnnonce`)
- **Constat** : le texte est « Voulez vous vraiment supprimer cette annonce ». Côté backend, `annonce.delete` supprime la ligne, sans aucune relation dépendante.
- **Données** : on réutilise `GET property/impact?propertyId` (le bien de l'annonce). **Aucun nouvel endpoint.**
- **Impact affiché** :
  - rouge « Supprimé définitivement » : l'annonce, son texte et ses photos ;
  - orange « Ce qui change » : si c'est la dernière annonce en ligne du bien, les clients ne verront plus le bien ;
  - vert « Conservé » : le bien, ses réservations, discussions et visites (comptes).
- **Alternative** : si l'annonce est en ligne, on propose « Dépublier plutôt ».
  - Elle passe par `PATCH annonce/update` avec `status: INACTIVE` (permission `publish_property`), et reste réversible.
  - La suppression exige `unpublish_property`, comme aujourd'hui.
- Builder : `annonceDeleteImpact(annonce, propertyImpact)`.

### 2. Annulation de visite (`VisitsList`)
- **Données** : la visite déjà chargée (client, bien, agent, créneau). Aucun appel.
- **Impact** :
  - orange « Ce qui change » : statut Annulée ; le client et l'agent sont notifiés, avec leur nom ;
  - vert « Conservé » : l'historique de la visite, le bien et les réservations.
  - Une visite effectuée n'est pas annulable : on affiche l'état « blocked » (le backend renvoie déjà `VISIT_ALREADY_DONE`).
- **Bug backend lié** : `visits.service.ts` `cancelVisit` notifie `visit.agentId`, qui est un **Staff.id**, pas un user id. L'agent n'est donc jamais notifié. Correctif : inclure `agent.userId`, comme au lot 1 dans le cron.
- Builder : `visitCancelImpact(visit)`.

### 3. Désactivation d'un membre (interrupteur de statut, `TeamList`)
- **Constat** : l'interrupteur désactive immédiatement, sans confirmation. Côté backend (`enableOrDisabledAccount`), `User.status` et `Staff.isActive` passent à inactif, mais **ses sessions ne sont pas révoquées** (contrairement au retrait), et ses visites restent assignées.
- **Données** : on réutilise `GET team/member-impact` (owner uniquement).
- **Impact** (désactivation seulement ; la réactivation reste immédiate) :
  - orange « Ce qui change » : visites et tickets toujours assignés, à réassigner ;
  - rouge « Suspendu » : accès et sessions ;
  - vert « Conservé » : permissions, messages, et compte réactivable à tout moment.
- **Backend** : révoquer les sessions à la désactivation (même mécanisme que le retrait).
- Builder : `memberDisableImpact(impact)`.

### 4. « Supprimer mon compte » (Sécurité) et fermeture d'agence (Agence)
- **Constats** :
  - `DisabledAccount` a un `callback={() => {}}` : **le bouton ne fait rien** ;
  - « Fermer les sessions » a aussi son callback en commentaire ;
  - la fermeture d'agence (`AgencyInfo`) est branchée, mais n'affiche qu'un texte générique.
  - Côté backend, `closeAgency` passe l'agence en CLOSE, l'owner en USER et l'abonnement en INACTIVE. En revanche, il **ne désactive pas les membres et ne retire pas les biens de la liste publique** : `GET unsecured/property` ne filtre que `status: AVAILABLE`, pas le statut de l'agence.
- **Proposition** : pour un owner, « Supprimer mon compte » **renvoie vers** la fermeture d'agence, un seul chemin. Pour un staff, pas d'auto-suppression : c'est l'owner qui retire.
- **Nouvel endpoint** `GET agency/close-impact` (owner) : membres actifs, biens et annonces en ligne, réservations confirmées à venir, demandes en attente, abonnement (fin de période).
- **Impact** :
  - rouge « Définitif » : l'accès de l'owner et de N membres, et l'abonnement ;
  - orange « Ce qui change » : N annonces retirées ; N réservations à venir à honorer ou annuler ;
  - vert « Conservé » : l'historique, pour les obligations comptables.
  - La confirmation se fait en retapant le nom de l'agence (on garde le principe de `DisabledAccount`).
- **Backend** : la fermeture désactive aussi les membres et révoque leurs sessions, et la liste publique exclut les agences CLOSE.
- « Fermer les sessions » : on branche `authClient.revokeOtherSessions()` ; l'impact affiche le nombre d'autres sessions actives.

## Critères d'acceptation
1. Aucune de ces actions n'utilise plus `DeleteModalAnimation` avec un texte générique.
2. Chaque dialogue affiche les comptes réels, et le bouton est désactivé tant que l'impact charge ou si l'action est bloquée.
3. L'interrupteur de statut ne désactive qu'après confirmation.
4. Les correctifs backend sont couverts par des tests Jest : notification de l'agent, sessions révoquées, liste publique filtrée, `close-impact`.

## Tests
- **Vitest** : chaque builder (cas vide, cas avec historique, cas bloqué).
- **Manuel** : les quatre dialogues, et un staff sans permission (aucune requête d'impact ne part).

## Hors périmètre
Drive et la corbeille, puis la suppression RGPD complète d'un compte, qui fera l'objet d'un chantier dédié.
