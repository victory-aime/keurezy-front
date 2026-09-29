# Spec : `dashboard-quick-actions`

> Accueil du dashboard (`DashboardStats.tsx`). Skill design : `frontend-ui-engineering`.

## Constats
Le bloc « Actions rapides » est une grille de 4 cartes colorées, en bas de page, sous l'activité récente :
- **Doublon avec la sidebar** : « Voir les terrains » et « Voir les propriétés » ne sont que de la navigation.
- **Aucun contrôle de permission** : un staff voit « Ajouter un membre », « Ajouter un bâtiment »… et tombe sur un 403 ou une page vide. Cela contredit la règle « le staff ne voit que ce qu'il peut faire ».
- **Accessibilité** : les cartes sont des `VStack` cliquables, ni focusables au clavier, ni annoncées comme des liens.
- **Thème** : texte `color="black"` en dur (illisible en mode sombre), 4 couleurs de fond différentes, soit le look « grille de cartes » générique.
- **Position** : en bas de page, là où l'œil arrive en dernier. La visite guidée (`tourStep.ts`) décrit des actions qui n'existent pas (« ajoutez un locataire, enregistrez un paiement »).

## Proposition (recommandée) : un bouton « Créer » dans l'en-tête
- On retire le bloc « Actions rapides ».
- À droite du titre « Tableau de bord », on place un **bouton principal « Créer »** qui ouvre un menu. Il utilise le composant `Menu` de Chakra v3 déjà employé par les actions de tableau.
- Les entrées du menu sont filtrées par `usePermissions` ; le bouton disparaît s'il ne reste aucune entrée.

  | Entrée | Icône | Permission | Route |
  |---|---|---|---|
  | Nouveau bien | `Home` | `PROPERTIES.CREATE` (`create_property`) | `PROPERTIES.ADD` |
  | Nouvelle annonce | icône d'annonce existante | `PROPERTIES.PUBLISH` (`publish_property`) | `ANNONCES.ADD` |
  | Planifier une visite | `Calendar` | `VISITS.SCHEDULE` (`schedule_visit`) | `VISITS` |
  | Inviter un membre | `SendMail` | `INVITATIONS.SEND` (`send_invitation`) | `INVITATIONS.ADD` |

  Ce sont les mêmes permissions que celles exigées par le backend sur les routes de création. L'owner les a toutes.
- **Pourquoi** : c'est le motif standard des tableaux de bord SaaS (Linear, Stripe) : une seule action principale, en haut, là où l'utilisateur regarde en premier. On n'y met que des actions de création, sans doublon avec la navigation, et la page gagne une ligne de hauteur.
- **Accessibilité** : `Menu` gère le clavier (flèches, Échap) et les rôles ARIA. Le bouton a un libellé visible.
- **Responsive** : sous `sm`, le bouton devient une icône `+` avec `aria-label="Créer"`.
- **Visite guidée** : l'étape `quick-actions` cible le bouton, avec un texte corrigé : « Créez un bien, une annonce ou planifiez une visite en un clic ».

### Alternative
Supprimer simplement le bloc, sans remplacement. C'est le plus simple, mais on perd le raccourci de création.

## Critères d'acceptation
1. Plus de bloc « Actions rapides ».
2. Le bouton « Créer » n'affiche que les entrées autorisées, et il est masqué s'il n'en reste aucune.
3. Il se navigue au clavier et reste lisible en thème clair comme sombre.
4. La visite guidée pointe sur le bouton, avec un texte exact.

## Tests
- **Vitest** : la fonction pure `createActions(hasPermission, isOwner)` renvoie les bonnes entrées, par exemple pour un staff limité ou un owner.
- **Manuel** : owner, staff limité, clavier, mode sombre, et une largeur de 320 px.
