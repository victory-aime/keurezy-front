# Spec : `visits-period-filter`

> Module 6 de la [carte des modules](../agency-dashboard-wiring/capability-map.md). Il correspond au lot 5 du backend : `GET visits/agency-visits?agencyId&from&to`.

## Objectif
L'agenda des Rendez-vous charge aujourd'hui **toutes** les visites de l'agence. Il doit ne charger que la **période affichée** (mois, semaine ou jour) et la recharger quand on navigue. La charge suit ainsi l'usage, et l'agenda reste rapide quand l'historique grandit.

### Critères d'acceptation
1. `BaseAgenda` accepte un rappel facultatif `onRangeChange({ from, to })`.
   - Il est appelé au montage, puis à chaque changement de vue ou de date.
   - Sans ce rappel, le comportement ne change pas pour les autres usages de l'agenda.
2. La plage visible couvre la grille affichée :

   | Vue | Plage |
   |---|---|
   | mois et liste | du lundi de la première semaine au dimanche de la dernière semaine du mois |
   | semaine | du lundi au dimanche |
   | jour | le jour |

3. La page Rendez-vous transmet `from` et `to` (`AAAA-MM-JJ`) à `agency-visits`. Pendant le chargement d'une nouvelle période, les visites de la précédente restent affichées avec l'indicateur de chargement, ce qui évite un agenda vide qui clignote.
4. Après la création, la modification ou l'annulation d'une visite, la période courante est rechargée.

## Tests
- **Vitest** : `visibleRange(view, date)` pour chaque vue, avec un mois qui commence en milieu de semaine.
- **Test manuel** : naviguer de mois en mois et de semaine en semaine, et vérifier dans l'onglet réseau que les appels portent `from` et `to`.

## Limites
- On ne change pas l'apparence de l'agenda.
- La fin de période est une date seule : le backend l'inclut entièrement (lot 5).
