# Tâches : reçus de paiement

Vérification : back `pnpm test`, `pnpm build`, `CHANGES.md` ; web `tsc`, `pnpm test`, `pnpm build`. Commit local par tâche.

- [ ] **R1 [back] Numérotation** : migration 20 (`receiptNumber`, séquence, numéros pour les paiements déjà payés) ; attribution dans la transaction qui marque le paiement payé (abonnement et inscription). Tests : format, attribution unique.
- [ ] **R2 [back] PDF** : dépendance `pdfkit` ; `ReceiptPdfService` (données figées → PDF) ; route de téléchargement (owner) ; `receiptNumber` dans l'historique. Tests : contenu, accès.
- [ ] **R3 [back] E-mail** : pièce jointe dans l'avis « paiement confirmé » (échec de génération : e-mail sans pièce jointe).
- [ ] **R4 [web]** : bouton « Reçu » dans l'historique de facturation.
- [ ] **Checkpoint** : tests et builds ; audit de sécurité ; reçu téléchargé et ouvert en dev.
