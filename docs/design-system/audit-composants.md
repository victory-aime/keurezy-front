# Audit : charte de couleurs et réutilisation des composants

Demande du 2026-10-02 : les écrans ne respectent pas la direction design. Il faut utiliser les composants déjà écrits (boutons, tableaux, badges, tags…), en créer un s'il en manque, et revoir la charte pour les boutons, surtout désactivés.

## Constats : charte (`src/theme`)

| # | Problème | Effet visible |
|---|---|---|
| 1 | Aucun jeton sémantique pour les palettes de la charte (`primary.solid`, `.contrast`, `.fg`, `.subtle`, `.muted`…). `colorPalette="primary"` ne fonctionne donc pas sur les composants Chakra. | Les écrans contournent avec `purple`, `teal`, `red`, `green`, `orange`, `cyan`, hors charte. |
| 2 | Bouton désactivé : fond `gray.200` fixe pour toutes les variantes, pas adapté au mode sombre ; le survol change encore la couleur. | Contour ou discret désactivé = bloc gris plein ; mode sombre = bloc clair ; survol trompeur. |
| 3 | `BaseButton` ne gère pas `ghost` (ni `surface`) : texte blanc sans fond. | Bouton invisible (ex. « Supprimer le brouillon »). |
| 4 | Texte blanc forcé sur toutes les couleurs pleines : jaune (`warning`, `secondary`), turquoise (`tertiary`) et gris (`neutral`, `#C2C7CA`) restent illisibles (contraste < 3:1). Un primaire personnalisé clair a le même problème. | Boutons « neutral », « warning » mal colorés. |
| 5 | `neutral.500` (`#C2C7CA`) plus clair que `neutral.400` : échelle cassée. | Gris neutre trop pâle. |
| 6 | `VariablesColors` désynchronisé de `colors.ts` (danger, success, warning…). | Deux rouges, deux verts dans l'application. |
| 7 | `BaseBadge` change de couleur au survol alors qu'il n'est pas cliquable. | Effet de bouton sur un statut. |

## Constats : composants contournés (`src/app`)

| Composant maison | Remplacé à tort par | Fichiers |
|---|---|---|
| `BaseButton` | `Button` Chakra | 5 |
| (manquant) bouton icône avec info-bulle | `IconButton` + `Tooltip` à la main | 12 (21 usages), plus les actions du tableau |
| `BaseBadge`, `BaseTag` | `Badge`, `Tag` Chakra | 10 |
| `BaseTooltip` | `Tooltip` de `ui/` | 4 |
| `Loader` | `Spinner` | 3 |
| `BaseText` | `Text`, `Heading` | 28 (68 usages) |
| `DataTableContainer` (actions de ligne, chargement, vide) | squelettes, état vide et colonne d'action faits à la main | factures, modèles, historique de facturation… |
| `NoDataFound` / `NoDataAnimation`, `CustomSkeletonLoader` | états vides et squelettes à la main | 13 fichiers |
| Champs `Form*` (Formik) | `Input`, `Textarea`, `NativeSelect`, `Checkbox`, `Switch` | 15 fichiers |

## Plan
1. **Charte** : jetons sémantiques par palette (clair et sombre), contraste du texte calculé (blanc ou foncé), `neutral` corrigé, `VariablesColors` aligné. `BaseButton` : toutes les variantes (`ghost`, `surface` compris), état désactivé par variante sans survol, lisible en mode sombre. `BaseBadge` et `BaseTag` : pas d'effet de survol, couleurs de la charte.
2. **Bouton icône** : nouveau `BaseIconButton` (info-bulle et `aria-label` obligatoires, couleurs de la charte), utilisé partout, y compris dans les actions du tableau.
3. **Badges, tags, boutons, info-bulles, chargement** : remplacement par les composants maison ; palettes hors charte remplacées.
4. **Textes** : `BaseText` partout.
5. **Listes** : `DataTableContainer` (actions de ligne, chargement, vide), `NoDataFound`, `CustomSkeletonLoader`.
6. **Formulaires** : champs `Form*` (Formik) à la place des champs Chakra.

Chaque phase : build, tests, commit. Vérification visuelle dans le navigateur à la fin (clair et sombre).

## Tâches
- [x] Phase 1 : charte et boutons (jetons sémantiques par palette, texte lisible calculé, `neutral` corrigé, désactivé par variante, badges sans survol).
- [x] Phase 2 : `BaseIconButton` (21 usages remplacés, actions de ligne du tableau aux couleurs de la charte ; une colonne d'actions vide n'affiche plus un menu « … » vide).
- [x] Phase 3 : badges, tags, boutons, info-bulles (`BaseTooltip` gagne `disabled`, l'info-bulle maison du menu est supprimée), chargement, notifications aux couleurs de la charte.
- [x] Phase 4 : `BaseText` partout (26 fichiers), `ref` accepté ; rouge des erreurs de formulaire = `danger`.
- [x] Phase 5 : factures et historique de facturation sur `DataTableContainer` (actions de ligne, chargement, vide) ; `CustomSkeletonLoader` partout.
- [x] Phase 6 : Formik et champs `Form*` (envoi, paiement, annulation de facture, questionnaire de départ, codes de secours, réglages de facturation, code promo, recherches, éditeurs de facture et de modèle).

## Composants enrichis (pas de nouveau composant en double)
- `BaseIconButton` (nouveau, il manquait) : icône + info-bulle + `aria-label`, couleurs de la charte.
- `BaseBadge` : `color` libre, contenu libre (`children`), majuscule initiale seulement.
- `BaseTooltip` : `disabled`. `BaseText` : `ref`. `FormDatePicker` : `maxDate`. `FormTextInput` / `FormTextArea` : `inputRef` (insertion au curseur), `rows` ; le texte d'aide de `FormTextArea` s'affiche enfin (il était toujours vide).
- i18n : `nsSeparator: false`, un « : » dans un libellé n'est plus tronqué.

## Exceptions assumées
- Zone de saisie du chat : composeur (Entrée pour envoyer, hauteur automatique), pas un champ de formulaire.
- Choix en cartes avec une description par carte ou une carte indisponible (réservation à facturer, mise en page, police, signature) : `RadioCard` Chakra aux couleurs de la charte ; `BaseRadioCard` n'affiche qu'une description et ne gère pas les cartes indisponibles.
- Composants internes de la bibliothèque (`components/custom`) : ils s'appuient sur Chakra par nature.

## Vérifications
- Tests 113, build OK. Page de contrôle visuel (toutes couleurs × variantes, actives et désactivées, clair et sombre) vérifiée dans le navigateur puis supprimée.
- [ ] Vérification dans le navigateur, connecté : listes (factures, historique), éditeurs de facture et de modèle, dialogues (envoi, paiement, annulation, résiliation, fermeture), menu latéral, mode sombre.
