# Tâches : `invitation-acceptance`

Vérification commune à chaque tâche :
- **web** : `pnpm exec tsc --noEmit`, `pnpm test` et `pnpm build` ;
- **[back]** : `pnpm test`, `pnpm build` et `CHANGES.md` ;
- un commit local après ton test manuel.

## T1 : filet immédiat, pas de double acceptation (web) — remplacé directement par T5 (plus aucun appel au chargement)
- [x] `AcceptInvitation` : garde `useRef` pour que l'effet ne lance qu'**une** acceptation, même sous StrictMode.
- [x] L'erreur ne peut plus écraser un succès déjà affiché.
- Cette tâche est remplacée par T5, mais elle corrige le symptôme tout de suite.
- **Taille** : XS.

## T2 [back] : aperçu de l'invitation
- [x] `GET unsecured/invite/preview?token`, en lecture seule. Renvoie l'agence, qui invite, le rôle, les libellés des permissions, l'e-mail masqué et l'expiration.
- [x] Erreurs : `INVITATION_NOT_FOUND`, `INVITATION_EXPIRED`, `INVITATION_ALREADY_USED_OR_CANCELLED`.
- [x] `maskEmail()` dans les utilitaires, avec son test.
- **Tests** : l'aperçu ne modifie rien ; les trois erreurs.
- **Taille** : S.

## T3 [back] : envoi et vérification du code
- [x] `POST unsecured/invite/send-code { token }` :
  - génère un code à 6 chiffres (`crypto.randomInt`) et l'écrit haché dans `Verification` (`invitation-<id>`) ;
  - applique le délai entre deux envois, et envoie l'e-mail via `authEmailBridge.sendOTP({ purpose: 'invitation' })`.
- [x] `verifyInvitationCode(invitationId, code)` : compare en temps constant, décompte les essais (5), et supprime l'entrée après usage.
- [x] Limite de débit : `@Throttle` sur `send-code` et `accept-invitation`.
- **Tests** : code juste ; code faux (essais restants) ; 6ᵉ essai refusé ; code expiré ; renvoi trop tôt.
- **Taille** : M.

## T4 [back] : acceptation atomique
- [x] `AcceptInvitationDto { token, code, password }`, avec validation du mot de passe.
- [x] Transaction :
  - `user.create` avec `emailVerified: true`, ou mise à jour d'un compte existant (mot de passe, `emailVerified`, statut) ;
  - `account` credential ;
  - Staff, permissions encore couvertes par le plan ;
  - invitation ACCEPTED.
- [x] Suppression de `signUpEmail`, du `decryptPassword` et du retour `{ email, password }`.
- [x] Session : `signInEmail` avec `asResponse`, et relais du cookie par le contrôleur.
- [x] Création et renvoi d'invitation : plus de `temporaryPassword` (DTO, service, e-mail). Le renvoi ne dépend plus de `temporaryPassword` (`invitation.service.ts:298`).
- **Tests** : une erreur dans la transaction ne laisse aucun compte créé ; un ancien membre retrouve le même `userId` ; aucune réponse ne contient de mot de passe.
- **Taille** : M.

## Checkpoint : tests Jest et scénario curl (aperçu → code → acceptation)

## T5 : écran d'acceptation (web)
- [x] Endpoints `preview`, `send-code` et `accept` dans `store/endpoints` et `InvitationModule`.
- [x] `AcceptInvitation` réécrit en 3 états (aperçu, code et mot de passe, succès), plus les états d'erreur. Aucun appel en écriture au chargement.
- [x] Fonction pure `invitationErrorState(code)`, avec son test Vitest.
- [x] `MainTeamInvite` : suppression de `generateRandomPassword` et de `temporaryPassword` ; mise à jour du type `IInvitation`.
- **Taille** : M.

## Checkpoint : ton test manuel (nouvel invité, ancien membre, lien expiré, code faux)

## T6 : nettoyage et audit
- [ ] **Manuel (toi)** : retirer la variable `password` du modèle d'e-mail d'invitation dans Resend.
- [x] `security-audit.md` (skill `security-and-hardening`) et `CHANGES.md` du backend.

## T7 [back] : contraction (au moins 7 jours après le déploiement)
- [ ] Migration `13_drop_invitation_temp_password`, et suppression de `encryptPassword`/`decryptPassword` s'ils n'ont plus d'usage.
