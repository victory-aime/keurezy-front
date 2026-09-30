# Plan : `subscription-cancel`

> Spec : [spec-subscription-cancel.md](./spec-subscription-cancel.md). Tâches : [todo-subscription-cancel.md](./todo-subscription-cancel.md).

## Vue d'ensemble
Trois briques backend (résilier / réactiver, expiration, lecture seule avec annonces masquées), puis l'UI (dialogue d'impact, réactivation, bandeau d'expiration). Le plus risqué, le guard global de lecture seule, passe en premier.

## Décisions d'architecture
- **Guard global `ActiveSubscriptionGuard`** (`APP_GUARD`, après `AuthGuard`). Il ne concerne que les rôles `OWNER` et `AGENT`, sur `POST`, `PUT`, `PATCH` et `DELETE`. Il retrouve l'agence de l'utilisateur (owner ou staff actif), puis le statut de son abonnement. Les clients mobiles (`USER`), le `SUPER_ADMIN` et les routes anonymes ne sont pas touchés.
  - Refus par défaut : une nouvelle route d'écriture est bloquée tant qu'elle ne porte pas `@AllowWhenInactive()`.
  - Coût : une requête par écriture d'un utilisateur d'agence. *ponytail : pas de cache ; en ajouter un si ça se voit dans les temps de réponse.*
- **Allowlist `@AllowWhenInactive()`**, décidée sur le principe « on peut clôturer, sécuriser et communiquer, pas produire » :

| Domaine | Autorisé pendant l'expiration | Bloqué |
|---|---|---|
| Discussions | envoyer un message, marquer comme lu | — |
| Réservations | refuser une demande, annuler une réservation (agence) | confirmer une demande |
| Visites | annuler | créer, modifier, assigner |
| Équipe | désactiver ou retirer un membre, réinitialiser sa 2FA | modifier les permissions |
| Invitations | annuler | créer, renvoyer |
| Compte | profil, préférences, notifications, jetons push | — |
| Agence | programmer ou annuler la fermeture | modifier les infos |
| Intégrations | déconnecter | envoyer ou supprimer des fichiers |
| Abonnement | résilier, réactiver, payer (module checkout) | — |
| Biens, terrains, bâtiments, annonces | — | tout |

- **Annonces masquées** : un fragment Prisma unique `publicAnnonceWhere` (annonce `ACTIVE` et abonnement de l'agence `ACTIVE`). Il est utilisé par les 5 lectures publiques : liste (`annonce.service` `findAll`), détail (`findPublicAnnonce`), créneaux et devis (`findPublicPropertyId`), création de réservation (`bookings.service`), ouverture de discussion (`chat.service`). Les écrans de l'agence ne changent pas.
- **Expiration** : `@Cron` horaire dans `SubscriptionService`, un `updateMany` idempotent (`ACTIVE` et `currentPeriodEnd < now` → `INACTIVE`).
- **Bandeau d'expiration pour tout le staff** : `subscription-info` gagne un champ **additif** `status`. C'est la seule façon pour le staff (qui n'a pas accès à `agency/subscription`) de savoir que le tableau de bord est en lecture seule. Validé le 2026-10-01 (champ ajouté, rien de retiré).
- **Front** : `ActionImpactDialog` et `_utils/impact` réutilisés (nouvel `subscriptionCancelImpact`). Le message du 403 `SUBSCRIPTION_INACTIVE` s'affiche par le toast d'erreur existant ; le front ne recopie pas l'allowlist.

## Graphe
```
T1 guard + allowlist ──┐
T2 annonces masquées ──┼── T4 endpoints cancel/resume/impact ── T5 UI résiliation / réactivation
T3 job d'expiration ───┘                                     └── T6 bandeau + subscription-info.status
```

## Risques
| Risque | Impact | Parade |
|---|---|---|
| Une route oubliée dans l'allowlist bloque un usage légitime | Moyen | Refus par défaut assumé ; test qui liste les routes autorisées ; message 403 explicite |
| Une lecture publique oubliée laisse voir des annonces d'une agence expirée | Moyen | Fragment unique + test par lecture publique ; recherche `status: AnnonceStatus.ACTIVE` dans la revue |
| Le guard ralentit les écritures | Faible | Une requête indexée (`agencyId` unique) |
| Écart entre le job horaire et l'échéance réelle | Faible | Jusqu'à 1 h de grâce, acceptable ; le statut reste la seule source |

## Checkpoints
- Après T1–T3 : tests back verts ; agence mise en `INACTIVE` à la main en dev : écriture refusée, message et discussions OK, annonces absentes du public.
- Après T6 : parcours complet dans le navigateur (résilier, réactiver, expiration simulée), audit sécurité.

## Validé le 2026-10-01
1. L'allowlist ci-dessus, en particulier : **refuser** une demande de réservation et **annuler** une réservation confirmée sont autorisés, **confirmer** une nouvelle demande est bloqué.
2. Le champ additif `status` dans `subscription-info`.
