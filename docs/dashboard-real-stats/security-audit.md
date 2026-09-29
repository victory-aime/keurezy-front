# Audit de sécurité : `dashboard-real-stats`

Date : 2026-09-29. Méthode : skill `security-and-hardening`.

- **Autorisation.** Revenus, occupation et total des biens ne sont demandés qu'avec `view_properties`. Le backend revérifie la permission et le contrôle d'agence. Plus aucun 403 au chargement du tableau de bord pour un staff limité. ✅
- **Entrées.** L'année vient du sélecteur, bornée par l'année en cours, et le backend la valide (`IsInt`, 2000 à 2100). ✅
- **Exactitude de l'information.** Les données aléatoires sont supprimées. « Reçu » est libellé « Séjours terminés » : on ne présente pas comme encaissé un montant qui ne l'est pas, faute de paiement en ligne. ✅
- **Charge.** La liste des biens n'est plus chargée pour compter (`limitPerPage: 1`, et on lit `totalItems`). ✅
- **Diff.** Aucun secret, aucune dépendance. ✅

**Verdict** : rien à signaler.
