# Audit de sécurité : `auth-flow-audit`

> Réalisé le 30/09 (skill `security-and-hardening`). Revue des constats de [`audit.md`](audit.md) après leur correction, sur le web et le backend.

## Modèle de menace (résumé)
- **Frontières de confiance** :
  - formulaires publics : connexion, mot de passe oublié, renvoi du lien de vérification ;
  - lien de réinitialisation, qui porte un jeton ;
  - codes TOTP et codes de secours.
- **Actifs** : l'accès au compte (owner et staff), et la liste des e-mails inscrits.
- **STRIDE retenu** :
  - usurpation : 2FA contournée ou compte bloqué ;
  - divulgation d'information : énumération des comptes ;
  - déni de service : force brute sur les codes.

## Constats de l'audit : état
| # | Statut | Vérification |
|---|---|---|
| T1 codes de secours inutilisables | **Corrigé** | `verifyBackupCode` de Better Auth : un code est invalidé après usage. Testé manuellement (réutilisation refusée). |
| T2 2FA active sans vérification | **Corrigé** | `skipVerificationOnEnable` retiré. La 2FA ne s'active qu'avec un premier code valide. Testé manuellement. |
| (nouveau) colonnes 2FA manquantes | **Corrigé** | Migration `10_two_factor_lockout`. Sans elle, l'activation échouait et le **verrouillage après codes faux** de Better Auth 1.6.33 ne pouvait pas fonctionner. |
| R1 énumération au mot de passe oublié | **Corrigé** | La vérification d'existence du compte est retirée du schéma de validation, et donc des deux formulaires qui l'utilisaient (mot de passe oublié, renvoi du lien de vérification). |
| (nouveau) énumération au renvoi du lien de vérification | **Corrigé** | Le backend répondait « Email déjà vérifié » (400) et un message différent en cas de succès. Il répond désormais pareil dans les 3 cas, test Jest à l'appui. |
| R2 double envoi à la réinitialisation | **Corrigé** | `isPending`, et le bouton est désactivé pendant l'envoi. |
| R3 pas de retour après réinitialisation | **Corrigé** | Écran de succès, qui mentionne la fermeture des autres sessions (`revokeSessionsOnPasswordReset`). Un jeton refusé mène à « Recevoir un nouveau lien ». |
| S1 toast passkey au chargement | **Corrigé** | La disponibilité est attendue (`await`). Les annulations (`Abort`, `NotAllowed`) sont ignorées en mode suggestion automatique. |
| S2 et S3 double erreur, `console.error` | **Corrigé** | Un seul chemin d'erreur. `console.error` est retiré de `SignIn`. |
| T3 et T4 | **Corrigé** | Cases vidées et focus remis sur la première après une erreur ; coquille corrigée. |

## Points résiduels (acceptés, avec la raison)
- **`verified-email` reste public** : l'inscription d'une agence l'utilise pour signaler un e-mail déjà pris. **Décision du 30/09 : on le garde public**, à rediscuter plus tard.
- **Limitation de débit** : traitée par le chantier backend [`api-rate-limiting`](../../../keurezy-backend/docs/api-rate-limiting/spec.md). L'IP n'est plus falsifiable, avec trois niveaux de limite et un limiteur Better Auth sur la 2FA. Les compteurs restent en mémoire : prévoir Redis au-delà d'une instance.
- **Téléphone et codes de secours perdus tous les deux** : les pistes sont notées dans [`account-recovery/study.md`](../account-recovery/study.md) (chantier futur).
- **Réinitialisation** : toute erreur de Better Auth est présentée comme « lien expiré ». C'est volontairement générique : on ne révèle rien sur le jeton.

## Vérifications
- Aucun secret ajouté, et aucune donnée sensible journalisée : les codes et mots de passe ne passent jamais par les logs.
- Tests : 30 web (Vitest) et 186 backend (Jest), avec le build web et le build backend.
