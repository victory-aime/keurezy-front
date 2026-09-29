# Audit de sécurité : `team-lifecycle`

Date : 2026-09-29. Méthode : skill `security-and-hardening`.

- **Élévation de privilège.**
  - Le retrait d'un membre et son impact sont réservés à l'owner, dans l'interface (action désactivée, requête non lancée) comme dans le backend (`OWNER_ONLY`).
  - Le renvoi et l'annulation d'une invitation exigent `resend_invitation` et `cancel_invitation`, que le guard global revérifie. ✅
- **Sessions.** Le retrait ferme les sessions du membre côté backend : déconnexion immédiate, sans attendre l'expiration. Le web n'expose aucune session. ✅
- **Mot de passe temporaire.** Le renvoi en génère un nouveau côté serveur. Le web ne le voit jamais, il est seulement envoyé par e-mail, et l'ancien est invalidé. ✅
- **Réinvitation.** Seuls les comptes désactivés sans profil peuvent être réinvités (backend, `USER_NOT_INVITABLE`). Le web affiche le refus sans révéler si l'adresse appartient à un client ou à un owner d'une autre agence : le message est générique. ✅
- **XSS.** Noms et e-mails sont rendus par React. ✅
- **Diff.** Aucun secret, aucune dépendance. ✅

**Verdict** : rien à signaler.
