# Étude : `account-recovery` (chantier futur)

> Question du 30/09 : que faire quand un utilisateur perd **tous** ses moyens de 2FA, c'est-à-dire le téléphone et les codes de secours ? Statut : **pistes à valider**, rien n'est implémenté.

## Le problème
- La 2FA protège justement contre quelqu'un qui connaît le mot de passe. Tout recours doit donc être **plus lent ou plus coûteux** qu'une connexion normale. Sinon, il devient la porte d'entrée de l'attaquant.
- Aujourd'hui, si un owner perd tout, **l'agence entière est bloquée**, car aucun autre compte n'a les droits d'owner. Pour un staff, c'est moins grave : l'owner peut le retirer puis le réinviter, mais il perd son historique de connexion.

## Pistes

### A. Prévenir la perte (peu coûteux, à faire en premier)
| Piste | Détail | Coût |
|---|---|---|
| A1 : régénérer les codes de secours | Écran Sécurité, sous mot de passe : `twoFactor.generateBackupCodes`. Les anciens codes sont invalidés. | S |
| A2 : compteur de codes restants | Alerte « Il vous reste 2 codes de secours » à la connexion et dans Sécurité. | S |
| A3 : passkey comme second facteur | Une passkey (déjà gérée) permet de se connecter sans TOTP. On la propose à l'activation de la 2FA : « Ajoutez une passkey de secours ». | S |
| A4 : appareil de confiance | Une session sur un appareil de confiance (30 jours) peut régénérer ses codes. Cela existe déjà avec `trustDevice` ; il suffit de le mettre en avant. | XS |

### B. Staff : réinitialisation par l'owner (recommandée)
- Dans Équipe, l'action « Réinitialiser la double authentification » désactive la 2FA du membre et ferme ses sessions. À sa prochaine connexion, le membre doit la réactiver.
- Avant de confirmer, l'owner voit l'impact : sessions fermées, et 2FA à reconfigurer par le membre.
- L'action est tracée (notification au membre et journal).
- Coût : S (un endpoint réservé à l'owner, plus le dialogue d'impact).

### C. Owner : récupération avec délai de carence (recommandée)
Ce modèle est celui de GitHub et de Google : « Je n'ai plus accès à mon application ».
1. Le mot de passe est vérifié, puis un code est envoyé à l'e-mail du compte.
2. Une **demande de récupération** est ouverte, avec un **délai de 72 h**.
   - Pendant ce délai, des e-mails préviennent le titulaire, avec un lien « Ce n'est pas moi, annuler ».
   - Une connexion réussie avec la 2FA annule aussi la demande.
3. À l'échéance, la 2FA est désactivée, les sessions sont fermées et les codes de secours invalidés. L'utilisateur doit reconfigurer la 2FA dès sa connexion.

- Risque résiduel : un attaquant qui détient le mot de passe **et** la boîte mail, pendant 72 h, sans réaction du titulaire. C'est acceptable pour un SaaS de gestion, et c'est bien moins risqué qu'une désactivation immédiate.
- Coût : M (un modèle `RecoveryRequest`, un cron d'échéance, 3 e-mails et 2 écrans).

### D. Support manuel (dernier recours)
- Vérification d'identité par le support Keurezy : comparaison avec les documents légaux de l'agence déjà envoyés à l'inscription (`AgencyInfo`), et rappel au numéro de téléphone de l'agence.
- Action réservée à un rôle ADMIN plateforme, et journalisée.
- Coût : S côté code (une action admin), mais il faut une procédure écrite.

### E. Écartées pour l'instant
- **SMS de secours** : coût d'envoi, et vulnérable au détournement de carte SIM.
- **Second e-mail de récupération** : il ne fait que déplacer le problème. On y reviendra si les utilisateurs le demandent.

## Recommandation et ordre
**A1 à A4** (prévention) → **B** (staff) → **C** (owner) → **D** (procédure du support). A et B couvrent la majorité des cas pour un coût faible. C supprime le risque de blocage définitif d'une agence.

## Prochaine étape
Valider ces pistes, puis écrire `spec.md`, `plan.md` et `todo.md` dans ce dossier, selon le processus habituel.
