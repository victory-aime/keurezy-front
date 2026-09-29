# Plan : `auth-flow-audit`

Spec : [`spec.md`](spec.md). Tâches : [`todo.md`](todo.md). Audit : [`audit.md`](audit.md).

## Décisions d'architecture
- **API Better Auth native, aucun endpoint maison** :
  - activation : `twoFactor.enable` renvoie le `totpURI`, puis `twoFactor.verifyTotp` valide le premier code et **active** la 2FA (une fois `skipVerificationOnEnable` retiré) ;
  - connexion : `twoFactor.verifyBackupCode({ code, trustDevice })`. Better Auth marque le code comme utilisé.
- **`useTotp`** reste le seul point d'accès : on y ajoute `verifyBackupCode`, avec le même format de retour que `verifyTotp`.
- **Pas de bascule de fonctionnalité** : le backend (`skipVerificationOnEnable: false`) et le web (étape de vérification) partent ensemble. Les comptes déjà en 2FA ne changent pas.
- **Mot de passe oublié** : on retire simplement la validation asynchrone. `checkEmailMutation` reste disponible pour l'inscription.

## Risques
| Risque | Impact | Mitigation |
|---|---|---|
| Un utilisateur a démarré l'activation avec l'ancien web, puis le backend change | Faible | `enable` ne l'active plus. Il refait l'activation, sans blocage. |
| Codes de secours perdus **et** téléphone perdu | Moyen | Hors de ce chantier : réinitialisation de la 2FA par le support ou l'owner, à spécifier plus tard si besoin. |
| La correction S1 masque une vraie erreur de passkey | Faible | Seuls `AbortError` et `NotAllowedError` sont ignorés, et uniquement en mode remplissage automatique. Le clic sur « passkey » garde ses erreurs. |

## Ordre
T1 (2FA : activation vérifiée) → T2 (codes de secours) → *checkpoint : ton test* → T3 (mot de passe oublié) → T4 (connexion et points B) → T5 (audit).
