# Audit : `auth-flow-audit` (web)

> Périmètre : connexion (mot de passe, passkey), mot de passe oublié et réinitialisation, et 2FA TOTP. Revue du code web, de `proxy.ts` et du backend (`auth.service.ts`, `lib/auth.ts`), réalisée le 29/09 (skill `security-and-hardening`).
> Gravité : **H** haute, **M** moyenne, **B** basse.

## Constats

### Mot de passe oublié et réinitialisation
| # | Grav. | Constat | Correctif proposé |
|---|---|---|---|
| R1 | **H** | **Énumération des comptes** : `ForgetPassInitRequest` interroge `POST unsecured/auth/verified-email` à la validation du formulaire et affiche une erreur si l'e-mail n'existe pas. Le backend répond pourtant « Si ce compte existe… », mais la protection est contournée par le front. | Retirer la pré-vérification du formulaire de mot de passe oublié. L'écran « Presque terminé » s'affiche toujours. Garder `verified-email` pour l'inscription seulement, avec une limite de débit dédiée. |
| R2 | M | `ForgetPassword` lit `isPaused` au lieu de `isPending` : le bouton ne montre jamais le chargement, et un double envoi est possible. | `isPending`. |
| R3 | M | Réinitialisation réussie : redirection au bout de 2 s, sans écran de confirmation. Un jeton expiré ou invalide ne produit qu'un toast, et le formulaire reste affiché. | Afficher l'écran de succès existant, puis un état « Lien expiré » avec « Renvoyer un lien » (on réutilise `TokenExpired`). |
| R4 | B | La page `forget-pass/validate` passe `token!` sans le valider. `proxy.ts` redirige bien l'absence de jeton, mais seulement si la route correspond. | Correct, à garder. Pas de changement. |

### Connexion
| # | Grav. | Constat | Correctif proposé |
|---|---|---|---|
| S1 | M | Remplissage automatique par passkey : `isConditionalMediationAvailable?.()` renvoie une **Promise**, jamais attendue, donc toujours vraie. Une annulation silencieuse du remplissage déclenche un toast d'erreur au chargement de la page. | `await` du résultat, et ignorer silencieusement `AbortError` et `NotAllowedError` en mode remplissage automatique. |
| S2 | B | Clic sur passkey : l'erreur est affichée deux fois, par `onError` puis par `result.error`. | Garder un seul chemin. |
| S3 | B | `handlePasswordSubmit` : un `console.error` en production. | Retirer. |

### 2FA (TOTP)
| # | Grav. | Constat | Correctif proposé |
|---|---|---|---|
| T1 | **H** | **Aucun moyen d'utiliser un code de secours à la connexion.** Les codes sont générés et téléchargeables à l'activation, mais `TotpVerification` n'accepte que le TOTP. Un téléphone perdu bloque définitivement le compte. | Ajouter un lien « Utiliser un code de secours » qui bascule vers un champ texte appelant `authClient.twoFactor.verifyBackupCode`. |
| T2 | **H** | `twoFactor({ skipVerificationOnEnable: true })` : la 2FA est active **dès l'appel `enable`**, sans vérifier que l'utilisateur a bien scanné le QR code. Un scan raté bloque le compte à la connexion suivante. | Backend : retirer `skipVerificationOnEnable`. Web : après le QR code, demander un premier code, puis appeler `verifyTotp`, ce qui active la 2FA. |
| T3 | B | Un code invalide ne vide pas les 6 cases, et le focus reste sur la dernière. | Vider et remettre le focus sur la première case. |
| T4 | B | Coquille dans la description (« d'authentification. ? »). | Corriger. |

## Points conformes
- `proxy.ts` :
  - le cookie TOTP force la page 2FA, et la page 2FA sans cookie renvoie à `/redirect` ;
  - les routes protégées vérifient la session et le rôle côté serveur.
- Backend :
  - `revokeSessionsOnPasswordReset: true`, `autoSignIn: false`, messages neutres sur `forgotPassword` ;
  - codes OTP à 5 essais ;
  - throttler global (`SessionThrottlerGuard`).
- Appareil de confiance : il passe par `trustDevice` de Better Auth, avec un cookie signé côté serveur.

## Ordre proposé
1. **T1 et T2** : risque de blocage définitif de comptes.
2. **R1** : fuite d'information.
3. S1, puis R2 et R3.
4. Les points B sont regroupés dans le même commit.

Tests :
- Vitest, sur la logique pure extraite si besoin.
- Test manuel :
  - mot de passe oublié avec un e-mail inconnu : même écran qu'avec un e-mail connu ;
  - activation 2FA avec un mauvais premier code : refusée ;
  - connexion avec un code de secours.
