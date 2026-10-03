# Spec : inscription, finitions et conditions d'utilisation

> Demande du 2026-10-03, à la suite de l'inscription « compte d'abord ».

## Changements
1. **Étape 2 (vérification de l'e-mail) animée.** Les animations ont un but : montrer qu'un e-mail vient de partir, et guider vers la saisie du code.
   - Enveloppe qui arrive, avec des ondes qui se propagent.
   - Carte du code qui apparaît en glissant.
   - Animations coupées si « réduire les animations » est activé.
2. **Reprise après connexion.** Un compte sans agence (inscription interrompue) qui se connecte voit une fenêtre : « Votre inscription n'est pas terminée ». Elle propose :
   - **Poursuivre mon inscription** : retour à l'étape où il s'était arrêté ;
   - **Me déconnecter**.

   Il n'y a plus de redirection brusque.
3. **Pas de retour impossible.** Une fois le compte créé et l'e-mail vérifié, les étapes « Compte » et « Vérification » sont franchies côté serveur.
   - Le bouton « Précédent » est masqué quand il n'y a pas d'étape précédente accessible, et à l'étape finale.
   - À l'étape 1 sans compte, il ramène à l'accueil, comme avant.
4. **Étape 3 allégée.** On demande seulement :
   - le nom de l'agence ;
   - l'e-mail ;
   - le téléphone ;
   - l'adresse ;
   - l'acceptation des conditions.

   Ce qui est retiré, ou déplacé :
   - **Description** : facultative, elle se complète plus tard sur la page Agence. Le backend ne l'exige plus.
   - **Documents** : retirés de l'inscription. Les pièces justificatives (statuts, NINEA, RCCM) se joignent sur la page Agence, onglet « Informations légales », et conditionnent la vérification.
   - **Disposition** : formulaire en deux colonnes. À côté, l'aperçu du tableau de bord et une carte « Et ensuite ? » (vérification, documents à préparer).
5. **Conditions générales d'utilisation de Keurezy.**
   - Page publique `/terms-and-conditions`, versionnée et datée, avec un sommaire.
   - Elle couvre : objet, comptes, agences, abonnements et paiements, codes promo, contenus, données personnelles, responsabilité, résiliation et fermeture, droit applicable.
   - La case de l'étape 3 renvoie vers cette page, dans un nouvel onglet.
   - **Texte à faire relire par un juriste avant la mise en production.**

## Hors périmètre
- Une page « Politique de confidentialité » séparée : les données personnelles sont traitées dans une section des CGU.
- L'enregistrement de la version des CGU acceptée (aujourd'hui, un booléen `acceptTerms`).

## Réalisé
- [x] Étape 2 animée (enveloppe qui se pose, ondes, carte du code qui glisse), coupée si « réduire les animations ».
- [x] Fenêtre « Votre inscription n’est pas terminée » après connexion : « Poursuivre mon inscription » ou « Me déconnecter ». Elle ne se ferme que par ses boutons.
- [x] « Précédent » masqué quand aucune étape précédente n’est accessible, et à l’étape finale.
- [x] Étape 3 : nom, e-mail, téléphone, adresse et conditions, en deux colonnes, avec une carte « Et ensuite ? ». Plus de documents ni de description (description facultative côté backend, commit `990e555`).
- [x] Page `/terms-and-conditions` : CGU version 1.0, sommaire, 12 sections, liée depuis l’étape 3 et le pied de page. Elle n’existait pas : le lien du pied de page menait à une 404.
- Rendu vérifié dans le navigateur (CGU, étapes 2 et 3), sur une page de contrôle supprimée ensuite. Tests 116, build OK.

## À faire de ton côté
- Compléter dans les CGU les mentions de l’éditeur (raison sociale, NINEA, RCCM, siège) et l’adresse de contact, puis faire relire le texte.
- Tester connecté : inscription interrompue, puis connexion (fenêtre), puis reprise.

## Itération 2 (2026-10-03)
- [x] **Étape 4.** Elle utilise le même `PlanChooser` que le changement de plan du tableau de bord, donc les mêmes correctifs : bascule mensuel/annuel, cartes radio accessibles, plans triés par prix, limites lisibles.
  - `PlanChooser` accepte maintenant l'absence de plan actuel (ni comparaison, ni étiquette « Plan actuel »), et un emplacement `beforeCards`.
  - L'ancienne grille de l'inscription (`BaseCheckBoxCard`) est retirée de cette étape.
- [x] **Code promo visible.** Une barre de récapitulatif collante, placée entre la bascule et les cartes, affiche le plan choisi et son prix.
  - Pour un plan payant, le champ « Code promo » est sur la même ligne.
  - Code accepté : prix barré, nouveau prix en vert, pastille du code.
  - `PromoCodeField` gagne un mode `compact`.
- [x] **CGU dans une fenêtre.** Dialog Chakra (`BaseModal`, `scrollBehavior="inside"`), avec « Fermer » et « J’accepte les conditions », qui coche la case.
  - Texte partagé avec la page publique (`components/terms/TermsContent.tsx`).
- Vérifié dans le navigateur : barre et champ au-dessus des cartes, sélection d’un plan, fenêtre des CGU et case cochée par « J’accepte ». Tests 116, build OK.
