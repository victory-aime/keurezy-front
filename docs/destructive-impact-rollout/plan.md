# Plan : `destructive-impact-rollout`

Spec : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md).

## Décisions d'architecture
- **Aucun nouveau composant.**
  - `ActionImpactDialog` gère l'affichage.
  - Les builders purs vont dans `src/utils/impact.ts`, qui reste la seule source de vérité des textes et des couleurs.
  - Chaque dialogue est testé par son builder (Vitest), pas par un rendu.
- **Réutiliser les endpoints d'impact existants.**
  - Annonce : `property/impact`.
  - Membre : `team/member-impact`.
  - Seule la fermeture d'agence ajoute un endpoint, `agency/close-impact`, construit comme `getMemberImpact` : lecture seule, owner uniquement, et `agencyAccessControl`.
- **Les requêtes d'impact** partent uniquement à l'ouverture du dialogue (`enabled: open && permission`) avec `ENTITY_QUERY_OPTIONS`, pour ne jamais afficher l'impact d'une autre entité.
- **Correctifs backend dans les services existants**, sans nouveau module :
  - `cancelVisit` inclut `agent.userId` ;
  - `enableOrDisabledAccount` supprime les sessions à la désactivation, dans la même transaction que pour le retrait ;
  - `closeAgency` désactive les membres et supprime leurs sessions ;
  - la liste publique des biens filtre `agency.status = ACTIVE`.
- **« Supprimer mon compte » (owner)** : c'est une redirection vers la fermeture d'agence (`/dashboard/agency`), sans second chemin de fermeture. Pour un staff, le bouton est masqué.

## Risques
| Risque | Impact | Mitigation |
|---|---|---|
| Un membre désactivé garde un onglet ouvert | Faible | Ses sessions sont supprimées : la requête suivante renvoie 401, puis l'écran de session expirée s'affiche. |
| Liste publique filtrée par le statut de l'agence : un bien d'une agence en PENDING disparaît | Moyen | On filtre uniquement `status != CLOSE`, pour garder le comportement actuel des agences PENDING. |
| Fermeture d'agence avec des réservations confirmées à venir | Moyen | Aucune annulation automatique. L'impact les affiche en orange, avec le conseil de prévenir ou d'annuler avant. |

## Ordre
T1 et T2 (backend) → T3 (annonce) → T4 (visite) → T5 (membre) → *checkpoint : test manuel* → T6 (compte et agence) → T7 (sessions) → T8 (audit de sécurité).
