# Audit de sécurité : `destructive-impact-rollout`

> Réalisé le 30/09 (skill `security-and-hardening`), sur le web et le backend.

## Modèle de menace (résumé)
- **Actions concernées** : supprimer une annonce, annuler une visite, désactiver un membre, fermer l'agence, fermer des sessions.
- **Risques** :
  - élévation de privilège : un staff qui ferme l'agence ou désactive un membre ;
  - divulgation : un impact qui révèle des données d'une autre agence ;
  - accès persistant : un membre désactivé qui garde une session active.

## Contrôles
| Point | Vérification |
|---|---|
| Désactivation d'un membre | Réservée à l'owner côté backend (`OWNER_ONLY`). Le `userId` est déduit du Staff de l'agence, jamais lu du client. **Les sessions sont désormais fermées** : auparavant, un membre désactivé gardait ses sessions ouvertes. |
| Fermeture d'agence | `closeAgency` n'aboutit que pour l'owner, car le profil owner est exigé. **Membres désactivés et toutes les sessions fermées**, owner compris. Côté web, déconnexion locale puis redirection vers la connexion. |
| `GET agency/close-impact` | Réservé à l'owner (`OWNER_ONLY`, test Jest). En lecture seule, avec des comptes limités à l'`agencyId` contrôlé par `agencyAccessControl`. |
| Liste publique des biens | Les agences fermées sont exclues. Leurs biens n'étaient plus gérables, mais restaient visibles et réservables. |
| Notification d'annulation de visite | Le destinataire est le compte de l'agent (`agent.userId`). L'identifiant Staff envoyé auparavant ne correspondait à aucun compte : aucune fuite, mais aucune notification. |
| Impact d'une annonce | `property/impact` n'est appelé qu'avec `view_properties`. Sans cette permission, l'impact affiché est générique : aucune donnée n'est demandée au backend. |
| Sessions | `revokeSession` (par jeton) et `revokeOtherSessions` passent par l'API Better Auth, limitée à l'utilisateur connecté. La session en cours ne peut pas être fermée par la corbeille. |
| Confirmation de fermeture d'agence | Il faut retaper le nom de l'agence (`confirmDisabled`). C'est une barrière d'intention côté interface : le contrôle réel reste côté serveur (owner). |

## Points résiduels
- **Suppression d'une passkey** : elle utilise encore l'ancien `DeleteModalAnimation`, car elle ne faisait pas partie du chantier. Son impact : cette passkey ne permet plus de se connecter, et les autres moyens restent actifs. À ajouter lors d'une prochaine passe.
- **Drive et corbeille** : exclus de ce chantier (décision du 29/09).
- **Réservations confirmées lors d'une fermeture d'agence** : elles ne sont pas annulées automatiquement. L'impact les signale en orange, avec la consigne de prévenir ou d'annuler avant de fermer.

## Vérifications
- Tests : 41 web (Vitest, dont un par builder) et 195 backend (Jest, dont la notification de l'agent, les sessions, la fermeture, `close-impact` et la liste publique). Les builds web et backend passent.
