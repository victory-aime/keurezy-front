# Tâches : `account-recovery`

Vérification commune à chaque tâche :
- **web** : `tsc`, `pnpm test` et `pnpm build` ;
- **[back]** : `pnpm test`, `pnpm build` et `CHANGES.md`.

- [x] T1 [back] : migration `12_account_recovery`, appliquée en dev.
- [x] T2 [back] : `config/one-time-code.ts`, qui remplace `invitation-code.ts`.
- [x] T3 [back] : `AccountRecoveryService` (request, confirm, cancel, cron) et annulation par le hook de session.
- [x] T4 [back] : `team/reset-two-factor` et l'e-mail au membre.
- [x] T5 [back] : `users/backup-codes/remaining`.
- [x] T6 web : Sécurité (codes restants, régénération, suggestion de passkey).
- [x] T7 web : Équipe (« Réinitialiser la 2FA », avec son impact).
- [x] T8 web : `/auth/two-factor-recovery` (étapes 1 et 2, confirmation), `/auth/two-factor-recovery/cancel`, et le lien depuis l'écran 2FA.
- [x] T9 : modèles Resend en `.md` et inventaire dans `README.md`.
- [x] T10 : `security-audit.md`.
