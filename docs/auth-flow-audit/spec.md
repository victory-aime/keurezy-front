# Spec : `auth-flow-audit`

> Corrige les constats de [`audit.md`](audit.md) : mot de passe oublié et réinitialisation, connexion, et 2FA. Les numéros (T1, R1…) renvoient à l'audit.

## Objectif
Aucun compte ne doit pouvoir être **bloqué définitivement** par la 2FA, et le parcours « mot de passe oublié » ne doit **rien révéler** sur l'existence d'un compte.

## Critères d'acceptation

### 2FA
1. **T2** : activer la 2FA suit trois étapes : mot de passe, puis QR code et codes de secours, puis **saisie d'un premier code**. La 2FA n'est active qu'après ce premier code valide. Si l'utilisateur ferme la fenêtre avant, la 2FA reste désactivée.
2. **T1** : sur l'écran de vérification à la connexion, le lien « Utiliser un code de secours » bascule vers un champ texte. Un code de secours valide connecte l'utilisateur et **ne peut plus resservir**. Un lien retour permet de revenir au code de l'application.
3. **T3** : un code invalide vide les 6 cases et remet le focus sur la première.
4. **T4** : le texte d'aide est corrigé.

### Mot de passe oublié et réinitialisation
5. **R1** : le formulaire n'appelle plus `verified-email`. Un e-mail inconnu affiche **le même écran** « Presque terminé » qu'un e-mail connu.
6. **R2** : le bouton de réinitialisation affiche le chargement et ne peut pas être envoyé deux fois.
7. **R3** : une réinitialisation réussie affiche un écran de succès (« Mot de passe modifié »), avec le bouton « Se connecter ». Un lien expiré ou invalide affiche l'état `TokenExpired`, avec le bouton « Recevoir un nouveau lien ».

### Connexion
8. **S1** : sans passkey enregistrée, ou quand l'utilisateur ignore la suggestion du navigateur, **aucun toast** ne s'affiche au chargement.
9. **S2 et S3** : une seule erreur affichée par échec, et aucun `console.error` en production.

## Design (skill `frontend-ui-engineering`)
- Code de secours : un lien discret sous les cases du code (`variant="plain"`), puis un `FormTextInput` avec l'aide « Format : xxxxx-xxxxx » et l'autocomplétion `one-time-code`.
- Activation 2FA : la modale du QR code ajoute l'étape « Saisissez le code affiché par l'application », avec `FormOtpInput`. Le bouton « J'ai terminé » est remplacé par « Vérifier et activer ».
- Les écrans de succès et d'erreur réutilisent `AnimatedCheckmark`, `TokenExpired` et `AuthBoxContainer`.

## Hors périmètre
- La limite de débit spécifique à `verified-email` à l'inscription : le throttler global suffit pour l'instant.
- Le passage du mot de passe oublié par code OTP sur le web (le mobile l'utilise déjà) : le lien est conservé.
