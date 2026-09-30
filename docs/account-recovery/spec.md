# Spec : `account-recovery`

> Découle de [`study.md`](study.md), validée le 30/09 pour les pistes **A, B et C**. La piste D (support manuel) part dans le futur back-office.

## A. Prévenir la perte (web et backend)
1. **Codes de secours restants** : `GET users/backup-codes/remaining` renvoie `{ remaining }` (lecture serveur via `viewBackupCodes`). Sécurité l'affiche : « Il vous reste N codes de secours », en orange quand il en reste 2 ou moins.
2. **Régénérer les codes** : dans Sécurité, avec le mot de passe (`twoFactor.generateBackupCodes`). Un dialogue d'impact s'affiche d'abord : les anciens codes sont invalidés, les nouveaux sont à télécharger. Les nouveaux codes s'affichent ensuite, avec le téléchargement.
3. **Passkey de secours** : quand la 2FA est active et qu'aucune passkey n'existe, Sécurité propose « Ajoutez une passkey de secours » (ouvre la modale existante).
4. **Appareil de confiance** : existe déjà (case à cocher à la connexion). Aucun changement.

## B. L'owner réinitialise la 2FA d'un membre
- `POST team/reset-two-factor?agencyId&id` (owner uniquement, `OWNER_ONLY`). Le membre doit appartenir à l'agence.
- Effet, en une transaction : suppression de sa configuration 2FA, `twoFactorEnabled = false` et fermeture de ses sessions.
- Le membre est prévenu par l'e-mail `TWO_FACTOR_RESET`.
- Web : dans Équipe, l'action « Réinitialiser la 2FA » n'est proposée que pour les membres dont la 2FA est active. Le dialogue d'impact indique : sessions fermées, 2FA à reconfigurer par le membre, e-mail envoyé.

## C. Récupération par l'utilisateur, avec délai de 72 h
Ouvert à tout compte dont la 2FA est active. Pour un membre du staff, B reste la voie rapide.
1. Sur l'écran de vérification 2FA, le lien « Je n'ai plus accès à mon application ni à mes codes » mène à `/auth/two-factor-recovery`.
2. **Étape 1** : e-mail et mot de passe (`POST unsecured/auth/two-factor-recovery/request`). Le mot de passe est vérifié côté serveur, puis un code à 6 chiffres est envoyé à l'e-mail du compte (même mécanisme que l'invitation : haché, 5 essais, délai de renvoi).
3. **Étape 2** : le code (`POST …/confirm`). Une demande est créée, exécutable dans **72 h**. L'e-mail `ACCOUNT_RECOVERY_REQUESTED` donne la date et un lien d'annulation « Ce n'est pas moi ».
4. **Annulation** : par le lien (`POST …/cancel { token }`, jeton à usage unique stocké haché), ou automatiquement par **toute connexion réussie** du compte (hook de création de session).
5. **Exécution** : un cron horaire traite les demandes échues. Il supprime la configuration 2FA, fait passer `twoFactorEnabled` à false et ferme les sessions. L'e-mail `ACCOUNT_RECOVERY_COMPLETED` invite à reconfigurer la 2FA.

## Critères d'acceptation
- Aucune route ne révèle si un e-mail existe sans le bon mot de passe.
- Les codes et jetons sont stockés hachés, à usage unique, et soumis à la limite de débit `sensitive`.
- Une connexion réussie pendant les 72 h annule la demande.
- Tests Jest pour chaque règle, et Vitest pour les builders web.

## E-mails Resend
Les modèles (texte et variables) sont dans `keurezy-backend/src/modules/mail/templates/`. L'inventaire, avec ce qui existe et ce qui reste à créer, est dans `README.md`.
