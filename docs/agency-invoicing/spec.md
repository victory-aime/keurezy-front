# Spec : facturation de l'agence à ses clients (modèles personnalisables)

> Demande du 2026-10-02 : 3ᵉ chantier du [backlog abonnement](../subscription-ui/backlog-abonnement.md), après les [informations légales](../agency-legal-info/spec.md) et les [reçus Keurezy](../subscription-receipts/spec.md). Fonctionnalité **commerciale** avec quota par plan.

## Objectif
L'agence émet des **factures PDF** à ses clients :
- depuis une **réservation confirmée** (lignes préremplies) ;
- ou en **facture libre** (lignes saisies à la main), pour d'autres prestations.

Chaque facture utilise un **modèle**. Trois modèles par défaut sont fournis à toutes les agences. Une agence peut en **modifier** un, ou en **ajouter** un par un parcours **guidé** : mise en page, couleurs, colonnes, et textes où elle insère des **variables** remplacées par les données de la facture.

## Décisions du 2026-10-02
| Sujet | Décision |
|---|---|
| Objet | Factures de réservation et factures libres. |
| Modèles | **Structurés et guidés** : une des 3 mises en page, couleurs, logo, colonnes, textes libres avec variables choisies dans une liste, aperçu en direct. Rendu PDF par `pdfkit` (déjà installé). Pas de HTML libre. |
| TVA | **Taux réglable par agence**, 0 % par défaut (« non soumis à la TVA »). Avec un taux, la facture affiche HT, TVA et TTC. |
| Quota | **Factures émises par mois** : Gratuit 5, Basic 30, Standard 150, Premium illimité. **Modèles personnalisés** : Gratuit 0 (modèles par défaut seulement), Basic 1, Standard 3, Premium illimité. Jauges, alerte à 80 % et blocage à 100 %, comme les autres limites. |

## Découpage (modules et ordre)
| Module | Contenu | Dépend de |
|---|---|---|
| **I1 Modèles** | Les 3 modèles par défaut, les modèles de l'agence, le catalogue des variables, l'éditeur guidé avec aperçu. | Informations légales |
| **I2 Factures** | Création (depuis une réservation ou libre), numérotation, émission figée, PDF, statuts (payée, annulée). | I1 |
| **I3 Quotas** | Fonctionnalités commerciales `manage_invoices` et `invoice_templates`, compteurs, jauges, alerte et blocage. | I2 |
| **I4 Envoi** | Téléchargement, envoi par e-mail au client avec le PDF joint. | I2 |

Ordre : **I1 → I2 → I3 → I4**. Chaque module suit le processus habituel : plan, tâches, implémentation, audit.

## Règles proposées

### Modèles (I1)
1. **Trois modèles par défaut**, communs à toutes les agences et non modifiables en place : **Classique** (en-tête sobre, tableau bordé), **Moderne** (bandeau de couleur, logo en avant) et **Minimal** (sans fond, typographie seule).
2. **Modifier un modèle par défaut** crée une **copie propre à l'agence** ; l'original reste intact pour les autres. Cette copie compte dans le quota de modèles personnalisés.
3. **Contenu d'un modèle** (configuration structurée, validée côté backend) :
   - mise en page (Classique, Moderne, Minimal) ;
   - couleur principale et couleur d'accent ;
   - logo de l'agence affiché ou non ;
   - police : Helvetica, Times ou Courier (polices standard du PDF) ;
   - colonnes du tableau : désignation, période, quantité, prix unitaire, TVA, total ;
   - blocs affichés ou non : informations légales de l'agence, coordonnées bancaires, zone de signature ;
   - **textes libres avec variables** : titre, introduction, conditions de paiement, mentions, pied de page.
4. **Variables** : choisies dans une liste et insérées sous la forme `{{client.nom}}` ; toute variable inconnue est refusée à l'enregistrement.

   | Groupe | Exemples |
   |---|---|
   | `agence` | nom, raison sociale, NINEA, RCCM, adresse, téléphone, e-mail |
   | `client` | nom, e-mail, téléphone, adresse |
   | `facture` | numéro, date, échéance, total HT, TVA, total TTC, montant en lettres |
   | `reservation` | référence, période, durée, type de location, caution |
   | `bien` | titre, adresse, ville |

