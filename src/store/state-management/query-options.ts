/**
 * Options d'une requête propre à un élément (détail, impact, conversation…).
 *
 * `rise-core-frontend` applique `placeholderData: keepPreviousData` à toutes les requêtes :
 * utile pour paginer une liste, mais qui affiche brièvement les données de A lors de
 * l'ouverture de B. On le neutralise pour les requêtes indexées par un identifiant.
 */
export const ENTITY_QUERY_OPTIONS = { placeholderData: undefined } as const;
