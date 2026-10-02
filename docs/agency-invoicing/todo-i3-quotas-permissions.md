# Todo I3 : quotas, permissions et menu

Spec : [spec.md](./spec.md), règles « Quotas (I3) ». Demande du 2026-10-02 : passer à I3, réorganiser le menu et ses icônes, proposer une solution pour le logo et le cachet sur Cloudinary, et protéger par une permission les routes sensibles qui n'en ont pas.

## Quotas de facturation
- Fonctionnalités commerciales (catégorie `INVOICING`, migration 24) :
  - `manage_invoices` : factures **émises** par mois civil. Gratuit 5, Débutant 30, Standard 150, Entreprise illimité. Une facture annulée compte quand même.
  - `invoice_templates` : modèles propres à l'agence. Gratuit 0, Débutant 1, Standard 3, Entreprise illimité.
- Contrôle à l'émission **dans la transaction** qui prend le numéro (le verrou du compteur sérialise les émissions de l'agence) : deux émissions simultanées ne dépassent pas la limite.
- Modèles : création et personnalisation refusées à la limite ; après un downgrade, les modèles en trop restent utilisables et visibles, mais ne se modifient plus. Ces deux quotas ne passent pas par le choix « éléments à garder » d'un downgrade (rien à désactiver).
- Jauges sur la page Abonnement, alerte à 80 % et pop-up de limite sur « Émettre » et « Nouveau modèle ».

