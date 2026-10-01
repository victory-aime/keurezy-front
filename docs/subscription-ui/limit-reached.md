# Module `limit-reached` : blocage des créations au-delà du plan

> Demande du 2026-10-01. Décisions validées le même jour. Spec, plan et tâches réunis (petit module).

## Objectif
Quand une fonctionnalité limitée est utilisée à 100 %, par exemple après un downgrade Premium → Standard ou Basic, les boutons « Ajouter » n'ouvrent plus le formulaire. Ils ouvrent un pop-up « limite atteinte ».

## Règles
- **Concerné** : biens, terrains et bâtiments (`manage_properties`), annonces (`publish_properties`), invitations de membres (`manage_users`).
- **Points d'entrée** : bouton « Ajouter » des listes, menu « Créer » de l'accueil, « Ajouter un bien » du détail d'un bâtiment. La modification d'un élément existant n'est pas concernée.
- **Pop-up pour tous** : « Vous utilisez X sur Y … de votre plan ».
  - L'owner a un bouton « Changer de plan ».
  - Le staff est invité à contacter le propriétaire.
- **Aperçu du plan supérieur**, seulement pour une agence **sans historique de paiement** (aucun paiement payé autre que l'inscription). C'est le plus petit plan qui lève la limite. L'aperçu montre son nom, son prix mensuel, sa nouvelle limite et ce qu'il apporte en plus. Avec un historique, le pop-up s'affiche sans cet aperçu.
- **Le backend reste la barrière** : les créations au-delà de la limite sont déjà refusées. Le pop-up évite seulement de remplir un formulaire pour rien.

## Contrat
`GET secured/agency/subscription/limits?agencyId` (owner **et** staff de l'agence) :
`{ plan: { id, name }, usage: FeatureUsage[], hasPaymentHistory: boolean }`

Mêmes compteurs que la page abonnement. Aucun prix ni montant payé n'est renvoyé.

## Tâches
- [x] T1 [back] : route `limits` (+ tests : membre de l'agence OK, autre agence refusée, historique = paiement payé hors inscription).
- [x] T2 : `useFeatureGuard(feature)` et `LimitReachedModal` (aperçu calculé depuis le catalogue public des plans).
- [x] T3 : branchement sur les points d'entrée listés.
- [x] Tests (back 316, front 71) et builds OK ; audit ci-dessous.
- [ ] Vérification manuelle : Mobelite (historique de paiement simulé, donc pop-up sans aperçu) et une agence sans historique (avec aperçu).

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Contournement du pop-up (URL directe du formulaire, appel API) | Sans effet sur les quotas : le backend refuse toute création au-delà de la limite (`*_CAPACITY_REACHED`). Le pop-up n'est qu'un confort. |
| 2 | Données exposées au staff | `limits` ne renvoie que le plan, les compteurs et un booléen d'historique. Ni prix payé ni transaction ; les prix de l'aperçu viennent du catalogue public. |
| 3 | IDOR | `agencyAccessControl` (identité de session) : une autre agence est refusée, testé. |
| 4 | Dépendances, secrets | Aucun ajout. |

## Alerte à 80 % (C4, plan de clôture)

> Décisions du 2026-10-01 : alerte dès 80 % d'une fonctionnalité limitée, **une fois par session et par fonctionnalité** ; « Continuer » lance l'action demandée ; à 100 %, le blocage ci-dessus reste.

### Contrat de design
- **But de l'écran** : prévenir sans bloquer. L'action principale est **« Continuer »** (bouton plein) ; « Voir les plans » (owner) est secondaire ; la croix ferme sans rien lancer.
- **Contenu** : titre « Bientôt à la limite de votre plan », icône d'information orange (le cadenas reste réservé au blocage) ; phrase d'usage ; jauge orange « 16 biens sur 20 », pourcentage, et « Après cet ajout, il en restera 3. » (« Cet ajout utilisera votre dernière place. » au dernier) ; aperçu du plan supérieur selon la même règle d'historique que le blocage.
- **Staff** : même alerte, sans « Voir les plans », avec un texte qui renvoie vers le propriétaire.
- **Rejeté** : une alerte à chaque clic (lassante), un toast (trop discret pour un choix), un blocage à 80 %.

### Implémentation
- `useFeatureGuard` : état `NEAR_LIMIT` du backend (même seuil que la page abonnement) → l'action est mise en attente et lancée par « Continuer ». Mémoire de session : `sessionStorage` (`keurezy:near-limit-seen`), repli en mémoire si le stockage est indisponible.
- `LimitReachedModal` : mode « bientôt atteinte » quand `onContinue` est fourni (aperçu partagé avec le blocage).
- Tests : `remainingAfterAdd`, mémoire par fonctionnalité, `isFreePlan`.

### Revue accessibilité
- Dialogue Chakra (focus piégé, Échap, croix nommée). Jauge `Progress` avec `aria-label` (« 16 biens utilisés sur 20 »), valeur aussi écrite en texte : l'information ne repose pas sur la couleur.
- Ordre des boutons : secondaire puis principal, comme les autres pop-ups.

### Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Contournement | Sans effet : l'alerte ne bloque rien, et le backend refuse toujours au-delà de 100 %. |
| 2 | Stockage de session | Ne contient que des noms de fonctionnalités, aucune donnée de l'agence. |
| 3 | Dépendances | Aucun ajout. |

- [ ] Vérification manuelle : agence à 80 % d'une fonctionnalité (ex. Standard avec 16 biens sur 20) ; l'alerte ne revient pas au second clic de la session.
