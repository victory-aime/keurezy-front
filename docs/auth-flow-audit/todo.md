# Tâches : `auth-flow-audit`

Vérification commune à chaque tâche :
- **web** : `pnpm exec tsc --noEmit`, `pnpm test` et `pnpm build` ;
- **[back]** : `pnpm test` et `pnpm build` ;
- un commit local après ton test manuel.

## T1 : activation 2FA vérifiée (audit T2) [back et web]
- [x] [back] `lib/auth.ts` : retirer `skipVerificationOnEnable: true`, puis mettre à jour `CHANGES.md`.
- [x] `TotpQrCode` : étape « Saisissez le code », avec `FormOtpInput`, qui appelle `verifyTotp`. En cas de succès, fermeture de la modale, toast « 2FA activée » et rechargement des infos utilisateur. En cas d'échec, message dans le champ.
- [x] `Settings` : l'interrupteur 2FA ne passe à ON qu'après la vérification.
- **Taille** : S.

## T2 : connexion par code de secours (audit T1)
- [x] `useTotp.verifyBackupCode(code, trustDevice)`.
- [x] `TotpVerification` : basculer entre « Code de l'application » et « Code de secours » ; vider les cases et remettre le focus après une erreur (T3) ; corriger la coquille (T4).
- [x] Fonction pure `totpErrorMessage(status)`, avec son test Vitest (400/401 → code invalide, 500 → serveur).
- **Taille** : S.

## Checkpoint : ton test (activation avec un mauvais puis un bon code ; connexion par code de secours, puis réutilisation refusée)

## T3 : mot de passe oublié (audit R1 à R3)
- [x] `ForgetPassInitRequest` : retirer la validation asynchrone `checkEmail` ; garder la validation du format.
- [x] `ForgetPassword` : `isPending` ; écran de succès ; en cas d'erreur `INVALID_RESET_TOKEN`, afficher `TokenExpired` avec un lien vers `forget-pass/request`.
- **Taille** : S.

## T4 : connexion (audit S1 à S3)
- [x] Remplissage automatique par passkey : `await isConditionalMediationAvailable()`, et ignorer `AbortError`/`NotAllowedError`.
- [x] Clic sur passkey : un seul chemin d'erreur ; suppression du `console.error`.
- **Taille** : XS.

## T5 : audit de sécurité
- [x] `security-audit.md` (skill `security-and-hardening`) : vérifier que chaque constat de `audit.md` est fermé ou justifié.
