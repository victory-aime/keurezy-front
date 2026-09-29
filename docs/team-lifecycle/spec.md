# Spec : `team-lifecycle`

> Module 5 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond au lot 4 du backend (retrait d'un membre, renvoi d'invitation) et à la réinvitation.

## Objectif
L'owner peut retirer un membre, et l'agence peut renvoyer ou annuler une invitation. Chaque action montre d'abord ce qu'elle entraîne, conformément à la règle de design.

### Critères d'acceptation
1. **Retirer un membre** : nouvelle action « Retirer de l'équipe » dans la liste de l'équipe. Elle est **réservée à l'owner** et désactivée pour les autres.
   - L'impact vient de `GET team/member-impact` :
     - **Ce qui change** (orange) : « N visites (dont M à venir) ne seront plus assignées : réassignez-les » ; « N tickets désassignés ».
     - **Retiré** (rouge) : « Son accès à l'agence, ses N permissions et ses sessions en cours (déconnexion immédiate) ».
     - **Conservé** (vert) : « Ses messages dans les discussions » ; « Son compte, désactivé : vous pourrez le réinviter ».
   - Confirmation « Retirer de l'équipe » (rouge). Elle appelle `DELETE team/remove-member`, puis recharge la liste.
2. **Renvoyer une invitation** : action « Renvoyer » (`resend_invitation`), disponible pour une invitation en attente.
   - Impact en orange : « Un nouveau mot de passe temporaire sera envoyé à X ; l'ancien ne fonctionnera plus » ; « L'invitation reste valable 7 jours à partir d'aujourd'hui ».
   - Elle appelle `POST invite/resend-invitation`.
3. **Annuler une invitation** : l'ancienne confirmation est remplacée par le dialogue d'impact, à partir des données de la ligne.
   - Rouge : « Le lien envoyé à X ne fonctionnera plus ».
   - Vert : « La place réservée sur votre plan est libérée » ; « Vous pourrez réinviter cette adresse ».
4. **Réinvitation** : les refus du backend (`USER_NOT_INVITABLE`, `INVITATION_ALREADY_PENDING`) s'affichent avec leur message, via le toast global existant.

## Store
- Routes :
  - `TEAM.REMOVE_MEMBER` (DELETE) ;
  - `TEAM.MEMBER_IMPACT` (GET) ;
  - `INVITATION.RESEND_INVITATION` (POST, `inviteId` en query).
- Services et requêtes. La requête d'impact utilise `ENTITY_QUERY_OPTIONS`.

## Design (skill `frontend-ui-engineering`)
- `ActionImpactDialog`, avec trois constructeurs purs : `memberRemovalImpact`, `invitationResendImpact` et `invitationCancelImpact`.
- Nouvelle action de tableau `resend`, d'icône « envoyer », avec un titre explicite.
- L'action « Retirer » reprend l'action `delete` avec le titre « Retirer de l'équipe ».

## Tests
- **Vitest** : les trois constructeurs (pluriels, zéros masqués, e-mail cité).
- **Jest (backend)** : `getMemberImpact`, qui refuse les non-owners et compte les visites et tickets.
- **Test manuel** : retirer un membre qui a des visites à venir ; renvoyer une invitation, puis se connecter avec le nouveau mot de passe ; annuler une invitation.

## Limites
- **Toujours** : les actions sur l'équipe restent réservées à l'owner côté backend. On montre l'impact avant d'agir.
- **Jamais** : supprimer le compte d'un membre (il est seulement désactivé), ni exposer ses sessions.
