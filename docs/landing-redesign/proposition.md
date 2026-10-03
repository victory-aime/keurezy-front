# Proposition : refonte de la page d'accueil

> Demande du 2026-10-03. Proposition à valider avant toute implémentation.

## 1. Constat sur la page actuelle

La page (`src/app/page.tsx`) empile 8 sections :
- Hero ;
- « Pourquoi Keurezy » ;
- Espace locataire ;
- Espace propriétaire ;
- Proposition de valeur ;
- Comment ça marche ;
- Tarifs ;
- CTA.

### Problèmes bloquants (crédibilité)

| Où | Problème |
|---|---|
| Hero, `StatBlock` | Chiffres inventés : « 2 500+ propriétés », « 98 % de satisfaction », « €50M+ loyers collectés ». En euros, alors que le produit facture en XOF. |
| Hero, maquette | Montants en €, URL fictive `my-immo.dashboard.app`, couleurs brutes (`red.400`, `purple.400`, `gray.500`) au lieu des jetons du thème. |
| « Pourquoi Keurezy » | « Chiffrement de bout en bout » : c'est faux. |
| Espace locataire | Promet des fonctions absentes du web : paiement du loyer en ligne, demandes de maintenance, bail numérique. Le bouton locataire est d'ailleurs commenté. |
| CTA | « Des milliers d'utilisateurs » : affirmation invérifiable. |

### Problèmes de fond

- **Message flou.** Le titre parle de « gestion locative intelligente pour tous » et le bouton dit « Je suis propriétaire ». Or l'inscription crée une **agence**. La cible réelle, ce sont les agences immobilières et leurs équipes.
- **Redondance.** Les sections « Pourquoi », « Propriétaire », « Locataire » et « Proposition de valeur » répètent les mêmes listes : quatre grilles de 6 cartes, toutes construites de la même façon.
- **Arguments génériques.** « Ultra rapide », « Mobile-first », « Accessible partout » : n'importe quel SaaS peut le dire. Ce qui distingue vraiment Keurezy n'apparaît nulle part : disponibilités automatiques, agence vérifiée, paiement local, facturation, messagerie.
- **Incohérences techniques.**
  - La page entière est `'use client'` : pas de métadonnées propres à la page, et un SEO faible.
  - Les tarifs utilisent `PlanCard`, alors que l'onboarding et le tableau de bord partagent désormais `PlanChooser`.
- **Il manque :**
  - une FAQ ;
  - un lien vers une politique de confidentialité (le lien du pied de page mène à une 404) ;
  - une mention de l'application mobile côté clients.

## 2. Ce que Keurezy fait vraiment (les vrais arguments)

Tout ce qui suit existe déjà dans le produit.

1. **Tout le parc dans un seul espace.**
   - Types de biens : propriétés, immeubles, terrains.
   - Annonces publiées.
   - Quatre modes de location (journalière, nocturne, mensuelle, annuelle), chacun avec son prix.
2. **Disponibilités calculées automatiquement.** Une réservation confirmée découpe la période libre. Une demande en attente ne bloque pas le calendrier, et il n'y a jamais deux réservations confirmées sur le même créneau. **C'est l'argument signature.**
3. **Prospects, visites et messagerie.**
   - Suivi des leads et rendez-vous de visite.
   - Messagerie en temps réel : envoyé, distribué, lu, et indicateur de saisie.
   - Notifications push.
4. **Facturation.** Factures, modèles personnalisables, reçus PDF.
5. **Équipe et rôles.** Invitations, permissions par rôle, double authentification avec codes de secours.
6. **Agence vérifiée.** Statuts, NINEA et RCCM sont contrôlés par Keurezy. Le badge rassure les clients.
7. **Pensé pour le Sénégal.**
   - Prix en XOF.
   - Paiement local via NabooPay.
   - Interface en français.
8. **Abonnement honnête.**
   - Plan gratuit, sans engagement.
   - Changement de plan au prorata, à tout moment.
   - Codes promo.
9. **Statistiques** de l'activité de l'agence.
10. **Application mobile pour les clients** : chercher un bien, réserver, échanger avec l'agence.

## 3. Nouvelle structure proposée

Dix blocs, une idée par bloc, aucun chiffre inventé.

