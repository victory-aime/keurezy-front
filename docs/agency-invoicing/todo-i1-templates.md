# Tâches I1 : modèles de facture

Vérification : back `pnpm test`, `pnpm build`, `CHANGES.md` ; web `tsc`, `pnpm test`, `pnpm build`. Commit local par tâche.

## T1 [back] Données
- [x] Migration 21 : sur `agency`, `bankName`, `bankAccount`, `mobileMoneyNumber`, `vatRate` (0 par défaut), `invoicePrefix` (`FAC`), `defaultInvoiceTemplateId` ; table `invoice_template` (agence nullable, nom, mise en page, configuration JSON) ; 3 modèles par défaut.
- [x] Coordonnées bancaires dans `PATCH agency/legal` (owner).

## T2 [back] Variables et rendu
- [x] Catalogue des variables ; contrôle des `{{…}}` d'un texte ; remplacement ; montant en lettres (français, F CFA).
- [x] `renderInvoicePdf(config, data)` : 3 mises en page, colonnes, blocs, TVA (HT, TVA, TTC), police, couleurs, logo.
- **Tests** : variables inconnues refusées ; montant en lettres ; PDF de chaque mise en page avec les données attendues.

## T3 [back] Routes des modèles
- [x] `GET invoicing/templates` (owner et staff de facturation) : défauts et modèles de l'agence ; `GET invoicing/templates/variables`.
- [x] `POST`, `PATCH`, `DELETE invoicing/templates` (owner) : modifier un défaut crée une copie ; suppression impossible pour un défaut ; le modèle par défaut de l'agence se rabat sur Classique s'il est supprimé.
- [x] `PATCH invoicing/settings` (owner) : TVA, préfixe, modèle par défaut.
- [x] `POST invoicing/templates/preview` : PDF d'aperçu avec des données d'exemple (configuration non enregistrée acceptée).
- **Tests** : accès (autre agence, staff), copie d'un défaut, validation.

## T4 [web] Écrans
- [x] Page Agence : coordonnées bancaires dans la section légale.
- [x] Page « Modèles de facture » : liste (défauts et modèles de l'agence), modèle par défaut, réglages (TVA, préfixe).
- [x] Éditeur plein écran en 6 étapes avec aperçu PDF ; insertion de variables.

## Checkpoint
- [x] Tests et builds (back 391, web 82) ; audit et revue ci-dessous ; les 3 modèles rendus et relus en PDF.
- [ ] Vérification dans le navigateur (mobile compris) : page « Modèles de facture », éditeur, aperçu, coordonnées bancaires.

## Précisions d'implémentation
- Les 3 modèles communs sont définis une seule fois dans le code et synchronisés au démarrage du backend (pas de SQL dupliqué).
- L'aperçu est le **vrai PDF** rendu par le backend (même moteur que les factures), affiché avec `react-pdf`. Il est recalculé 500 ms après la dernière modification ; la requête précédente est annulée.
- Le stepper du changement de plan accepte désormais des libellés d'étapes (réutilisé par l'éditeur).
- Page réservée à l'owner pour l'instant ; l'accès du staff avec la permission de facturation viendra avec I3.

## Revue UX et accessibilité
- Éditeur plein écran : focus sur le titre à chaque étape, stepper annoncé (`aria-current`), raison du bouton grisé en région live.
- Aperçu à côté du formulaire sur grand écran ; sur mobile, à la dernière étape (pas de double colonne étroite).
- Variables : menu accessible au clavier, insertion au curseur, erreur immédiate pour une variable inconnue, compteur de caractères.
- Couleurs : sélecteur natif et code hexadécimal liés, tous deux étiquetés.
- Suppression : confirmation qui dit ce qui se passe (factures émises inchangées, retour à Classique).

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Modèle d'une autre agence | Toujours cherché parmi les modèles communs et ceux de l'agence de l'appelant : `404` sinon (testé). |
| 2 | Écriture par le staff | Owner uniquement (`403`, testé). |
| 3 | Injection dans le PDF | Configuration structurée (énumérations, couleurs `#RRGGBB`, longueurs) ; textes en texte brut avec variables du catalogue seulement (`422` sinon, testé) ; pdfkit n'interprète rien. |
| 4 | SSRF par le logo | Logo téléchargé seulement en HTTPS depuis `res.cloudinary.com`, sans redirection, PNG ou JPEG, 2 Mo et 5 s au plus. |
| 5 | Modèles communs | Jamais modifiés ni supprimés par une agence (copie, `409`, testé). |
| 6 | Déni de service par l'aperçu | Rendu en mémoire d'une page d'exemple ; limite de débit globale de l'API. À surveiller si l'éditeur est très utilisé. |
| 7 | Dépendances | Aucun ajout (pdfkit et react-pdf déjà présents). |

## Ajouts après la première vérification (cachet, aperçu, cartes)
- [x] **Cachet et signature**, deux façons au choix, par modèle (étape Contenu, si la zone « Signature et cachet » est affichée) :
  - *Cachet scanné* : image PNG ou JPEG (1 Mo) téléversée par l'owner, stockée sur Cloudinary (`agency.invoiceStampUrl`, migration 22) ;
  - *Cachet généré* (l'alternative sans scan) : tampon dessiné par le backend avec la raison sociale, l'adresse, le NINEA et le RCCM ;
  - *Cadre vide* : à signer à la main (comportement initial, valeur par défaut des anciens modèles).
  - Le modèle commun Moderne utilise le cachet généré.
  - Écarté : la signature électronique certifiée (PAdES, certificat d'un prestataire agréé), lourde et payante ; à étudier si une agence en a besoin pour des marchés publics.
- [x] Aperçu indisponible (erreur du backend) : bouton « Réessayer » qui relance la génération.
- [x] Cartes de modèle : badge « Commun » retiré ; description de chaque modèle commun (servie par le backend) ; couleurs nommées avec leur rôle (« Noir → couleur principale : titres, en-tête et tableau ») ; actions en icônes avec libellé au survol (Aperçu, Personnaliser, Choisir ce modèle, Supprimer).
- [x] Tests : back 396, web 91 ; build OK ; cachet généré rendu et relu en PDF.

| # | Point (cachet) | Résultat |
|---|---|---|
| 8 | Fichier envoyé | Owner seulement (`403`, testé) ; 1 Mo et un seul fichier (multer) ; type vérifié sur la signature binaire PNG/JPEG, pas sur le nom ni le type annoncé (`422`, testé). |
| 9 | Image relue pour le PDF | Même chargeur que le logo : HTTPS, `res.cloudinary.com` seulement, sans redirection. Image illisible : cadre vide, la facture est quand même produite (testé). |
| 10 | Ancienne image | Laissée sur Cloudinary quand elle est remplacée ou retirée (fichier orphelin, sans lien public dans l'application). Nettoyage possible plus tard. |
