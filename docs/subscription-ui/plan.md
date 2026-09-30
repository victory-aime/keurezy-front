# Plan : `subscription-ui` — module `subscription-overview`

> Spec : [spec.md](./spec.md) §3. Les modules `subscription-cancel`, `subscription-checkout` et `billing-history` seront planifiés après réponse aux questions Q1–Q7.

## Vue d'ensemble
Exposer en lecture ce que le backend sait déjà (souscription, compteurs, features) via un endpoint owner, puis construire la page « Mon abonnement » sur les conventions existantes (`AgencyModule`, `MotionBox`, `BaseText`, `BaseFormatNumber`, `FEATURE_LABELS`).

## Décisions d'architecture
- **Nouvel endpoint, pas d'extension de `subscription-info`** : ce dernier sert au gating de tout le staff (`useAccessControl`) ; y ajouter des prix exposerait la facturation au staff et changerait un contrat existant.
- **Compteurs partagés** : `usage` passe par `PlanFeaturePolicyService` (`checkCapacity` + compteurs). `countAnnonces` est extrait d'`annonce.service.ts` pour que l'affichage et l'enforcement ne divergent jamais.
- **Seuil 80 % côté backend** (`NEAR_LIMIT_RATIO`), le front n'affiche que `state`.
- **Front** : couche habituelle route → service → query (`agency.*`), page dans `app/dashboard/subscription`. Pas de nouvelle abstraction.
- **Sidebar** : champ `ownerOnly` sur `INavItem`, filtré là où `canAccess` l'est déjà.

## Graphe
```
countAnnonces + NEAR_LIMIT (packs)
        └── getSubscriptionOverview + GET agency/subscription (agency)
                └── route/service/query/type (front store)
                        └── page + composants
                                └── sidebar ownerOnly + UpgradePlanModal
```

## Tâches
Voir [todo.md](./todo.md) : T1–T2 backend, T3–T6 front, checkpoints après T2 et T6.

## Risques
| Risque | Impact | Parade |
|---|---|---|
| `Decimal` Prisma sérialisé en string | Moyen | Conversion `Number()` dans le service + test sur le type |
| Compteur d'annonces différent de l'enforcement | Élevé (jauge mensongère) | Une seule fonction, utilisée par les deux |
| La page promet une facturation qui n'existe pas | Élevé (confiance) | Libellé « Échéance » neutre tant que Q1 n'est pas tranchée |
| Branche `feat/auth-and-impact-hardening` non commitée (36 + 32 fichiers) | Moyen | Démarrer sur une branche `feat/subscription-overview` après commit ou stash de ce travail — à ta décision |

## Checkpoints
- Après T2 : tests back verts, endpoint testé via Swagger (owner / staff / sans souscription).
- Après T6 : parcours complet sur la page, 4 largeurs, clavier, reduced motion, audit sécurité.
