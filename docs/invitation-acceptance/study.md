# Étude : `invitation-acceptance`

> Web (`/invitations/accept`) et backend (`invitations`). Statut : **étude à valider** avant la spec.

## 1. Constats

### Erreur affichée avant le succès (cause racine)
`AcceptInvitation.tsx` appelle la mutation `invitation/accept` **dans un `useEffect` au chargement de la page** :
- En développement, React StrictMode exécute l'effet deux fois. Deux acceptations partent : l'une réussit, l'autre échoue avec `INVITATION_ALREADY_USED_OR_CANCELLED`. Selon l'ordre des réponses, l'écran d'erreur s'affiche puis le succès, ou l'inverse.
- En production, le même problème se produit dès qu'un **scanner de liens** ouvre l'URL : c'est le cas d'Outlook SafeLinks, de Gmail et des antivirus. Le scanner **consomme l'invitation** avant l'invité, qui tombe alors sur « invitation invalide ». Une page ouverte par un simple GET ne doit jamais modifier de données.

### E-mail de vérification après l'acceptation
- Le compte est créé par `signUpEmail` avec `emailVerified = false`.
- Le dashboard affiche alors le bandeau « e-mail non vérifié », et l'invité reçoit ou doit demander un second e-mail. Pourtant, avoir reçu l'invitation prouve déjà qu'il possède cette adresse.

### Mot de passe temporaire renvoyé en clair
- `acceptInvitation` renvoie `{ email, password }` : le front s'en sert pour se connecter à la place de l'invité. Quiconque possède le lien obtient donc le mot de passe.
- Le mot de passe temporaire est aussi stocké chiffré dans `Invitation` et renouvelé à chaque renvoi.

### Atomicité
`auth.api.signUpEmail` n'utilise pas la transaction `tx`. Si la création du Staff échoue ensuite, le compte User reste créé, sans agence.

## 2. Options

| | A. Correctif minimal | B. Aperçu, puis OTP et mot de passe choisi (**recommandée**) |
|---|---|---|
| Page d'invitation | Accepte toujours au chargement, protégée par un `useRef` contre le double appel | **Lecture seule** : l'agence (nom, logo), qui invite, le rôle, les permissions résumées, l'e-mail masqué et l'expiration |
| Validation | Aucune | L'invité clique sur « Recevoir mon code » : un code à 6 chiffres est envoyé à l'e-mail invité. Il saisit ce code et **choisit son mot de passe** |
| E-mail vérifié | `emailVerified = true` posé à l'acceptation | `emailVerified = true` : le code prouve la possession de la boîte |
| Scanners de liens | Consomment toujours l'invitation | Sans effet : le GET ne modifie rien |
| Mot de passe temporaire | Toujours renvoyé en clair | **Supprimé** : ni stockage, ni envoi, ni renvoi |
| Coût | Environ 1 h, front uniquement | 2 endpoints, 1 écran, puis une migration de contraction de `temporaryPassword` |

Le lien seul prouve déjà l'accès à la boîte mail. Le code ajoute deux protections :
- un lien **transféré ou divulgué** ne suffit plus ;
- l'acceptation devient une action volontaire.

## 3. Conception de l'option B

### Backend (module `invitations`)
- `GET unsecured/invitation/preview?token=`
  - Rôle : lecture seule.
  - Renvoie : `{ agency: { name, logo }, invitedBy, role, permissions: string[], email (masqué), expiresAt, status }`.
  - Erreurs, sans détail exploitable : `INVITATION_EXPIRED`, `INVITATION_ALREADY_USED_OR_CANCELLED`, `INVITATION_NOT_FOUND`.
- `POST unsecured/invitation/send-code { token }`
  - Envoie un code via le plugin `emailOTP` existant, avec pour identifiant `invitation-<id>` : 6 chiffres, validité `OTP_SETTINGS`, 5 essais, délai entre deux envois.
  - Protégé par le throttler.
- `POST unsecured/invitation/accept { token, code, password }` :
  - vérifie le code ;
  - valide le mot de passe avec la règle de complexité existante ;
  - dans une transaction : crée ou réactive le compte avec `emailVerified = true` et le mot de passe choisi, crée le Staff et les permissions encore couvertes par le plan, et passe l'invitation à ACCEPTED ;
  - ouvre la session (cookie Better Auth) et ne renvoie **aucun** secret.
- Création de l'invitation et renvoi : plus de mot de passe temporaire. `temporaryPassword` est d'abord ignoré (expand), puis supprimé par une migration de contraction.
- L'e-mail d'invitation contient seulement le lien.

### Web : écran `/invitations/accept`
1. **Aperçu** : une carte avec le logo et le nom de l'agence, « {invitedBy} vous invite comme {rôle} », les permissions en puces, l'e-mail masqué et « expire le … ». Bouton principal : « Recevoir mon code ».
2. **Code et mot de passe** : `FormOtpInput` (6 cases), le mot de passe et sa confirmation avec `PasswordIndicator`, et un bouton « Renvoyer le code » avec compte à rebours.
3. **Succès** : l'écran de confettis existant, puis la redirection vers le dashboard, déjà connecté.
4. **États** : expirée, déjà utilisée ou annulée, introuvable. Chaque état propose un message et un seul appel à l'action (« Contactez votre agence »).

### Mobile
Les invitations ne concernent que le staff (dashboard web). Le mobile n'est pas concerné.

## 4. Sécurité
- Aucun secret dans les réponses ni dans les URL, hormis le jeton d'invitation, qui est à usage unique et expirant.
- Les limites d'essais et de délai sont appliquées côté serveur. L'e-mail est masqué dans l'aperçu (`v***@gmail.com`).
- L'acceptation se fait en une seule transaction, et la création du compte ne passe plus par `signUpEmail` hors transaction.

## 5. Décision attendue
Option **A** ou **B**. Si B est validée, la spec et le plan suivront dans ce dossier, avec la migration en deux temps.
