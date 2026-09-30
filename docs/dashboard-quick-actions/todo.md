# Tâches : `dashboard-quick-actions`

Vérification commune à chaque tâche :
- `pnpm exec tsc --noEmit`, `pnpm test` et `pnpm build` ;
- un commit local après ton test manuel.

## T1 : entrées autorisées
- [x] `create-actions.ts` : `createActions(hasPermission)` renvoie les 4 entrées de la spec, filtrées.
- [x] Test Vitest : owner (4 entrées), staff avec `schedule_visit` seul (1 entrée), staff sans aucune permission (0 entrée).
- **Taille** : XS.

## T2 : bouton « Créer »
- [x] `CreateMenu` : `Menu.Root`, un bouton « Créer » avec une icône `+`, puis une entrée par action (icône et libellé), avec navigation par `router.push`.
- [x] Sous `sm`, le bouton devient une icône seule avec `aria-label="Créer"`.
- [x] `DashboardStats` : retirer le bloc « Actions rapides » (grille, couleurs, `color="black"`) ; placer `CreateMenu` dans l'en-tête ; aucun rendu s'il n'y a aucune entrée.
- **Taille** : S.

## Checkpoint : ton test (owner, staff limité, clavier, thème sombre, largeur de 320 px)

## T3 : visite guidée et audit
- [x] `tourStep.ts` : l'étape `quick-actions` cible le bouton, avec le texte « Créez un bien, une annonce, planifiez une visite ou invitez un membre en un clic ».
- [x] `security-audit.md` : navigation seulement, et chaque route cible reste protégée par le backend.
