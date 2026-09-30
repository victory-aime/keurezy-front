# Audit de sécurité : `account-recovery`

> Réalisé le 30/09 (skill `security-and-hardening`), sur le web et le backend.

## Modèle de menace (résumé)
Un recours pour la 2FA ne doit pas devenir la porte d'entrée d'un attaquant qui connaît le mot de passe. Il doit donc être **plus lent et plus exigeant** qu'une connexion normale, et **visible** par le titulaire.

## Contrôles
| Point | Vérification |
|---|---|
| Identification | Il faut le mot de passe **et** un code envoyé à l'e-mail du compte. Le mot de passe est redemandé à l'étape 2 : la boîte mail seule ne suffit pas. |
| Énumération | Une erreur identique (`INVALID_CREDENTIALS`) pour un compte inconnu ou un mauvais mot de passe. Un hachage est aussi effectué pour un compte inconnu, afin que le temps de réponse soit comparable. |
| Délai et visibilité | 72 h avant la désactivation. E-mail immédiat avec lien d'annulation. **Toute connexion réussie annule la demande**, puisque le titulaire a encore accès à son compte. |
| Secrets | Code et jeton d'annulation stockés **hachés** (SHA-256). Code : 6 chiffres issus de `crypto.randomInt`, 5 essais, usage unique. Jeton : 32 octets aléatoires. Aucune route ne renvoie de code de secours : seul leur **nombre** sort. |
| Débit | `SENSITIVE_THROTTLE` (5 par minute et par IP résolue) sur les trois routes publiques, plus un délai minimal entre deux codes. |
| Annulation par un scanner de liens | La page d'annulation exige un clic : l'ouvrir ne fait rien. |
| Exécution | Cron horaire : suppression de la configuration 2FA, `twoFactorEnabled = false` et fermeture des sessions, en une transaction. Un e-mail invite à reconfigurer la 2FA. |
| Réinitialisation par l'owner | `OWNER_ONLY`, avec un membre obligatoirement de l'agence (`staff.findFirst` sur `agencyId`). Sessions fermées et membre prévenu par e-mail. L'impact est montré avant de confirmer. |
| Régénération des codes | Mot de passe exigé par Better Auth (`generateBackupCodes`). L'impact prévient que les anciens codes cessent de fonctionner. Les nouveaux codes ne s'affichent qu'une fois. |
| Fermeture d'agence | L'owner reçoit désormais un e-mail quand la fermeture est programmée : une trace hors de l'application. |

## Points résiduels
- **Attaquant qui détient le mot de passe et la boîte mail pendant 72 h, sans aucune connexion du titulaire** : c'est le risque accepté par l'étude. Il est limité par l'e-mail d'alerte et l'annulation automatique à la moindre connexion.
- **Support manuel** : il est reporté au back-office.
- **Réactivation de la 2FA après une récupération ou une réinitialisation** : elle n'est pas imposée à la connexion suivante, seulement recommandée par e-mail. On pourra l'imposer plus tard si nécessaire.
- **Modèles Resend à créer** : tant qu'ils n'existent pas, les e-mails correspondants sont ignorés, et l'action continue. Les e-mails de récupération sont essentiels à la sécurité du parcours : ils doivent être créés **avant la mise en production**.

## Vérifications
- Backend : 216 tests Jest (récupération, réinitialisation par l'owner, codes restants, fermeture avec e-mail). Web : 49 tests Vitest. Les builds passent. Migration `12_account_recovery` appliquée en dev.
