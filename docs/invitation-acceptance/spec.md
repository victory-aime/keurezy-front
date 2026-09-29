# Spec : `invitation-acceptance`

> Découle de [`study.md`](study.md), **option B** : aperçu de l'invitation, puis code par e-mail et mot de passe choisi par l'invité. Web et backend. Si l'option A est retenue, seules les tâches T1 et T6 du [`todo.md`](todo.md) s'appliquent.

## Objectif
Accepter une invitation doit être une **action volontaire de l'invité**, qui prouve qu'il possède l'adresse e-mail. Le compte est créé vérifié, avec le mot de passe qu'il choisit. Plus aucun mot de passe temporaire n'existe.

## Parcours
1. L'invité ouvre le lien `/invitations/accept?token=…`, et voit **l'aperçu** : agence (logo, nom), qui l'invite, rôle, permissions, e-mail masqué, date d'expiration. **Rien n'est modifié à l'ouverture.**
2. Il clique sur « Recevoir mon code » : un code à 6 chiffres part à l'e-mail invité.
3. Il saisit le code, choisit et confirme son mot de passe, puis valide.
4. Le compte est créé ou réactivé, l'e-mail est vérifié et la session est ouverte. L'écran de succès s'affiche, puis le dashboard.

## Critères d'acceptation
1. L'ouverture du lien (GET), même répétée ou faite par un scanner, **ne consomme pas** l'invitation.
2. L'API ne renvoie jamais de mot de passe. `Invitation.temporaryPassword` n'est plus ni écrit ni lu, puis la colonne est supprimée (contraction).
3. Code : 6 chiffres, validité `OTP_SETTINGS`, 5 essais, délai entre deux envois `OTP_SETTINGS.resendCooldown`. Au-delà des essais, il faut redemander un code.
4. Le mot de passe respecte les règles existantes (`passwordValidations` côté web, `PASSWORD_REGEX` ou l'équivalent côté backend).
5. Acceptation atomique : si une étape échoue, **ni** compte, **ni** Staff, **ni** changement de statut.
6. Après l'acceptation, `emailVerified = true` : pas de bandeau « e-mail non vérifié », pas de second e-mail.
7. Un ancien membre retiré puis réinvité retrouve son compte (même `userId`), avec le nouveau mot de passe choisi.
8. États d'erreur explicites, chacun avec un seul appel à l'action :
   - expirée ;
   - déjà utilisée ou annulée ;
   - introuvable ;
   - code invalide (essais restants) ;
   - trop d'essais.
9. L'e-mail d'invitation ne contient plus que le lien.

## API [back]
| Méthode | Route | Corps / query | Réponse |
|---|---|---|---|
| GET | `unsecured/invite/preview` | `?token` | `{ agency: { name, logo }, invitedBy, role, permissions: string[], maskedEmail, expiresAt }` |
| POST | `unsecured/invite/send-code` | `{ token }` | `{ expiresIn, retryIn }` |
| POST | `unsecured/invite/accept-invitation` | `{ token, code, password }` | `{ message }`, avec le cookie de session posé |

- La route `accept-invitation` change de contrat : elle **exige** désormais le code et le mot de passe. Le web sera livré en même temps.
- Création et renvoi d'invitation : le champ `temporaryPassword` du DTO est retiré. Le renvoi ne génère plus de mot de passe : il prolonge l'invitation de 7 jours et renvoie le lien.

## Design (skill `frontend-ui-engineering`)
- L'écran reprend `AuthBoxContainer` (même cadre que la connexion), avec 3 états :
  - aperçu ;
  - code et mot de passe (`FormOtpInput`, `FormTextInput` de type password, `PasswordIndicator`, « Renvoyer le code » avec compte à rebours) ;
  - succès (écran de confettis existant).
- Aperçu : le logo de l'agence en avatar, la phrase « **{invitedBy}** vous invite à rejoindre **{agence}** en tant que **{rôle}** », les permissions en tags, puis « Expire le … ».
- Accessibilité : focus sur la première case du code à l'étape 2, erreurs annoncées (`aria-live`), boutons avec libellé.

## Sécurité
- Les routes publiques sont limitées en débit (throttler) : `send-code` à 3 appels par minute et par jeton, `accept-invitation` à 10 par minute.
- Réponses d'erreur neutres : on ne révèle pas si l'e-mail a déjà un compte.
- Le code est lié à l'invitation (`identifier = invitation-<id>`), pas seulement à l'e-mail.

## Hors périmètre
- Mobile : il n'y a pas d'invitation staff sur mobile.
- Le modèle de l'e-mail d'invitation est hébergé chez Resend. Retirer la variable `password` est une **action manuelle** dans le tableau de bord Resend, décrite dans le plan.
