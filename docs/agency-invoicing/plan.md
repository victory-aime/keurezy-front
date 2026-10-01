# Plan : facturation de l'agence à ses clients

Spec : [spec.md](./spec.md). Quatre modules livrés dans l'ordre **I1 → I2 → I3 → I4** ; chacun a ses tâches, ses tests et son audit.

## Architecture
- **Backend** : nouveau module `invoicing` (modèles, puis factures), qui dépend de `agency` (contrôle d'accès, informations légales) et de `packs` (quotas en I3). PDF par `pdfkit` (déjà installé), dans un moteur de rendu unique `renderInvoicePdf(template, data)` : l'aperçu de l'éditeur et les factures émises passent par le même code, donc l'aperçu est fidèle.
- **Configuration d'un modèle** : JSON structuré, validé par un DTO imbriqué (énumérations, couleurs hexadécimales, longueurs) ; les textes ne contiennent que du texte et des variables `{{groupe.cle}}` du catalogue (refus sinon). Aucun HTML.
- **Modèles par défaut** : 3 lignes communes (`agencyId` nul), créées par la migration, jamais modifiées en place.
- **Web** : section « Facturation » du tableau de bord ; éditeur de modèle plein écran en 6 étapes, aperçu = PDF réel rendu par le backend (affiché avec `react-pdf`, déjà installé).

## Données
- Migration 21 (I1) : coordonnées bancaires, taux de TVA, préfixe et modèle par défaut sur l'agence ; table `invoice_template` ; les 3 modèles par défaut.
- Migration 22 (I2) : factures, lignes, compteur de numérotation par agence.
- Seed (I3) : fonctionnalités `manage_invoices` et `invoice_templates`, limites par plan ; permission de facturation.

## Risques
| Risque | Parade |
|---|---|
| Aperçu différent du PDF | Même moteur de rendu, aperçu rendu par le backend. |
| Injection par les textes ou les données client | Pas de HTML ; pdfkit écrit du texte ; variables limitées au catalogue. |
| Numéros en double en concurrence | Compteur par agence incrémenté par `UPDATE … RETURNING` dans la transaction d'émission. |
| Facture modifiée après coup | Données et modèle copiés dans la facture à l'émission. |
