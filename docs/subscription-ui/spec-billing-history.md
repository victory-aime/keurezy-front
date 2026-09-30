# Spec : `billing-history`

> Carte : [spec.md](./spec.md) §1. Dépend de `subscription-checkout` (champ `PaymentTransaction.agencyId` et `kind`). Statut : **à valider**.

## Objectif
L'owner retrouve tous les paiements de son agence : date, montant, période couverte, statut.

## Règles
- Historique par agence (décision Q6).
- Les transactions d'onboarding existantes sont rattachées par une migration de données : `metadata.agencyEmail` → `Agency.email`. Les transactions non rattachables sont laissées sans agence et comptées dans le log de migration.
- Une transaction `ONBOARDING` n'apparaît que si elle est `PAID`. Sinon, un onboarding lancé par un tiers avec l'e-mail d'une agence existante s'afficherait chez elle (voir [security-audit.md](./security-audit.md)). `initiateAgencyPayment` doit aussi refuser un e-mail d'agence déjà utilisé.
- NabooPay ne fournit pas de facture PDF connue : pas de colonne « Facture » pour l'instant. Un reçu PDF généré par Keurezy sera un module à part, s'il est demandé.

## Contrat backend
`GET secured/agency/subscription/payments?agencyId&page&pageSize` — owner uniquement, pagination standard du projet.

```ts
interface AgencyPayment {
  id: string;
  kind: 'ONBOARDING' | 'RENEWAL' | 'UPGRADE' | 'REACTIVATION';
  plan: string;              // enum Plan
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  createdAt: string;
}
```
Aucun champ de `metadata` n'est exposé (il contient des données d'onboarding sensibles).

## UI
- Section secondaire « Historique de facturation », en bas de la page abonnement.
- Desktop : `DataTable` existant (date, type, plan, période, montant, statut en badge sobre).
- Mobile : liste compacte (date et montant en premier, le reste en dessous).
- Vide : « Aucun paiement pour le moment. »

## Tests
- **Back** : owner OK, staff 403, pagination, aucune donnée de `metadata` dans la réponse ; migration : rattachement par e-mail, transactions orphelines ignorées sans erreur.
- **Front** : manuel, 320 et 1440 px.

## Critères de succès
1. Chaque paiement (y compris l'onboarding) apparaît dans l'historique de la bonne agence, et seulement de celle-ci.
2. Aucune donnée sensible de paiement n'est exposée.
