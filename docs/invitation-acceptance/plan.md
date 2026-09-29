# Plan : `invitation-acceptance`

Spec : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md). Étude : [`study.md`](study.md).

## Décisions d'architecture
- **Code d'invitation stocké dans `Verification`**, la table Better Auth déjà utilisée pour les OTP. On ne crée pas de nouvelle table.
  - `identifier = invitation-<id>`, `value = hash(code):essais`, `expiresAt`.
  - Le code est haché (SHA-256), jamais stocké en clair.
  - Le plugin `emailOTP` ne peut pas servir tel quel : il est lié aux types `sign-in`, `email-verification` et `forget-password`, et à un utilisateur existant (`disableSignUp: true`). L'invité n'a pas encore de compte.
  - L'e-mail réutilise `authEmailBridge.sendOTP` avec un nouveau type `invitation` (modèle `otp.hbs`).
- **Création du compte dans la transaction.** On remplace `auth.api.signUpEmail`, qui s'exécute hors transaction, par :
  - `tx.user.create` (avec `emailVerified: true`) ;
  - `tx.account.create({ providerId: 'credential', password: await ctx.password.hash(pwd) })`.
  - C'est le même hachage que celui déjà utilisé pour la réactivation (`auth.$context.password`).
- **Session ouverte après la transaction** par `auth.api.signInEmail({ body, headers, asResponse })`. Le contrôleur relaie le cookie `Set-Cookie`. Le front n'a plus besoin du mot de passe.
- **Migration en deux temps** :
  - *expand* : le code n'utilise plus `temporaryPassword`, et la colonne reste nullable ;
  - *contract* : la migration `11_drop_invitation_temp_password` supprime la colonne, après le déploiement et l'expiration des invitations en cours (7 jours).
- **Invitations en attente au moment du déploiement** : elles restent valides. Le nouveau parcours ignore leur mot de passe temporaire.

## Risques
| Risque | Impact | Mitigation |
|---|---|---|
| Changement de contrat de `accept-invitation` : un ancien web appellerait sans code | Moyen | Le backend et le web sont déployés ensemble. Un ancien client reçoit un 400 explicite. |
| Modèle Resend qui affiche encore `{{password}}` | Faible | Variable vide. Action manuelle : retirer le bloc « mot de passe » dans Resend avant le déploiement. |
| `signInEmail` échoue après une transaction réussie | Faible | Le compte est créé et l'invitation acceptée : le front renvoie vers la connexion, avec l'e-mail prérempli. |
| Force brute sur le code | Faible | 5 essais par code, limite de débit sur les routes, et un code lié à l'invitation. |

## Ordre
T1 (web : double appel, filet immédiat) → T2 à T4 (backend) → *checkpoint : tests Jest et curl* → T5 (web, écran) → *checkpoint : ton test manuel* → T6 (nettoyage, audit) → T7 (contraction, plus tard).
