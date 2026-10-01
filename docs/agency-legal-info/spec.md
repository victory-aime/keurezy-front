# Spec : informations légales de l'agence et statut « vérifié »

> Demande du 2026-10-02 : 1er chantier du [backlog abonnement](../subscription-ui/backlog-abonnement.md) (section 2), prérequis de la facturation. Ordre décidé : **informations légales → reçus Keurezy → agence (abonnement) → facturation agence → clients (quota par plan)**. PDF générés côté backend avec `pdfkit`.

## Objectif
Une agence renseigne ses informations légales dans la page **Agence**. Elles servent :
- à la **vérification** : sans elles, l'agence ne peut pas être « vérifiée » ;
- aux **factures et reçus** des chantiers suivants.

Une note sur la page Agence explique la règle et liste ce qui manque.

## Existant
- `Agency.isVerified` est posé à `true` par le SUPER_ADMIN quand il change le statut (`PATCH admin/agency/status`). Ni règle ni condition.
- Le badge « vérifié » est affiché sur le mobile (fiche d'un bien) et renvoyé avec les annonces publiques.
- `UpdateAgencyDto` / `updateAgency` (owner) : nom, adresse, téléphone, description, logo.

## Règles proposées
1. **Champs légaux** (agence) :

   | Champ | Obligatoire | Règle |
   |---|---|---|
   | Raison sociale | oui | 2 à 150 caractères |
   | Forme juridique | oui | liste : SARL, SUARL, SA, SAS, SASU, GIE, Entreprise individuelle, Autre |
   | NINEA | oui | 7 à 14 caractères, chiffres et lettres (format sénégalais, ex. `0012345 2G3`), espaces ignorés |
   | RCCM | oui | 6 à 40 caractères, ex. `SN-DKR-2020-B-12345` |
   | Adresse de facturation | oui | par défaut l'adresse de l'agence |
   | E-mail de facturation | oui | e-mail valide ; par défaut l'e-mail de l'agence |

2. **Modification** : par l'**owner** uniquement (le staff voit, sans modifier).
3. **Vérification** :
   - Le SUPER_ADMIN ne peut **vérifier** une agence que si ses informations légales sont complètes. Sinon : `409 LEGAL_INFO_INCOMPLETE`, avec la liste des champs manquants.
   - Il peut toujours l'**ouvrir** (statut `OPEN`) : elle reste alors simplement non vérifiée.
4. **Modification après vérification** : changer la raison sociale, le NINEA ou le RCCM **retire la vérification**, qui doit être refaite. L'owner en est prévenu avant d'enregistrer. Changer l'adresse ou l'e-mail de facturation ne la retire pas.
5. **Note sur la page Agence** :
   - non vérifiée, informations incomplètes : « Complétez vos informations légales pour que votre agence puisse être vérifiée », avec la liste de ce qui manque ;
   - complète, en attente : « Vos informations sont complètes : la vérification est en cours » ;
   - vérifiée : badge « Agence vérifiée ».
6. **Visibilité** : les informations légales ne sont pas publiques (seulement owner, staff et SUPER_ADMIN). Le public ne voit que le badge.

## Contrat (proposé)
- `GET secured/agency/info` : ajoute `legal: { companyName, legalForm, ninea, rccm, billingAddress, billingEmail } | null` et `legalMissing: string[]`.
- `PATCH secured/agency/legal?agencyId` (owner) : corps `UpdateAgencyLegalDto`, liste blanche. Réponse : `{ legal, legalMissing, isVerified }`.
- `PATCH admin/agency/status` : vérifie la complétude avant de poser `isVerified`.
- **Migration 19** (additive) : colonnes nullables sur `agency`, plus une énumération `LegalForm`.

## Hors périmètre
- Pièces justificatives (scan du RCCM, etc.) : le champ `documents` existe déjà ; à revoir avec la refonte de l'onboarding.
- Écran d'administration (back-office exclu).
- Les factures elles-mêmes (chantiers suivants).

## Critères de succès
- Une agence sans informations légales ne peut pas être vérifiée (testé).
- Modifier le NINEA d'une agence vérifiée retire la vérification (testé).
- Le staff ne peut pas modifier (403, testé) ; aucune information légale dans les réponses publiques (testé).
- La page Agence affiche la note selon les 3 cas, sur mobile comme sur desktop.

## Réponses validées (2026-10-02)
1. Les 6 champs suffisent.
2. Retrait de la vérification au changement de la raison sociale, du NINEA ou du RCCM : validé.
3. Les agences déjà vérifiées sans informations légales repassent **non vérifiées** (migration). En dev, **Mobelite garde son badge** pour les tests.

## Précision d'implémentation
La route d'administration change le statut et la vérification en un seul appel. Elle pose donc `isVerified` selon la complétude : une agence incomplète peut être ouverte (`OPEN`) mais reste non vérifiée, et la réponse liste ce qui manque. Il n'y a pas d'erreur 409 séparée.
