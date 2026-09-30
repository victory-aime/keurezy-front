# Plan : `account-recovery`

Spec : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md).

## Décisions d'architecture
- **Code à usage unique partagé** : `invitation-code.ts` devient `config/one-time-code.ts` (génération, empreinte, comparaison en temps constant, masquage d'e-mail). Il sert à l'invitation et à la récupération. Pas de nouvelle table : les codes sont stockés dans `verification`, sous `recovery-<userId>`.
- **Demande de récupération** : nouvelle table `account_recovery_request` (migration additive `12_account_recovery`). Elle porte `userId`, `status` (PENDING, CANCELLED, COMPLETED), `executeAt` et l'empreinte du jeton d'annulation (unique).
- **Service `AccountRecoveryService`** dans le module auth, avec des routes publiques dans `AuthController`. Le cron horaire vit dans ce même service.
- **Annulation automatique** : dans le hook Better Auth `session.create.after`, déjà utilisé pour bloquer les comptes désactivés. Toute session créée pour un compte 2FA prouve que l'utilisateur a encore accès à son compte.
- **E-mails** : `ResendService.sendTemplateEmail` ignore désormais un modèle non configuré (avertissement au lieu d'une erreur), comme le faisait déjà `BOOKING_STATUS`.
- **Réinitialisation par l'owner** : `TeamService.resetMemberTwoFactor`, construit sur le même modèle que le retrait d'un membre (`OWNER_ONLY`, membre de l'agence, transaction).

## Ordre
Migration → code partagé → C (backend) → B (backend) → A (backend) → web (A, B, C) → modèles `.md` → audit.
