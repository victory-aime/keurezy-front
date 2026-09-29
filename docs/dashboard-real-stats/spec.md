# Spec : `dashboard-real-stats`

> Module 7 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond au lot 6 du backend : `property/monthly-revenue` et `property/occupation-rate-property-type`.

## Objectif
Le tableau de bord affiche aujourd'hui des chiffres faux ou aléatoires. Il doit afficher les **données réelles** de l'agence, pour qu'elle puisse s'y fier.

### Constats à corriger
- Les graphiques « Revenus mensuels » et « Taux d'occupation » sont générés avec `Math.random()`.
- La carte « Revenus mensuels » additionne les loyers des biens non disponibles, sans lien avec l'argent réel.
- La carte « Total propriétés » compte les biens de la première page (10 au maximum) au lieu du total.
- Les appels partent sans tenir compte des permissions, ce qui provoque des 403 pour un staff limité.

### Critères d'acceptation
1. **Revenus mensuels** : ils viennent de `GET property/monthly-revenue?agencyId&year`, soit 12 mois de réservations.
   - « Reçu » : réservations terminées.
   - « Restant » : réservations confirmées.
   - « Attendu » : la somme des deux.
   - Un sélecteur d'année (année précédente, année suivante) démarre sur l'année en cours et ne dépasse pas celle-ci.
   - Les mois sont libellés en français (« janv. », « févr. »…) à partir de `AAAA-MM`.
2. **Taux d'occupation par type** : il vient de `GET property/occupation-rate-property-type`. Les types sont libellés via `CONSTANTS.propertyTypes`.
3. **Cartes (KPI)** :
   - « Propriétés » : le total réel (`totalItems`).
   - « Revenus du mois » : le montant attendu du mois en cours (reçu et restant), issu des revenus mensuels.
4. **Permissions** : les propriétés, les revenus et l'occupation exigent `view_properties`. Sans elle, les requêtes ne partent pas, et les graphiques affichent l'état vide existant plutôt qu'une erreur.
5. **États** : squelette pendant le chargement ; animation « aucune donnée » quand il n'y a encore aucune réservation.

## Design (skill `frontend-ui-engineering`)
- On réutilise les composants existants : `BaseStats`, `MonthlyRevenueAreaChart` et `OccupationRateByType`.
- Le sélecteur d'année est un petit groupe de deux flèches et de l'année, accessible (`aria-label` « Année précédente » et « Année suivante »), placé au-dessus du graphique des revenus.
- Plus aucune donnée générée côté client.

## Tests
- **Vitest** : `monthLabel('2026-01')` donne « janv. » ; `currentMonthExpected(stats, date)` fait la somme du mois en cours et vaut 0 si le mois manque.
- **Test manuel** : comparer le graphique avec les réservations terminées et confirmées de l'année, changer d'année, puis se connecter en staff sans `view_properties`.

## Limites
- **Jamais** : de données fictives, ni de revenus présentés comme encaissés alors qu'aucun paiement en ligne n'existe. Le libellé « Reçu » correspond aux séjours terminés, et le graphique le dit en légende.
