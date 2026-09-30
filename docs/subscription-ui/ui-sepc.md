Ta mission est de concevoir puis implémenter la partie **Gestion des abonnements / Plans** du dashboard web de **Keurezy**, une plateforme SaaS de gestion immobilière.

## Contexte technique

Le frontend Keurezy utilise :

- Next.js
- TypeScript
- Chakra UI v3
- TanStack Query
- React/Reanimated ou les primitives d’animation déjà présentes dans le projet lorsque pertinent

Respecte impérativement l’architecture existante du projet. Avant toute modification, inspecte le code existant afin d’identifier les composants, tokens, hooks, services, conventions et abstractions déjà disponibles.

Ne crée pas une nouvelle architecture si une abstraction existante peut être réutilisée.

## Objectif fonctionnel

Créer une expérience permettant à un utilisateur de :

- consulter son abonnement actuel ;
- voir son plan et son statut ;
- connaître son cycle de facturation ;
- voir la prochaine échéance ;
- consulter le montant qui sera facturé ;
- visualiser sa consommation actuelle ;
- voir les limites associées à son plan ;
- voir ce qu’il lui reste avant d’atteindre chaque limite ;
- consulter les fonctionnalités incluses dans son plan ;
- comparer les autres plans disponibles ;
- upgrader ou changer de plan ;
- résilier son abonnement ;
- voir clairement ce qui se passe après une résiliation ;
- réactiver son abonnement si celui-ci est simplement marqué pour résiliation en fin de période ;
- consulter son historique de facturation si les données sont disponibles côté API.

Le backend reste la **source de vérité** pour les plans, limites, consommations, prix, échéances, proratisation, statut d’abonnement et règles métier.

Ne jamais reproduire de logique métier de facturation côté frontend.

---

# Direction artistique

L’interface doit être :

- moderne ;
- SaaS premium ;
- épurée ;
- friendly ;
- professionnelle ;
- très lisible ;
- respirante ;
- rassurante ;
- cohérente avec le dashboard Keurezy existant.

S’inspirer des principes UX/UI de produits comme Linear, Stripe, Vercel ou les meilleurs SaaS B2B modernes, **sans copier leur design**.

### Règle importante

**Pas d’ombres inutiles.**

Éviter les grosses cards flottantes avec `box-shadow`, les effets glassmorphism excessifs ou les interfaces surchargées.

Privilégier :

- espace blanc ;
- bordures fines ;
- contrastes subtils ;
- surfaces légèrement teintées ;
- hiérarchie typographique ;
- radius cohérents avec le design system existant ;
- petits accents visuels ;
- séparateurs ;
- progress bars fines ;
- badges sobres.

L’interface doit donner une impression de légèreté et de qualité.

---

# Structure de la page

Créer une page principale du type :

**Mon abonnement**

Avec un sous-titre court :

**Gérez votre plan, votre consommation et votre facturation.**

Ajouter une action principale :

**Changer de plan**

---

## 1. Abonnement actuel

Créer une section permettant d’identifier immédiatement :

- nom du plan ;
- statut ;
- prix ;
- cycle mensuel ou annuel ;
- date de début ;
- date de fin de période ;
- renouvellement automatique ;
- prochaine échéance ;
- montant de la prochaine facturation.

Le plan actuel doit être visuellement identifiable sans prendre une place excessive.

Exemples de statuts possibles :

- Actif
- En période d’essai
- Résiliation programmée
- Expiré
- Suspendu

Ne jamais inventer les statuts réellement supportés : utiliser ceux exposés par l’API.

---

# 2. Prochaine facturation

Présenter clairement :

- prochaine date de facturation ;
- montant ;
- cycle ;
- état du renouvellement.

Si `cancelAtPeriodEnd` est actif, ne pas présenter cela comme une prochaine facturation.

Présenter plutôt :

**Votre abonnement reste actif jusqu’au [date].**

Puis :

**Réactiver mon abonnement**

---

# 3. Consommation

Créer une section très importante :

**Votre utilisation**

Chaque quota doit présenter :

- nom de la fonctionnalité ;
- consommation actuelle ;
- limite ;
- quantité restante ;
- pourcentage utilisé ;
- éventuellement une indication lorsque la limite est proche.

Exemple conceptuel :

Utilisateurs
24 / 50 utilisés
26 disponibles
48 %