5. **Parcours guidé d'ajout** :
   1. partir d'un modèle par défaut ;
   2. régler la mise en page et les couleurs ;
   3. choisir les colonnes et les blocs ;
   4. rédiger les textes en insérant les variables (boutons « Insérer une variable ») ;
   5. aperçu avec des données d'exemple ;
   6. nommer et enregistrer.
6. **Modèle par défaut de l'agence** : l'agence en désigne un, proposé à la création des factures.
7. Modèles gérés par l'**owner** ; le staff les utilise.

### Factures (I2)
1. **Depuis une réservation confirmée** : client, bien, période, montant et caution sont préremplis et restent modifiables avant l'émission. Une réservation peut avoir plusieurs factures (acompte, solde…).
2. **Facture libre** : client saisi (nom, e-mail, téléphone, adresse) et lignes saisies (désignation, quantité, prix unitaire).
3. **Brouillon puis émission** : un brouillon se modifie librement et ne compte pas dans le quota. L'**émission** attribue le numéro et **fige tout** : lignes, client, informations de l'agence, modèle et taux de TVA. Le PDF ne changera plus.
4. **Numérotation propre à chaque agence**, continue, au format `{préfixe}-{année}-{rang}` (ex. `FAC-2026-0001`). Le préfixe est réglable par l'agence (`FAC` par défaut). Attribution sans trou ni doublon, même en concurrence.
5. **Statuts** : brouillon, émise, payée (date et moyen de paiement saisis par l'agence) et annulée (motif obligatoire, numéro conservé, mention « ANNULÉE » sur le PDF). Une facture émise ne se modifie pas : on l'annule et on en émet une autre.
6. **Échéance** : date de paiement attendue, 15 jours par défaut, réglable par facture.
7. **Droits** : l'owner, et le staff disposant de la permission de facturation (nouvelle permission). Les données sont limitées à l'agence.

### Quotas (I3)
1. Une facture compte dans le quota du **mois civil de son émission**. Une facture annulée compte quand même (pas de contournement par annulation).
2. Les modèles personnalisés comptent tant qu'ils existent. Après un downgrade, ceux qui dépassent restent utilisables en lecture, mais ne peuvent plus être modifiés.

### Envoi (I4)
1. Téléchargement du PDF depuis la liste et le détail d'une facture.
2. **Envoi par e-mail au client**, avec le PDF joint, via le modèle Resend générique. L'agence peut renvoyer une facture.

## Hors périmètre
- Avoirs et remboursements (annulation seulement).
- Paiement en ligne de la facture par le client.
- Factures visibles dans l'application mobile des clients.
- Relances automatiques des factures impayées : à prévoir plus tard.

## Critères de succès
- Une facture émise ne change plus, même si le modèle ou les informations de l'agence changent (testé).
- Les numéros sont continus et uniques par agence (testé en concurrence).
- Une variable inconnue dans un modèle est refusée ; un client ne peut rien injecter dans le PDF (testé).
- Le quota bloque la 6ᵉ facture du mois au plan Gratuit ; une annulation ne libère pas de place (testé).
- Une facture d'une autre agence n'est jamais lisible (testé).
- L'éditeur fonctionne sur mobile et sur desktop, avec un aperçu fidèle au PDF.

## Questions
1. **Coordonnées bancaires** (pour le bloc du modèle) : on ajoute des champs à l'agence (banque, IBAN ou RIB, numéro Wave ou Orange Money), ou ce bloc reste un texte libre du modèle ?
2. **Permission du staff** : facturation autorisée par défaut pour le staff, ou à accorder explicitement par l'owner (comme les autres permissions) ?
3. **Montant en lettres** (« dix mille francs CFA ») : utile sur vos factures ? (Je l'implémente sans dépendance si oui.)
4. **Préfixe de numérotation** : `FAC` par défaut te convient ?
