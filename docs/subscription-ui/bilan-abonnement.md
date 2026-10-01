# Bilan : module abonnement (terminé)

> **Statut : terminé le 2026-10-02**, côté agence (page « Mon abonnement » sur le web, abonnement et paiements côté backend).
> Ce document résume ce qui a été construit, pour la traçabilité. Le détail de chaque étape est dans les specs, plans, tâches et audits de ce dossier, et dans `keurezy-backend/CHANGES.md` (sections 36 à 55).
> Les chantiers reportés sont dans [backlog-abonnement.md](./backlog-abonnement.md).

## 1. Modèle retenu
- **Abonnement uniquement**, quatre plans :

  | Plan | Biens | Annonces en ligne | Collaborateurs |
  |---|---|---|---|
  | Gratuit | 2 | 2 | 0 |
  | Basic | 6 | 6 | 1 |
  | Standard | 20 | 20 | 5 |
  | Premium | illimité | illimité | illimité |

- **Gratuit** : ni paiement, ni cycle, ni échéance. Pas de rappel, pas d'expiration, pas de résiliation.
- **Modèle à la commission supprimé** : données, schéma et code.
- **Paiement manuel** par NabooPay (Wave, Orange Money), sans prélèvement automatique. Les rappels sont envoyés à J-7, J-3 et J-1.
- **Quotas** : seuls les éléments **actifs** comptent. Un élément désactivé libère sa place.
- **Fin de période sans renouvellement** (résiliation, ou non-paiement quand le flag est activé) : l'agence **passe au plan Gratuit**. Ce qui dépasse ses limites est désactivé, jamais supprimé, et les éléments les plus anciens restent actifs.
- **Upgrade** : immédiat. Sur le même cycle, on paie la différence au prorata et l'échéance ne change pas. Sur un cycle plus long, une nouvelle période commence au paiement.
- **Downgrade** : programmé pour l'échéance. L'owner choisit ce qui reste actif. Une agence expirée peut passer au Gratuit tout de suite.
- **Changement de tarif** : il ne touche jamais la période en cours et s'applique au prochain renouvellement.
- **Hors périmètre** : back-office administrateur, application mobile (réservée aux clients finaux).

## 2. Ce qui a été livré

### Backend (NestJS, Prisma)
| Domaine | Livré |
|---|---|
| Consultation | `GET agency/subscription` (plan, période, usage, fonctionnalités, downgrade programmé, prochain tarif) ; `limits` (owner et staff) ; `payments` (historique paginé). |
| Changement de plan | `quote` (devis unique, `quoteChange`) ; `checkout` (clé `Idempotency-Key`, montant figé) ; `payment` (suivi au retour) ; `schedule-change` et `DELETE scheduled-change` ; `assets/activate`. |
| Résiliation | `cancel` (avec questionnaire facultatif), `resume`, `cancel-impact` (ce qui sera désactivé au passage au Gratuit). |
| Paiements | Application **unique** (réclamation atomique sur `orderId`, contrôle du montant) ; webhook découplé par l'événement `subscription.payment.confirmed` ; job de **rattrapage** toutes les 15 min ; abandon après 48 h, jamais pour un paiement réglé. |
| Jobs | Toutes les heures : downgrades programmés, puis passage au Gratuit des périodes échues. Chaque jour : rappels d'échéance. |
| Avis | E-mail et notification in-app : rappel (3 variantes), paiement confirmé, passage au Gratuit, downgrade appliqué. **Un modèle Resend générique**, texte rédigé par le backend. |
| Limites | Création refusée au-delà du plan ; biens désactivés en lecture seule et masqués du public. |
| Questionnaire | Table `exit_feedback`, à la résiliation et à la fermeture d'agence. |
| Scripts | `subscription:grace:*` (délai de grâce avant le flag) ; `subscription:commission-to-free:*` (fin de la commission). |

**Migrations** : 13 (fondations facturation), 14 (checkout), 15 (contraction des invitations), 16 (plan Gratuit), 17 (suppression de la commission), 18 (questionnaire).

