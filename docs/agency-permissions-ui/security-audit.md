# Audit de sécurité : `agency-permissions-ui`

Date : 2026-09-29. Méthode : skill `security-and-hardening` (modèle de menace, puis revue du diff et des dépendances).

## Modèle de menace
- **Frontière de confiance.** Les permissions viennent de la session Better Auth, émise et relue côté serveur (`customSession`). Le client n'en fournit aucune.
- **Élévation de privilège (STRIDE « E »).** Masquer ou désactiver un élément dans le web reste de l'ergonomie. Un membre qui appelle directement une route interdite reçoit un 403 du `PermissionGuard` global du backend (lot 1). ✅
- **Fuite d'information (« I »).** Le message 403 est générique (« Accès non autorisé »). Aucun nom de permission n'est affiché, ni dans le diff ni dans les toasts. ✅
- **Owner.** Il garde toujours tous les droits, en cohérence avec le backend. Un test Vitest le vérifie. ✅

## Diff
- Aucun secret ni jeton ajouté (vérifié par une recherche dans le diff). ✅
- Aucun `innerHTML` ou `dangerouslySetInnerHTML`, aucune URL construite à partir d'une saisie. ✅

## Dépendances
- **Ajout : `vitest` 5.0.2, en dépendance de développement.** Il n'introduit aucune vulnérabilité : aucun chemin d'avis `pnpm audit` ne passe par `vitest`. ✅
- **Vulnérabilités déjà présentes, hors de ce module, à traiter dans un changement dédié :**

  | Paquet | Installé | Gravité | Corrigé en |
  |---|---|---|---|
  | `next` | 16.2.6 | **critique** : RCE non authentifiée (Image Optimizer, hôtes Windows) ; haute : contournement du middleware, SSRF, DoS | ≥ 16.3.3 |
  | `axios` | 1.15.x | haute : MITM par pollution de prototype, fuite de Proxy-Authorization, ReDoS | ≥ 1.18.0 |
  | `better-auth` | 1.6.20 | haute : prise de contrôle de compte par pré-création | ≥ 1.6.22 |
  | Outillage de build : `brace-expansion`, `js-yaml`, `fast-uri`, `sharp`, `postcss` | — | haute | via mises à jour transitives |

  **Recommandation** : un changement `chore(deps)` par paquet (Next, axios, better-auth), chacun validé par un build et un test manuel. Le backend doit être vérifié lui aussi : il utilise `better-auth` 1.6.11.

## Verdict
Aucun problème de sécurité dans le périmètre du module. Les mises à jour de dépendances sont signalées et à planifier.