La représentation doit être visuelle mais minimaliste.

Utiliser des progress bars fines avec animation.

Prévoir les différents états :

### Utilisation normale

Indication discrète.

### Limite bientôt atteinte

Accent visuel léger et message informatif.

### Limite atteinte

État clairement identifiable avec une action éventuelle permettant de changer de plan.

Ne pas utiliser systématiquement du rouge pour attirer l’attention.

Le backend fournit les valeurs calculées. Le frontend les affiche.

---

# 4. Fonctionnalités incluses

Créer une section :

**Fonctionnalités de votre plan**

Afficher les fonctionnalités sous forme de liste ou grille légère.

Chaque fonctionnalité peut avoir :

- icône ;
- nom ;
- description courte ;
- état disponible/non disponible.

Pour les fonctionnalités non disponibles, indiquer éventuellement :

**Disponible avec un autre plan**

Ne pas afficher une énorme grille tarifaire inutilement sur la page principale.

---

# 5. Changer de plan

Le changement de plan doit être une expérience dédiée et claire.

Ne pas transformer toute la page principale en tableau tarifaire géant.

Créer plutôt un flow :

**Choisir un plan → Vérifier le changement → Confirmer**

Les plans disponibles doivent afficher :

- nom ;
- prix mensuel ;
- prix annuel si disponible ;
- fonctionnalités ;
- limites ;
- plan actuel ;
- différence avec le plan actuel.

L'utilisateur doit comprendre immédiatement ce qu'il obtient en changeant de plan.

Si le backend fournit une information de proratisation ou de montant à payer, l'afficher clairement.

Ne jamais calculer localement la proratisation.

---

# 6. Résiliation

La résiliation doit être accessible mais ne doit pas être présentée comme une énorme action destructive.

Utiliser une action secondaire :

**Résilier mon abonnement**

Afficher ensuite une confirmation expliquant clairement :

- que l'abonnement reste actif jusqu'à la fin de la période ;
- la date exacte de fin ;
- ce qui se passe après cette date ;
- si les données ou fonctionnalités sont affectées, uniquement si cette information est fournie par le backend.

Après confirmation :

Afficher un état :

**Résiliation programmée**

avec :

**Actif jusqu'au [date]**

et une action :

**Réactiver mon abonnement**

---

# 7. Historique de facturation

Si l'API expose les factures, créer une section secondaire :

**Historique de facturation**

Afficher sous forme de tableau/list :

- date ;
- montant ;
- période ;
- statut ;
- facture ;
- action éventuelle.

Sur mobile, transformer le tableau en liste/cards compactes.

---

# Responsive design

La page doit être pensée Desktop First mais parfaitement adaptée au mobile.

Desktop :

- header ;
- résumé abonnement ;
- informations de facturation ;
- consommation ;
- fonctionnalités ;
- historique.

Lorsque l'espace le permet, certaines informations peuvent être présentées côte à côte.

Mobile :

- empiler les sections ;
- conserver une hiérarchie claire ;
- rendre les actions facilement accessibles ;
- éviter les tableaux trop larges ;
- transformer les tableaux en listes ;
- conserver des progress bars lisibles ;
- éviter les modales trop grandes.

---

# Animations

Les animations doivent être **subtiles et utiles**.

Éviter toute animation décorative excessive.

Utiliser par exemple :

### Apparition des sections

Opacity :

0 → 1

et translation :

6px → 0

avec un léger stagger entre les sections.

### Progress bars

Animer :

0 → valeur réelle

sur environ 400–600 ms.

### Changement de plan

Lorsqu'un plan est sélectionné :

- transition légère de bordure ;
- background subtil ;
- éventuellement scale très léger ;
- transition 150–250 ms.

### Modales

Utiliser :

- opacity ;
- scale très léger ;
- transition courte.

Respecter également `prefers-reduced-motion`.

---

# Architecture frontend

Respecter l'architecture existante.

La page ne doit pas appeler directement l'API.

Architecture attendue :

```text
Subscription Page
        ↓
React Query Hook
        ↓
keurezy-api
        ↓
Subscription Service
        ↓
Endpoint
        ↓
Keurezy Backend
```

Pour les mutations :

```text
Upgrade / Change Plan
        ↓
Mutation Hook
        ↓
keurezy-api
        ↓
Backend
        ↓
Invalidate Subscription Queries
        ↓
UI actualisée
```