### Web (Next.js, Chakra UI)
| Écran | Livré |
|---|---|
| Mon abonnement | Plan actuel, échéance ou « sans échéance » (Gratuit), note « nouveau tarif », usage (les fonctionnalités non incluses sont masquées), fonctionnalités, historique de facturation, bandeau de downgrade programmé. |
| Changer de plan | Dialogue plein écran en 3 étapes : choisir (plan actuel non sélectionnable), vérifier (devis, choix des éléments gardés), récapitulatif (gains et pertes, montant, y compris « 0 F CFA », champ code promo désactivé « Bientôt disponible »). Retour de NabooPay suivi jusqu'au statut final. |
| Limites | Alerte à **80 %**, une fois par session et par fonctionnalité, avec la jauge et « Continuer » qui lance l'action. **Blocage à 100 %**. Aperçu du plan supérieur pour les agences sans historique de paiement. |
| Résiliation | Deux étapes : l'impact (ce qui sera désactivé au passage au Gratuit), puis le questionnaire « Avant de partir » (« Passer et résilier » ou « Envoyer et résilier »). |
| Fermeture d'agence | Questionnaire facultatif dans le dialogue d'impact. |
| Offre et inscription | 4 plans, plus de choix commission / abonnement ; le Gratuit crée l'agence sans paiement. |

## 3. Sécurité
Les audits sont dans [security-audit.md](./security-audit.md), une section par module. Points clés :
- Actions et montants réservés à l'owner. Le staff ne voit que les compteurs de limites.
- Aucun double paiement ni double application. Aucun plan payant n'est obtenu sans paiement.
- Variables des e-mails **échappées** à l'envoi, pour tous les modèles.
- Inscription limitée à **3 créations par heure et par IP**. Annonces visibles du public seulement si l'**e-mail du propriétaire est vérifié**.

## 4. Qualité
- Tests : **backend 343**, **web 76**. Builds OK.
- Revues UX et accessibilité du changement de plan et de l'alerte : [change-plan-ux.md](./change-plan-ux.md), [limit-reached.md](./limit-reached.md).

## 5. Données de dev (au 2026-10-02)
- Simulations retirées :
  - le paiement simulé `SIMU-…` de Mobelite est supprimé ;
  - l'invitation de démo de KALIMOTECH est supprimée ;
  - Mobelite et KALIMOTECH sont passées au Gratuit, faute de paiement réel.
- Les 4 anciennes agences commission sont au Gratuit. Aucune agence n'est inactive.
- Paiements en attente non payés : annulés le 02/10. Ceux créés depuis seront traités par le job de rattrapage.

## 6. Mise en service
- Procédure UAT : `keurezy-backend/CHANGES.md`, section 54. Elle couvre :
  - l'ordre de déploiement ;
  - les migrations 15 à 18 ;
  - le seed et le script commission ;
  - le délai de grâce ;
  - le flag `SUBSCRIPTION_EXPIRY_ENABLED`.
- **À faire avant** : créer le modèle Resend `subscription-notice.html` et renseigner `RESEND_TEMPLATE_SUBSCRIPTION_NOTICE_ID` (dev et UAT).

## 7. Documents de référence
| Sujet | Documents |
|---|---|
| Page abonnement (base) | [spec.md](./spec.md), [plan.md](./plan.md), [todo.md](./todo.md), [ui-sepc.md](./ui-sepc.md) |
| Résiliation | [spec-subscription-cancel.md](./spec-subscription-cancel.md), [plan-subscription-cancel.md](./plan-subscription-cancel.md), [todo-subscription-cancel.md](./todo-subscription-cancel.md) |
| Changement de plan et paiement | [spec-subscription-checkout.md](./spec-subscription-checkout.md), [plan-subscription-checkout.md](./plan-subscription-checkout.md), [todo-subscription-checkout.md](./todo-subscription-checkout.md), [change-plan-ux.md](./change-plan-ux.md) |
| Historique de facturation | [spec-billing-history.md](./spec-billing-history.md), [todo-billing-history.md](./todo-billing-history.md) |
| Limites | [limit-reached.md](./limit-reached.md) |
| Clôture | [plan-cloture-abonnement.md](./plan-cloture-abonnement.md) |
| Sécurité | [security-audit.md](./security-audit.md) |
| À faire plus tard | [backlog-abonnement.md](./backlog-abonnement.md) |