| # | Bloc | Contenu | Réutilise |
|---|---|---|---|
| 0 | **Barre de navigation** | Ancres « Fonctionnalités · Tarifs · FAQ », « Se connecter », « Créer mon agence ». Barre collante, qui se densifie au défilement. | `NavBar` existant |
| 1 | **Hero** | Titre : « Votre agence immobilière, pilotée depuis un seul espace. » Sous-titre : biens, réservations, prospects et factures, sans Excel ni groupes WhatsApp. Bouton principal « Créer mon agence gratuitement », bouton secondaire « Voir les offres » (ancre). Rassurance : *Plan gratuit · Sans engagement · Prix en XOF*. À droite, maquette du tableau de bord en XOF. | `DashboardMockup` de l'onboarding, identique |
| 2 | **Bande « Pensé pour vous »** | Quatre pastilles factuelles : *Prix en XOF*, *Paiement local NabooPay*, *Agence vérifiée NINEA / RCCM*, *100 % en français*. Elle remplace les fausses statistiques. | — |
| 3 | **Avant / après** | Trois douleurs, trois réponses. « Double réservation » → calendrier automatique. « Prospects perdus dans WhatsApp » → messagerie et suivi. « Factures sur Word » → facturation intégrée. | — |
| 4 | **Fonctionnalités par onglets** | `BaseTabs` vertical : à gauche 5 onglets, à droite une illustration et 3 puces. Onglets : *Biens & annonces*, *Réservations & disponibilités*, *Prospects & messagerie*, *Facturation*, *Équipe & sécurité*. Il remplace 4 sections redondantes. | `BaseTabs` vertical (page Agence) |
| 5 | **Focus signature : les disponibilités** | Frise animée : une période 01/08 → 30/08 ; une réservation 05/08 → 10/08 se pose et la frise se découpe en 01/08 → 04/08 et 11/08 → 30/08. Accroche : « Le calendrier se met à jour tout seul. » | — |
| 6 | **Confiance : agence vérifiée** | Badge « Agence vérifiée » mis en scène, avec les 3 pièces contrôlées et ce que le client voit. | Style de `VerificationNote` |
| 7 | **Côté clients : l'app mobile** | Maquette de téléphone : recherche, réservation, discussion avec l'agence. Badges stores, avec « Bientôt disponible » tant que l'app n'est pas publiée. | — |
| 8 | **Comment ça marche** | Les 3 vraies étapes de l'inscription : créez votre compte et vérifiez l'e-mail ; présentez votre agence ; choisissez votre plan, gratuit possible. | — |
| 9 | **Tarifs** | Même sélecteur que l'onboarding et le tableau de bord. Un clic sur un plan mène à l'onboarding avec ce plan présélectionné, comme aujourd'hui. Mention : « Un code promo ? Vous le saisirez à l'inscription. » | `PlanChooser` (remplace `PlanCard`) |
| 10 | **FAQ** | Environ 6 questions : *Le plan gratuit est-il vraiment gratuit ?*, *Puis-je changer de plan ?*, *Quels moyens de paiement ?*, *Pourquoi faire vérifier mon agence ?*, *Mes données sont-elles protégées ?*, *Mes clients doivent-ils payer ?* | `components/custom/accordion` |
| 11 | **CTA final + pied de page** | « Lancez votre agence sur Keurezy aujourd'hui. » Pied de page : CGU, confidentialité, contact. | `Footer` |

## 4. Direction visuelle

- **Couleurs : uniquement les jetons du thème** (`primary`, `tertiary`, `fg.muted`, `bg.subtle`, couleurs de graphique). Plus de `red.400` ni de `gray.500` en dur.
- **Moins de décor.**
  - On supprime les taches floues et les dégradés multiples du CTA.
  - On garde un seul accent : le mot clé du titre.
- **Rythme.** On alterne des sections pleine largeur sur `bg` et `bg.subtle`, pour éviter l'effet « mur de cartes identiques ».
- **Animations avec un but.**
  - La frise des disponibilités se découpe.
  - Les onglets changent d'illustration en fondu.
  - Les sections apparaissent au défilement, une seule fois.
  - Tout est coupé si l'utilisateur a choisi « réduire les animations ».
- **Mobile d'abord.**
  - Les onglets deviennent un accordéon sous 768 px.
  - La maquette du hero passe sous le texte.
  - Les boutons prennent toute la largeur.

## 5. Technique

- `page.tsx` devient un **composant serveur** avec ses propres `metadata` (titre, description, Open Graph). Seuls les blocs animés restent `'use client'`.
- Chaque bloc est un fichier dans `src/app/components/landing/`, avec du contenu typé dans un fichier de constantes.
- **Supprimés :** `TenantSection`, `OwnerSection`, `ValueProposition`, l'ancien `FeatureSection`, `pricing/PlanCard` s'il n'est plus utilisé, et les blocs `StatBlock`.
- Le chargement des offres affiche un squelette ; s'il échoue, on affiche un lien « Voir les offres » vers l'onboarding.
- **Accessibilité :**
  - un seul `h1` ;
  - les ancres sont focalisables ;
  - les onglets et l'accordéon sont accessibles au clavier ;
  - le contraste est au niveau AA.

## 6. Découpage proposé

