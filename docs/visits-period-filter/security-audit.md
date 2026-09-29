# Audit de sécurité : `visits-period-filter`

Date : 2026-09-29. Méthode : skill `security-and-hardening`.

- **Entrées.** `from` et `to` sont produites par l'agenda (`date-fns`, format `AAAA-MM-JJ`) et validées par le backend (`AgencyVisitsQueryDto`, `IsDateString`). Une valeur forgée à la main est refusée par le backend. ✅
- **Charge.** Les requêtes sont désormais bornées à la période affichée : au plus une grille de 6 semaines, au lieu de tout l'historique de l'agence. Le risque de déni de service par liste non bornée diminue. ✅
- **Autorisation.** Rien ne change : `view_visits` et le contrôle d'agence restent en place côté backend. ✅

**Verdict** : rien à signaler.
