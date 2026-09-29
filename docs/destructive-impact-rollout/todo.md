# Tâches : `destructive-impact-rollout`

Vérification commune à chaque tâche :
- **web** : `pnpm exec tsc --noEmit`, `pnpm test` et `pnpm build` ;
- **[back]** : `pnpm test` et `pnpm build`, puis mise à jour de `CHANGES.md` ;
- un commit local après ton test manuel.

## T1 [back] : correctifs d'intégrité
- [ ] `visits.service.ts` `cancelVisit` : le destinataire est `visit.agent?.userId`, au lieu du Staff.id.
- [ ] `team.service.ts` `enableOrDisabledAccount` : à la désactivation, `session.deleteMany({ userId })` dans la transaction.
- [ ] `agency.service.ts` `closeAgency` : les membres passent à `isActive=false` et `User.status=INACTIVE`, et leurs sessions ainsi que celle de l'owner sont supprimées.
- [ ] `property.service.ts` liste publique : `agency: { status: { not: CLOSE } }`.
- **Tests** :
  - l'agent reçoit la notification d'annulation ;
  - un membre désactivé n'a plus de session ;
  - une agence fermée n'apparaît plus dans la liste publique.
- **Taille** : M.

## T2 [back] : `GET agency/close-impact`
- [ ] Owner uniquement. Renvoie :
  ```text
  { members: { active },
    properties: { total, online },
    bookings: { upcoming, pending },
    subscription: { plan, currentPeriodEnd } }
  ```
- [ ] Route dans `api.ts`, avec `@RequirePermission` (owner, via `agencyAccessControl`).
- **Test** : les comptes sont justes ; un staff reçoit un 403.
- **Taille** : S.

## T3 : suppression d'annonce
- [ ] `annonceDeleteImpact(annonce, propertyImpact)` dans `impact.ts`, avec ses tests.
- [ ] `DeleteAnnonce` → `ActionImpactDialog`. `property/impact` est chargé à l'ouverture.
- [ ] Alternative « Dépublier plutôt » (annonce ACTIVE et permission `publish_property`), qui appelle `updateAnnonceMutation` avec `status: INACTIVE`.
- **Taille** : S.

## T4 : annulation de visite
- [ ] `visitCancelImpact(visit)`, avec ses tests : planifiée, confirmée, et effectuée (bloquée).
- [ ] `VisitsList` : `DeleteModalAnimation` → `ActionImpactDialog`.
- **Taille** : S.

## T5 : désactivation d'un membre
- [ ] `memberDisableImpact(impact)`, avec ses tests.
- [ ] `TeamList` : l'interrupteur vers OFF ouvre le dialogue, qui charge `member-impact`. L'interrupteur vers ON réactive directement.
- [ ] L'interrupteur reflète l'état serveur tant que la désactivation n'est pas confirmée.
- **Taille** : S.

## Checkpoint : ton test manuel (annonce, visite, membre)

## T6 : fermeture d'agence et « Supprimer mon compte »
- [ ] `AgencyModule.getCloseImpactQueries`, les types `IAgencyCloseImpact` et `agencyCloseImpact(impact)`, avec ses tests.
- [ ] `AgencyInfo` : `BaseModal` → `ActionImpactDialog`, avec confirmation par saisie du nom de l'agence (`confirmDisabled`).
- [ ] `Settings` (Sécurité) :
  - owner : « Supprimer mon compte » mène à `/dashboard/agency#close` ;
  - staff : le bouton est masqué ;
  - `DisabledAccount` est supprimé s'il n'a plus d'usage.
- **Taille** : M.

## T7 : « Fermer les autres sessions »
- [ ] `authClient.listSessions()` : l'impact affiche N autres sessions (appareil et date).
- [ ] Le callback appelle `authClient.revokeOtherSessions()`. On retire le code en commentaire.
- **Taille** : S.

## T8 : audit de sécurité et documentation
- [ ] `security-audit.md` (skill `security-and-hardening`), `CHANGES.md` du backend, et mise à jour de la carte `capability-map.md`.