Même logique pour :

- cancel subscription ;
- reactivate subscription ;
- change plan ;
- toute autre action supportée.

Avant de créer un hook ou service, rechercher dans `keurezy-api` si l'abstraction existe déjà.

---

# Architecture UI recommandée

Adapter cette structure aux conventions réelles du projet :

```text
subscription/
├── page.tsx
├── components/
│   ├── SubscriptionHeader
│   ├── CurrentPlan
│   ├── BillingSummary
│   ├── UsageOverview
│   ├── UsageLimitItem
│   ├── PlanFeatures
│   ├── ChangePlan
│   ├── CancelSubscription
│   └── BillingHistory
├── hooks/
└── utils/
```

Ne crée pas systématiquement tous ces fichiers si certains composants existants peuvent être réutilisés.

La structure finale doit être guidée par l'architecture déjà présente dans Keurezy.

---

# États à gérer

La page doit correctement gérer :

- loading ;
- erreur ;
- absence d'abonnement ;
- abonnement actif ;
- abonnement en renouvellement ;
- résiliation programmée ;
- limite proche ;
- limite atteinte ;
- changement de plan en cours ;
- résiliation en cours ;
- réactivation en cours ;
- absence d'historique de facturation ;
- données partielles.

Prévoir également les états disabled des boutons pendant les mutations afin d'éviter les doubles actions.

---

# Principes techniques

Respecter strictement :

- TypeScript strict ;
- composants réutilisables ;
- pas de `any` inutile ;
- pas de duplication ;
- pas de logique métier de facturation dans le frontend ;
- pas de calcul local des limites si le backend les fournit ;
- pas de logique d'autorisation basée uniquement sur l'UI ;
- TanStack Query pour le server state ;
- invalidation correcte après mutation ;
- gestion propre des erreurs ;
- accessibilité ;
- responsive ;
- cohérence avec les composants existants.

Le frontend est responsable de la présentation et de l'expérience utilisateur.

Le backend reste responsable de la vérité métier.

---

# Payload conceptuel attendu

Si l'API fournit les informations sous une structure équivalente, exploiter les données existantes plutôt que créer un nouveau contrat.

Conceptuellement, la page peut avoir accès à :

```ts
{
  subscription: {
    status,
    plan,
    billingCycle,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd
  },
  usage: [
    {
      feature,
      used,
      limit,
      remaining,
      percentage
    }
  ],
  features: [],
  billing: {
    nextAmount,
    nextBillingDate
  },
  invoices: []
}
```

Ce payload est uniquement une référence fonctionnelle.

**Inspecter le backend et `keurezy-api` avant de l'implémenter.**

Ne pas créer de nouveaux endpoints si les endpoints nécessaires existent déjà.

---

# Workflow obligatoire

Avant de coder :

1. Inspecter la structure actuelle du dashboard.
2. Identifier les composants UI déjà disponibles.
3. Identifier les tokens/design system existants.
4. Identifier les conventions de layout.
5. Rechercher les fonctionnalités subscription déjà présentes.
6. Inspecter `keurezy-api`.
7. Identifier les endpoints/services/hooks existants.
8. Inspecter les modèles backend liés aux plans, features, quotas et subscriptions.
9. Vérifier les statuts réellement supportés.
10. Vérifier les règles de changement de plan et de résiliation.
11. Réutiliser autant que possible l'existant.
12. Implémenter uniquement ce qui manque.

Ne pas modifier massivement l'architecture existante.

Ne pas créer de mock data si les données réelles sont déjà disponibles.

Ne pas inventer de règles métier.

---

# Résultat attendu

Le résultat final doit donner l'impression d'une fonctionnalité SaaS mature et premium, mais rester extrêmement simple à comprendre.

L'utilisateur doit pouvoir répondre en quelques secondes à ces questions :

**Quel est mon plan ?**

**Combien est-ce que je paie ?**

**Quand serai-je facturé ?**

**Combien ai-je consommé ?**

**Combien me reste-t-il ?**

**Quelles fonctionnalités ai-je ?**

**Que vais-je obtenir en changeant de plan ?**

**Que se passe-t-il si je résilie ?**

La priorité est la clarté, la confiance et la simplicité, pas la quantité d'éléments visuels.

Avant toute implémentation, analyse le code existant et adapte cette spécification aux conventions réelles de Keurezy.
