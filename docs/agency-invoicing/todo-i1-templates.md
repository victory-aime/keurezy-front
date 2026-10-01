# Tâches I1 : modèles de facture

Vérification : back `pnpm test`, `pnpm build`, `CHANGES.md` ; web `tsc`, `pnpm test`, `pnpm build`. Commit local par tâche.

## T1 [back] Données
- [ ] Migration 21 : sur `agency`, `bankName`, `bankAccount`, `mobileMoneyNumber`, `vatRate` (0 par défaut), `invoicePrefix` (`FAC`), `defaultInvoiceTemplateId` ; table `invoice_template` (agence nullable, nom, mise en page, configuration JSON) ; 3 modèles par défaut.
- [ ] Coordonnées bancaires dans `PATCH agency/legal` (owner).

## T2 [back] Variables et rendu
- [ ] Catalogue des variables ; contrôle des `{{…}}` d'un texte ; remplacement ; montant en lettres (français, F CFA).
- [ ] `renderInvoicePdf(config, data)` : 3 mises en page, colonnes, blocs, TVA (HT, TVA, TTC), police, couleurs, logo.
- **Tests** : variables inconnues refusées ; montant en lettres ; PDF de chaque mise en page avec les données attendues.

## T3 [back] Routes des modèles
- [ ] `GET invoicing/templates` (owner et staff de facturation) : défauts et modèles de l'agence ; `GET invoicing/templates/variables`.
- [ ] `POST`, `PATCH`, `DELETE invoicing/templates` (owner) : modifier un défaut crée une copie ; suppression impossible pour un défaut ; le modèle par défaut de l'agence se rabat sur Classique s'il est supprimé.
- [ ] `PATCH invoicing/settings` (owner) : TVA, préfixe, modèle par défaut.
- [ ] `POST invoicing/templates/preview` : PDF d'aperçu avec des données d'exemple (configuration non enregistrée acceptée).
- **Tests** : accès (autre agence, staff), copie d'un défaut, validation.

## T4 [web] Écrans
- [ ] Page Agence : coordonnées bancaires dans la section légale.
- [ ] Page « Modèles de facture » : liste (défauts et modèles de l'agence), modèle par défaut, réglages (TVA, préfixe).
- [ ] Éditeur plein écran en 6 étapes avec aperçu PDF ; insertion de variables.

## Checkpoint
- [ ] Tests et builds ; audit de sécurité ; revue UX et accessibilité de l'éditeur ; vérification dans le navigateur (mobile compris).
