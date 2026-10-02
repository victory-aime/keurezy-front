# Todo I2 : factures

Spec : [spec.md](./spec.md), règles « Factures (I2) ». Plan : [plan.md](./plan.md).

## Choix d'implémentation (par défaut, à corriger au besoin)
- **Lignes en JSON** sur la facture (désignation, période, quantité, prix unitaire), pas de table à part : une facture émise est figée, on ne requête jamais une ligne seule. Totaux HT, TVA et TTC stockés pour la liste.
- **Émission = copie figée** (`snapshot`) : informations de l'agence (dont URL du logo et du cachet), configuration du modèle, taux de TVA, client, réservation et bien. Le PDF d'une facture émise est rendu depuis cette copie seulement.
- **Numéro** `{préfixe}-{année}-{rang sur 4 chiffres}`, rang repris à 1 chaque année civile. Compteur par agence et par année incrémenté par `INSERT … ON CONFLICT DO UPDATE … RETURNING` dans la transaction d'émission : ni trou ni doublon (une émission échouée annule aussi l'incrément).
- **Depuis une réservation** confirmée ou terminée : ligne de location (durée × prix) et ligne « Caution (remboursable) » si la réservation en a une, client et bien préremplis ; tout reste modifiable dans le brouillon. Plusieurs factures par réservation autorisées.
- **Brouillon** : PDF disponible avec la mention « BROUILLON » et sans numéro ; supprimable. **Émise** : ni modifiable ni supprimable ; on l'annule.
- **Payée** : date et moyen (espèces, virement, Wave / Orange Money, chèque, carte, autre). **Annulée** : motif obligatoire, numéro conservé, mention « ANNULÉE ».
- **Droits** : owner ; staff avec la permission `manage_invoices` (le garde existe déjà ; la permission sera créée et attribuable avec I3, d'ici là le staff n'a pas accès).

## Backend
- [x] Migration 23 : `invoice` (statut, client, lignes, totaux, échéance, réservation et modèle facultatifs, numéro unique par agence, copie figée, paiement, annulation, auteur) et `invoice_counter`.
- [x] Numérotation : `nextInvoiceNumber(tx, agencyId, prefix, year)` ; test de concurrence (numéros uniques et continus).
- [x] Service : liste paginée (statut, recherche), détail, réservations facturables, création (libre ou depuis une réservation), modification et suppression d'un brouillon, émission, payée, annulée, PDF.
- [x] Rendu : `watermark` (« BROUILLON » ou « ANNULÉE ») ; données figées → `InvoiceRenderData`.
- [x] Contrôleur `secured/invoicing/invoices` avec `@RequirePermission('manage_invoices')`.
- [x] Tests : facture d'une autre agence introuvable ; brouillon seul modifiable ; émission figée (modèle ou agence modifiés ensuite : PDF inchangé) ; transitions interdites (payer un brouillon, annuler un brouillon) ; date de paiement ni future ni antérieure à l'émission. Motif d'annulation obligatoire par le DTO (3 à 500 caractères).

## Web
- [x] Types, routes, service, requêtes et mutations.
- [x] Page « Factures » : onglets par statut, recherche, tableau (numéro, client, date, échéance, total, statut), actions.
- [x] Création et modification d'un brouillon (plein écran) : source (réservation ou libre), client, lignes, échéance, modèle ; totaux en direct (le PDF du brouillon est dans le détail).
- [x] Détail : PDF, émettre (confirmation : numéro attribué, plus modifiable), marquer payée, annuler (motif), supprimer un brouillon.
- [x] Menu : « Factures » (owner pour l'instant, staff avec I3).

## Checkpoint
- [x] Tests et builds (back 409, web 96) ; revue UX et accessibilité ; audit de sécurité (ci-dessous).
- [x] Essai de bout en bout du service sur la base de dev (Mobelite) : brouillon, PDF, émission `FAC-2026-0001` au modèle par défaut et à la TVA de l'agence, payée, annulée, recherche, brouillon depuis une réservation ; puis nettoyage (aucune facture ni rang laissé).
- [ ] Vérification dans le navigateur.

## Précisions d'implémentation
- Pages : « Factures » (`/dashboard/invoicing/invoices`) et « Modèles de facture » (`/dashboard/invoicing/templates`), deux liens du menu au même niveau (pas de double surbrillance).
- Le brouillon créé depuis une réservation existe dès le choix de la réservation ; il s'ajuste ensuite comme une facture libre.
- Le PDF du détail est rendu par le backend (brouillon : données du jour et mention BROUILLON) ; le hook PDF de l'aperçu des modèles est partagé (`usePdfDocument`), avec « Réessayer ».
- Totaux du brouillon calculés en direct au taux de l'agence, avec le même arrondi que le backend (testé) ; recalculés par le backend à l'émission.
- Numérotation vérifiée sur la vraie base : 40 émissions simultanées dont 10 en échec → 30 numéros uniques et continus (1 à 30), aucun trou.

## Revue UX et accessibilité
- Filtres par statut avec compteurs (`aria-pressed`), recherche différée de 300 ms, état vide différent selon qu'un filtre est actif ou non.
- Tableau sur grand écran, liste tactile sur mobile (chaque facture est un bouton avec un nom accessible complet), pagination dans les deux cas.
- Badge « En retard » en plus du statut (texte, pas seulement une couleur).
- Éditeur plein écran : focus sur le titre, raison du bouton grisé annoncée, lignes étiquetées une à une (« Quantité, ligne 2 »), saisie numérique adaptée sur mobile.
- Émettre, supprimer un brouillon et annuler montrent d'abord leur impact (numéro attribué, ce qui est figé, ce qui est conservé) ; motif d'annulation obligatoire.

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Facture ou réservation d'une autre agence | Toutes les requêtes portent sur l'agence de l'appelant (`404`, testé) ; contrôle d'accès owner/staff avant chaque action. |
| 2 | Staff | Garde `manage_invoices` sur tout le contrôleur. La permission n'existe pas encore (I3) : seul l'owner a accès. |
| 3 | Champs imposés par le client | DTO en liste blanche ; numéro, statut, totaux, copie figée et auteur fixés par le backend uniquement. |
| 4 | Concurrence | Compteur atomique et transitions par `updateMany` conditionnel au statut : double émission ou action concurrente → `409`, rien de consommé (testé, et sur la vraie base). Contrainte SQL : numéro présent si et seulement si la facture n'est pas un brouillon. |
| 5 | Injection | Client et lignes écrits comme du texte par pdfkit ; recherche paramétrée par Prisma ; nom du fichier PDF = numéro (préfixe limité à `[A-Z0-9]`). |
| 6 | Volume | 50 lignes, longueurs bornées, total plafonné à 1 milliard de F CFA (`422`), pages de 100 au plus. |
| 7 | Facture émise modifiée après coup | Rendue depuis la copie figée seulement (testé : ni l'agence ni le modèle ne sont relus). Les images restent des URL Cloudinary : ne jamais supprimer un ancien logo ou cachet de Cloudinary tant que des factures y renvoient. |
| 8 | Données personnelles | Coordonnées du client limitées au nom, e-mail, téléphone et adresse, nécessaires à la facture ; conservées comme pièce comptable (durée légale à préciser par l'agence). |