1. Hero, bande « Pensé pour vous », navigation : suppression des fausses statistiques. Ce lot peut partir seul, tout de suite.
2. Fonctionnalités par onglets, et suppression des 4 sections redondantes.
3. Frise des disponibilités et bloc « Agence vérifiée ».
4. Tarifs via `PlanChooser`, plus FAQ.
5. App mobile, CTA final, pied de page, métadonnées SEO.

Chaque lot est vérifié dans le navigateur, puis commité.

## 7. Décisions (2026-10-03)
- **Avis clients** : aucun pour l'instant.
- **App mobile** : en cours de développement. Le bloc montre des maquettes de téléphone réalistes (recherche, fiche d'un bien, messagerie) et des boutons de stores marqués « Bientôt ».
- **Paiement** : on affiche Wave, Orange Money et Mobile Money. NabooPay n'est pas cité sur la page d'accueil.
- **Politique de confidentialité** : une page séparée, `/privacy-policy`, liée depuis le pied de page. Texte à faire relire par un juriste.
- **Cible** : les agences, aujourd'hui. Les petits commerces et propriétaires de quelques biens apparaissent dans un bloc « Pour qui ? » avec l'étiquette « Bientôt disponible » ; leurs fonctionnalités dédiées viendront plus tard.

Ces décisions ajoutent un bloc « Pour qui ? » juste après la bande factuelle.

## Réalisé
Les cinq lots ont été livrés ensemble.

- [x] **Structure.** `page.tsx` est un composant serveur avec ses métadonnées (titre, description, Open Graph). Les blocs sont dans `src/app/components/landing/`, le contenu typé dans `content.ts`.
- [x] **Hero.** Maquette du tableau de bord de l'onboarding (montants en XOF, format stable entre serveur et client), avec deux notifications flottantes : réservation confirmée, paiement Wave.
- [x] **Bande factuelle**, **Pour qui ?** (petits commerces : « Bientôt disponible ») et **Avant / après**.
- [x] **Fonctionnalités** : 5 onglets verticaux, chacun avec un aperçu d'écran ; accordéon sur mobile.
  - `BaseTabs` n'est pas utilisable sur une page publique : son conteneur lit le thème de l'agence connectée. Les onglets sont donc propres à la page d'accueil.
- [x] **Frise des disponibilités** : elle se déroule à l'apparition, avec un bouton « Rejouer ». Si les animations sont réduites, l'état final s'affiche directement.
- [x] **Agence vérifiée** : fiche publique de l'agence avec le badge.
- [x] **Application mobile** : deux téléphones dessinés en code (recherche et fiche d'un bien, messagerie avec accusés de lecture et indicateur de saisie), et boutons de stores « Bientôt ».
- [x] **Étapes, tarifs, FAQ, CTA final.**
  - Les tarifs utilisent `PlanChooser`, comme l'onboarding.
  - Choisir un plan ne redirige plus immédiatement : les flèches du clavier changent la sélection. Un bouton « Commencer avec ce plan » mène à l'onboarding.
- [x] **Navigation** : ancres Fonctionnalités, Tarifs et FAQ ; bouton de menu accessible ; fond suivant le thème.
- [x] **Pied de page** : liens réels (CGU, confidentialité, compte).
- [x] **Page `/privacy-policy`** : politique de confidentialité v1.0, 10 sections. Elle partage avec les CGU le composant `LegalDocument`.
- [x] **Supprimés** :
  - `HeroSection`, `FeatureSection`, `TenantSection`, `OwnerSection`, `ValueProposition`, `HowItWork`, `PrincingSection`, `CTASection` ;
  - `PlanCard`, `BillingCycleToggle` et leurs types ;
  - les fonctions de tarification inutilisées.
- **Vérifié dans le navigateur** :
  - bureau en thème sombre et clair, et mobile en 375 px, sans débordement horizontal ;
  - onglets, frise et sélection d'un plan ;
  - page de confidentialité, accessible sans être connecté.
- **Tests et build** : 116 tests, build OK.

### Sécurité
- Le contenu est statique : aucune saisie utilisateur, aucun HTML injecté. Les liens sont internes, sans nouvelle dépendance.
- Seul appel réseau : la liste publique des plans, en lecture. L'identifiant du plan placé dans l'URL de l'onboarding vient de l'API ; l'onboarding le revérifie contre la liste des plans.
- Aucune donnée personnelle n'est collectée sur la page, et aucun traceur n'est ajouté. C'est cohérent avec la section « Cookies » de la politique de confidentialité.

### Constaté, hors périmètre
- Erreur d'hydratation présente sur toutes les pages : le script de thème injecté par `ColorModeProvider` (next-themes). Elle peut afficher brièvement le mauvais logo, clair ou sombre.
- Clés React manquantes dans `CustomSkeletonLoader`.
- `FloatContactUs` et `ThinkBoxModal` ne sont plus utilisés nulle part.

### À faire de ton côté
- Compléter dans la politique de confidentialité l'identité de l'éditeur et l'adresse de contact, puis la faire relire, comme les CGU.
- Remplacer les maquettes mobiles par de vraies captures et activer les liens des stores à la publication de l'application.

## Itération 2 (2026-10-03)
### Corrections
- [x] **Hydratation.** Les deux causes sont corrigées.
  - **Styles Emotion écrits en ligne pendant le rendu serveur.** Un registre Emotion (`components/ui/emotion-registry.tsx`) collecte désormais les styles et les injecte dans le `<head>`. Cela demande `@emotion/cache`, ajouté en dépendance directe : même version, déjà présente via `@emotion/react`.
  - **`<script>` de next-themes rendu côté client avec React 19.** Côté client, il devient inerte (`type="text/plain"`).
- [x] **Thème clair ou sombre.** `useColorMode().colorMode` renvoyait `"system"` quand l'utilisateur suit son appareil. Les 40 comparaisons `colorMode === 'light'` se trompaient alors, d'où par exemple le mauvais logo.
  - Le hook renvoie maintenant le thème appliqué, avec une valeur fixe jusqu'à l'hydratation pour éviter tout écart serveur/client.
  - `colorPreference` garde le choix brut (`system` compris), pour le sélecteur d'apparence du profil.
- [x] **Logos.** Nouveau composant `BrandLogo` dans `components/custom`, utilisé aux 5 endroits.
  - Les deux versions du logo sont rendues et la bonne est choisie en CSS (`_dark`), avec ses vraies proportions.
- [x] **Clés manquantes** dans `CustomSkeletonLoader`.
- [x] **Code mort supprimé** : `FloatContactUs`, `ThinkBoxModal`, `onboarding/constants/style.ts`.

### Maquettes
- [x] **Tableau de bord**, partagé avec l'onboarding avec la même API. Il reprend l'écran réel :
  - navigation par groupes (Accueil, Patrimoine, Activité, Facturation) ;
  - indicateurs Propriétés, Revenus du mois, Taux d'occupation, Réservations ;
  - courbe des revenus mensuels animée ;
  - occupation par type ;
  - activité récente.
- [x] **Application mobile** : trois écrans au lieu de deux.
  - Recherche au premier plan, réservation à gauche, messagerie à droite.
  - L'écran de réservation montre un calendrier d'août 2026 : dates réservées barrées, séjour choisi, total, « Demander la réservation ».
  - Châssis plus réaliste : boutons latéraux, reflet de la vitre, illustrations enrichies.

### Vidéo motion design
- [x] **`PromoVideo`** : 9:16, 19,5 s, animée en code (aucun fichier à charger), aux couleurs de la charte (violet #673AB6, or #E7B008, turquoise #00B3A8) et avec le vrai logo.
- [x] **Sept scènes** : logo et promesse ; le problème (Excel, WhatsApp, carnets, Word) ; biens et annonces ; réservations sans double location ; prospects et messagerie ; paiement Wave, Orange Money, Mobile Money et factures ; CTA « Créer mon agence gratuitement ».
- [x] **Lecteur** :
  - lecture automatique à l'apparition, sauf si l'utilisateur a choisi de réduire les animations ;
  - pause, reprise et « Rejouer » ;
  - progression par scène, façon story.
- [x] **Section « Keurezy, c'est quoi ? »** placée sous la bande factuelle, et bouton « Voir la vidéo · 20 s » dans le hero.
- [x] **Route `/promo`** (non indexée) : la vidéo seule, plein écran, sans commandes, à enregistrer pour les réseaux sociaux.
  - Pas de ffmpeg ni de Chrome sans interface sur la machine : pas d'export MP4 automatique.
- **Adresse affichée à la fin** : `keurezy.onrender.com`, l'URL publique actuelle, définie dans la constante `PROMO_URL`. À remplacer par le nom de domaine définitif.
- **Vérifié dans le navigateur** :
  - bureau et mobile en 375 px, sans débordement ;
  - les 7 scènes ;
  - `/promo` en 540 × 960 ;
  - aucune erreur console au chargement à froid.
- **Tests et build** : 116 tests, build OK.

### Enregistrer la vidéo en MP4
1. Ouvrir `/promo` dans une fenêtre de navigateur haute, et lancer l'enregistrement d'écran (QuickTime : Fichier › Nouvel enregistrement de l'écran, zone sélectionnée sur la vidéo).
2. Cliquer sur « Démarrer ». Un double-clic sur la vidéo la rejoue.
3. Recadrer et exporter en 1080 × 1920.

Autre option : installer ffmpeg pour automatiser l'export.