## Permissions
- Garde : option `staffOnly` pour les routes partagées avec les clients (détail d'une visite) : la permission ne s'impose qu'au staff (`AGENT`) ; un client y accède comme avant, limité à ses données par le service.
- Nouvelles permissions :
  - `view_invoices` (liste, détail, PDF, modèles en lecture, réservations à facturer) et `manage_invoices` (créer, modifier, émettre, payer, annuler) ;
  - `update_agency` (modifier le profil de l'agence : nom, logo, description, coordonnées), fonctionnalité `manage_agency`.
- Permissions existantes jusqu'ici jamais vérifiées, désormais exigées :
  - `view_visits` (détail d'une visite, staff seulement) ;
  - `view_reports` (statistiques de l'agence).
- Fonctionnalités non commerciales ajoutées à tous les plans pour que leurs permissions soient attribuables au staff (jusqu'ici impossible) : `manage_visits`, `manage_invitations`, `manage_property_types`, `manage_agency`.
- Messagerie : déjà protégée par le service, en base et jusque dans le WebSocket (`view_conversations`, `reply_conversations`, « répondre » vaut « lire ») ; pas de garde en plus (elle refuserait à tort un membre qui n'a que « répondre »).
- Intégrations (Google Drive) : rattachées au compte de chaque utilisateur, pas à l'agence ; pas de permission d'agence.
- Déjà réservé au propriétaire par le service (inchangé) : abonnement, équipe (statut, permissions, retrait, 2FA), informations légales, fermeture de l'agence, écriture des modèles et du cachet.

## Logo et cachet : images figées
- Problème : une facture émise renvoie à l'URL Cloudinary du logo et du cachet. Supprimer ou remplacer l'image côté Cloudinary changerait (ou casserait) une facture déjà émise.
- Solution retenue : à l'émission, les images sont **copiées en base** dans `invoice_asset`, identifiées par leur empreinte SHA-256 (une même image n'est stockée qu'une fois, quel que soit le nombre de factures). Le PDF d'une facture émise ne lit plus Cloudinary.
- Conséquences : l'ancien cachet est supprimé de Cloudinary quand il est remplacé ou retiré (plus de fichier orphelin) ; le rendu d'une facture émise ne dépend plus du réseau.

## Menu
- Groupes : Accueil (Tableau de bord, Messages, Notifications) ; Patrimoine (Propriétés, Bâtiments, Terrains, Annonces) ; Activité (Réservations, Rendez-vous) ; Facturation (Factures, Modèles de facture) ; Équipe (Collaborateurs, Invitations) ; Agence (Mon agence, Abonnement, Intégrations) ; Compte (Mon profil, Sécurité).
- Un seul jeu d'icônes (Lucide, `NavIcons`) et une icône distincte par lien et par groupe (plus de doublons Calendrier, Maison ou Utilisateurs).
- Factures et Modèles de facture : visibles du staff avec `view_invoices` ; Factures grisé si le plan ne l'inclut pas.

## Tâches
- [x] Migration 24 et seed : catégories, fonctionnalités, permissions, limites par plan.
- [x] Quotas : compteurs, contrôle à l'émission et sur les modèles, jauges.
- [x] Garde `staffOnly` et permissions sur les routes listées ; tests.
- [x] `invoice_asset` : copie des images à l'émission, rendu depuis la base, suppression de l'ancien cachet sur Cloudinary.
- [x] Web : constantes de permissions, libellés (fonctionnalités, catégories), menu réorganisé, gardes de quota, accès du staff aux pages de facturation, actions masquées sans permission.
- [x] Tests, builds, revue, audit.

## Vérifications
- Tests : back 417, web 97 ; builds OK.
- Base de dev (Mobelite, plan Gratuit) : 1 facture déjà émise ce mois, puis 4 émissions acceptées et la suivante refusée (`INVOICE_CAPACITY_REACHED`) ; jauges « Factures 5/5 » et « Modèles 2/0 » (au-delà après le passage au Gratuit : visibles, non modifiables). Copie figée en version 2 ; aller-retour binaire des images vérifié. Essai nettoyé, compteur de Mobelite rétabli à son dernier rang (`FAC-2026-0001`).
- [ ] Vérification dans le navigateur (menu, staff sans permissions, quotas).

## Audit de sécurité
| # | Point | Résultat |
|---|---|---|
| 1 | Dépassement du quota en concurrence | Comptage dans la transaction d'émission, après le verrou de la ligne du compteur : les émissions d'une agence passent une à une (testé). |
| 2 | Contournement par annulation | Le quota compte les factures émises dans le mois, annulées comprises. |
| 3 | Staff sans permission | Lecture des factures et modèles : `view_invoices` ; écriture : `manage_invoices` ; profil de l'agence : `update_agency` ; statistiques : `view_reports` ; détail d'une visite : `view_visits`. Le menu et les boutons suivent, le backend reste la protection. |
| 4 | Clients sur les routes partagées | `staffOnly` : un client n'est pas bloqué par le garde, le service ne lui montre que ses données (testé). |
| 5 | Images d'une facture émise | Copiées en base à l'émission (empreinte SHA-256, dédoublonnées), relues sans réseau ; l'ancien cachet peut être supprimé de Cloudinary sans effet sur les factures (testé). Seul un identifiant d'URL Cloudinary est accepté pour la suppression. |
| 6 | Volume de `invoice_asset` | Images de 2 Mo au plus, une seule copie par image quelle que soit le nombre de factures. |

## Retours du 2026-10-02 (après vérification)
- [x] **Modules d'un plan supérieur** : lien masqué dans le menu (plus grisé) ; page protégée par `PlanFeatureGate` si l'URL est saisie directement (écran « non incluse dans votre plan », « Voir les plans » pour l'owner). Une limite à 0 vaut « non incluse » (ex. Collaborateurs et Invitations au plan Gratuit). La page est trouvée par le lien du menu au plus long préfixe (testé) ; Statistiques exige `view_reports`.
- [x] **« Non inclus » en double** au changement de plan (Gratuit : collaborateurs et modèles à 0) : une limite à 0 n'affiche plus de ligne ; dans les écarts entre plans elle vaut « absente », une seule ligne « … non inclus » par fonctionnalité (testé).
- [x] **Utilisation** : plus de jauge pour une limite à 0 (modèles personnalisés au Gratuit).
- [x] **Fonctionnalités de votre plan** : seulement celles que le plan inclut (plus de cadenas).
- [x] **Permissions en double** : les fonctionnalités d'un même module (Facturation, Équipe, Annonces…) sont fusionnées, chaque permission n'apparaît qu'une fois, un module vide n'est pas affiché (testé). Nouveau sélecteur en arbre, sans menu déroulant : cocher un module coche toutes ses permissions, en cocher une partie le rend indéterminé ; compteur « 2/3 » ; libellés lisibles (description de la permission) ; récapitulatif aligné.
- [x] **Menu** : l'icône s'anime au survol d'un lien (coupée si le système réduit les animations).

## Modules verrouillés avec aperçu animé (2026-10-02)
- [x] Maquette validée : https://claude.ai/artifact/EnvLUmVvjf8X9JZ7QKtcpv
- [x] Un lien de module hors plan qui a un aperçu (`preview`) reste dans le menu, grisé avec un cadenas ; sans aperçu il est masqué. La page reste protégée par `PlanFeatureGate`.
- [x] Carte (HoverCard Chakra) au survol, au focus clavier et au toucher ; fermée en quittant le lien ou avec Échap : nom du module, plan le moins cher qui l'inclut (calculé depuis le catalogue public, testé), aperçu animé en boucle (coupé si le système réduit les animations), une phrase d'accroche, « Voir les plans » (ouvre le changement de plan sur ce plan) pour l'owner, invitation à demander au propriétaire pour le staff.
- [x] Aperçus : Collaborateurs et Invitations (équipe, permissions, invitation envoyée) ; Statistiques (barres et courbe), page remise dans le menu (groupe Analyse, `view_reports`).
- [ ] Reste à faire si souhaité : la page Statistiques est encore sommaire (biens, visites, tickets) ; « Mises en avant » n'a pas encore de page, donc pas de lien.
