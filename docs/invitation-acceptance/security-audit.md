# Audit de sécurité : `invitation-acceptance` (option B)

> Réalisé le 30/09 (skill `security-and-hardening`), sur le web et le backend.

## Modèle de menace (résumé)
- **Frontière** : trois routes publiques (aperçu, envoi du code, acceptation), accessibles à qui possède le jeton du lien.
- **Actifs** : l'accès à l'agence (compte Staff et permissions), et l'adresse e-mail de l'invité.
- **Menaces** :
  - usurpation : un lien transféré ou divulgué ;
  - force brute : sur le code ;
  - divulgation : mot de passe dans une réponse, e-mail exposé ;
  - déni de service : envoi massif de codes.

## Contrôles
| Point | Vérification |
|---|---|
| Lien ouvert par un tiers ou un scanner | L'aperçu est en **lecture seule** : il ne consomme rien. L'acceptation exige le code envoyé à l'adresse invitée, donc la possession de la boîte. |
| Secrets | **Plus de mot de passe temporaire** : ni généré dans le navigateur, ni stocké, ni envoyé par e-mail, ni renvoyé par l'API. La réponse d'acceptation ne contient que l'e-mail. Le mot de passe choisi est haché avec l'algorithme de Better Auth. |
| Code | 6 chiffres issus de `crypto.randomInt`, **stockés hachés** (SHA-256) et liés à l'invitation (`invitation-<id>`). Comparaison en temps constant, 5 essais, puis suppression. Validité `OTP_SETTINGS`, usage unique. |
| Débit | `@Throttle(SENSITIVE_THROTTLE)` à 5 par minute et par IP sur `send-code` et `accept-invitation`, avec l'IP résolue non falsifiable (`api-rate-limiting`). Délai minimal entre deux envois de code (`INVITATION_CODE_TOO_SOON`). |
| Données exposées | L'aperçu masque l'e-mail (`v*****y@gmail.com`) et ne montre que ce que l'invité doit valider : agence, rôle, permissions, expiration. |
| Validation | Mot de passe d'au moins 12 caractères, avec majuscule, minuscule et chiffre, vérifié **côté backend** (DTO) et pas seulement dans le formulaire. Code au format `^\d{6}$`. |
| Atomicité | Compte, compte d'identification, Staff, permissions et statut de l'invitation sont écrits dans **une seule transaction**. L'appel à `signUpEmail` hors transaction a disparu. |
| Comptes désactivés | La réactivation passe `status` à ACTIVE dans la même transaction. Le hook de session (chantier `destructive-impact-rollout`) laisse ensuite la connexion passer. |

## Points résiduels
- **Colonne `temporaryPassword`** : les valeurs héritées sont effacées à l'acceptation ou à l'annulation. La colonne sera supprimée par `12_drop_invitation_temp_password`, au moins 7 jours après le déploiement.
- **Modèle Resend** : la variable du mot de passe n'est plus envoyée ; le texte du modèle est à mettre à jour manuellement.
- **Message d'erreur du code** : il indique le nombre d'essais restants. C'est acceptable, car le code est lié à une invitation précise et limité à 5 essais.

## Vérifications
- Tests : 47 web (Vitest, dont les états d'erreur de l'invitation) et 205 backend (Jest : aperçu sans écriture, code haché, renvoi trop rapproché, essais décomptés puis blocage, compte vérifié sans secret renvoyé, réactivation avec le même `userId`). Les builds web et backend passent.
