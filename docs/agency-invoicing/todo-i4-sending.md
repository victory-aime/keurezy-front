# Todo I4 : envoi des factures

Spec : [spec.md](./spec.md), règles « Envoi (I4) ». Demande du 2026-10-02 : continuer avec le lot 4 (Statistiques, mises en avant et traductions anglaises reportés).

## Règles
- **Téléchargement** du PDF depuis le détail (existant) et depuis la liste (menu de la ligne), pour les factures numérotées.
- **Envoi par e-mail** d'une facture **émise ou payée** (pas de brouillon : pas de numéro ; pas d'annulée). Le PDF figé est joint (`FAC-2026-0001.pdf`).
- **Destinataire** : l'e-mail du client de la facture, prérempli et modifiable (le client a pu changer d'adresse). **Message** facultatif de l'agence (1 000 caractères).
- **Réponse** : `Reply-To` = e-mail de l'agence figé sur la facture ; le client répond directement à l'agence.
- **Renvoi** possible, **5 envois par facture sur 24 h** au plus (`INVOICE_EMAIL_LIMIT`, 429) : l'adresse d'envoi de Keurezy ne doit pas servir à du spam.
- **Historique** : chaque envoi réussi est enregistré (destinataire, date, auteur), affiché dans le détail. Un envoi refusé par Resend n'est pas enregistré et renvoie une erreur (`INVOICE_EMAIL_FAILED`, 502).
- **Modèle Resend dédié** `invoice-sent` (`RESEND_TEMPLATE_INVOICE_SENT_ID`) : le modèle générique d'abonnement s'adresse à l'owner avec un bouton vers le tableau de bord, inadapté au client. Modèle absent : refus explicite (`EMAIL_NOT_CONFIGURED`, 503), pas de faux « envoyé ».
- **Droits** : `manage_invoices` (owner, staff autorisé). Aucun quota : l'envoi ne crée pas de facture.

## Tâches
- [x] Migration 25 : table `invoice_email` (facture, destinataire, auteur, date, identifiant Resend).
- [x] Mail : identifiant `INVOICE_SENT`, `sendInvoice` (pièce jointe, `replyTo`), gabarits `invoice-sent.html` et `.md`, inventaire du README.
- [x] Service et route `POST invoicing/invoices/send` : statut, limite sur 24 h, PDF figé, envoi, historique ; `emails` dans le détail. Tests.
- [x] Web : bouton « Envoyer par e-mail » / « Renvoyer » (dialogue : destinataire, message), historique dans le détail, téléchargement depuis la liste.
- [x] Tests, builds, revue, audit.

## Vérifications
- Tests : back 426 (8 nouveaux : envoi, destinataire saisi, brouillon et annulée refusées, destinataire manquant, limite sur 24 h, modèle absent, échec Resend, autre agence), web 103 ; builds OK. Migration 25 appliquée en dev.
- **À faire avant l'essai** : créer le modèle `invoice-sent` dans Resend (HTML prêt dans `src/modules/mail/templates/invoice-sent.html`) et renseigner `RESEND_TEMPLATE_INVOICE_SENT_ID` (local, UAT, production). Sans lui, « Envoyer » répond « pas encore disponible ».
- [ ] Vérification dans le navigateur (envoi, renvoi, limite, téléchargement depuis la liste).

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Facture d'une autre agence | Accès à l'agence vérifié, facture cherchée par `id` **et** `agencyId` : `404` (testé). |
| 2 | Staff sans droit | `manage_invoices` exigée (garde du contrôleur) ; bouton masqué sans la permission. |
| 3 | Spam via l'adresse de Keurezy | 5 envois par facture sur 24 h (testé) et 10 requêtes par minute sur la route ; seules les factures émises ou payées partent, leur nombre est borné par le quota mensuel. Compter puis envoyer peut laisser passer un envoi de trop sur des clics simultanés : accepté, borné par le throttle. |
| 4 | Injection dans l'e-mail | Toutes les variables sont échappées avant Resend (nom d'agence, client, message) ; aucun lien construit à partir d'une saisie. Destinataire validé (`IsEmail`, 254 caractères), message limité à 1 000. |
| 5 | Usurpation de l'agence | `Reply-To` lu dans la copie figée de la facture, pas dans la requête ; l'expéditeur reste l'adresse de Keurezy. |
| 6 | Faux « envoyé » | Modèle absent : `503` ; refus de Resend : `502` générique (détail dans les logs seulement), aucun envoi enregistré (testé). |
| 7 | Contenu joint | PDF rendu depuis la copie figée (statut émis ou payé exigé) : identique au téléchargement. |
| 8 | Données personnelles | Destinataire conservé avec la facture (historique), supprimé avec elle (`ON DELETE CASCADE`). |
