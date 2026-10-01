# Backlog : abonnement et facturation (à faire plus tard)

> Décisions du 2026-10-01. Chantiers reportés après la [clôture du module abonnement](./plan-cloture-abonnement.md). Chacun suivra le processus habituel : spec, plan, tâches, implémentation, audit.
>
> **Exclus** : le back-office administrateur ; l'application mobile, réservée aux clients finaux qui réservent les biens des agences.

## 1. Module facturation
> Décision du 2026-10-02 : en deux temps, **après la section 2**. D'abord les reçus PDF de Keurezy à l'agence pour ses paiements d'abonnement (pour tous les plans, sans quota). Ensuite la facturation de l'agence à ses clients (réservations), fonctionnalité commerciale avec quota par plan.
>
> **Factures de l'agence à ses clients : modèles personnalisables** (décision du 2026-10-02) :
> - trois modèles par défaut, fournis par le backend à toutes les agences ;
> - chaque agence peut modifier un modèle ou en ajouter un ;
> - l'ajout est **guidé** : l'agence place les variables (client, bien, période, montant, mentions de l'agence…) que le backend remplace par les données.
>
> Les **reçus de Keurezy à l'agence** (abonnement, renouvellement…) restent un format **standard**, avec les informations de la plateforme : [spec](../subscription-receipts/spec.md). PDF générés côté backend (`pdfkit`).

- **Reçus et factures PDF**, générés par Keurezy pour chaque paiement d'abonnement. Numérotation continue, mentions légales de l'agence et de la plateforme.
- **Fonctionnalité commerciale** (par exemple `manage_invoices`), avec un **quota par plan**, du Gratuit au Premium. Elle s'ajoute aux compteurs existants : jauges, alerte à 80 %, blocage à 100 %.
- E-mail « paiement confirmé » enrichi du reçu en pièce jointe ou en lien.
- **Dépend de** la section 2 (informations légales de l'agence).

## 2. Informations légales de l'agence et statut « vérifié » (en cours : [spec](../agency-legal-info/spec.md))
- Nouveaux champs dans la page **Agence** : raison sociale, NINEA, RCCM, adresse de facturation, e-mail de facturation et autres mentions requises.
- **Règle** : sans ces informations, l'agence ne peut pas passer au statut **vérifié**.
- **Note visible sur la page Agence** pour l'expliquer, avec la liste des informations manquantes.
- Ces informations alimentent les factures (section 1).

## 3. Refonte de l'onboarding
- Nouveau parcours d'inscription d'agence.
- Inclut l'inscription au **plan Gratuit sans paiement**.
- **Limiter les inscriptions au Gratuit** (limitation de débit, e-mail vérifié avant activation) : sans paiement, des créations d'agence en masse sont possibles.
- Corrige la faille de `GET unsecured/common/polling`, qui renvoie le mot de passe déchiffré à qui connaît l'`orderId`. Tâche déjà ouverte.

## 4. Codes promo et remises (activation)
- Règles de remise : pourcentage ou montant, durée, plans concernés, date limite, nombre d'utilisations.
- Validation côté backend et application dans le devis (`quoteChange`). Le champ du récapitulatif, aujourd'hui désactivé, devient fonctionnel.
- Définir qui crée et valide les codes (sans back-office : par un script ou une configuration, à décider).

## 5. Relances après expiration
- E-mails J+3 et J+15 après l'expiration, avec un lien vers la réactivation.

## 6. Qualité et exploitation
- Tests de bout en bout des parcours : upgrade, downgrade, renouvellement, réactivation, blocage et alerte de limite.
- Alerte technique sur les échecs répétés du webhook NabooPay.
- **Paiements inférieurs au devis** : notification interne à l'équipe Keurezy (aucun écran d'administration prévu).
