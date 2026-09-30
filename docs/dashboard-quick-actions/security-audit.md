# Audit de sécurité : `dashboard-quick-actions`

> Réalisé le 30/09 (skill `security-and-hardening`).

- **Navigation seulement** : le bouton « Créer » ne fait qu'ouvrir des pages. Aucune donnée n'est lue ni écrite.
- **Masquage ≠ autorisation** : les entrées sont filtrées par les permissions de la session pour l'ergonomie. Chaque route cible reste protégée côté backend, par `@RequirePermission` sur la création de bien, d'annonce, de visite et d'invitation. Un utilisateur qui saisit l'URL à la main reçoit toujours un 403.
- **Correction de cohérence** : l'ancien bloc proposait « Ajouter un membre » et « Ajouter un bâtiment » à tout le monde. Un staff sans permission tombait alors sur un 403.
- Aucun secret, aucune donnée personnelle, aucune dépendance ajoutée.
