# Tâches : `agency-permissions-ui`

- [x] **T1. Vitest et `canAccess`.**
  - Dépendance de dev `vitest`, script `test`.
  - `src/utils/permissions.ts` et `permissions.test.ts`.
  - `usePermissions` appelle `canAccess`.
  - **Vérifier** : `npx vitest run` et `npx tsc --noEmit`.
- [x] **T2. `AppPermissions` aligné sur le seed.**
  - Retrait de `LEADS`.
  - Ajout de `LAND`, `BUILDING`, `VISITS` et `INVITATIONS`, plus `PUBLISH` et `UNPUBLISH`.
  - **Vérifier** : typecheck.
- [x] **T3. Sidebar.** Permissions sur Terrains, Bâtiments, Annonces, Rendez-vous, Invitations et Équipe.
- [x] **T4. Listes.**
  - Boutons « Ajouter » masqués sans la permission de création.
  - Actions de ligne désactivées sans la permission.
  - **Vérifier** : typecheck et build.

### Point de contrôle
- [x] Revue (`code-review-and-quality`) et audit de sécurité (`security-and-hardening`).
- [ ] Ton test manuel en owner, puis en staff limité.
- [ ] Commit local.
