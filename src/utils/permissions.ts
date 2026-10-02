/** Droits de l'utilisateur connecté, tels que lus dans la session Better Auth. */
export interface AccessContext {
  /** Propriétaire de l'agence : il a toujours tous les droits. */
  isOwner: boolean;
  /** Noms des permissions accordées au membre (ex. `manage_land`). */
  permissions: Iterable<string>;
}

/**
 * Règle d'accès unique du dashboard : l'owner passe toujours, un membre seulement
 * s'il détient la permission. Elle reproduit la règle du `PermissionGuard` backend,
 * qui reste la seule protection réelle : côté web, elle sert à masquer ou désactiver.
 */
export function canAccess({ isOwner, permissions }: AccessContext, permission: string): boolean {
  if (isOwner) return true;
  const granted = permissions instanceof Set ? permissions : new Set(permissions);
  return granted.has(permission);
}

/**
 * Regroupe les fonctionnalités par module : plusieurs fonctionnalités partagent un module
 * (ex. factures et modèles de facture → Facturation). Une permission n'apparaît qu'une fois et
 * un module sans permission n'est pas affiché.
 */
export function mergePermissionGroups<P extends { id: string }>(
  groups: { category: string; permissions?: P[] }[],
): { category: string; permissions: P[] }[] {
  const byCategory = new Map<string, Map<string, P>>();
  for (const group of groups) {
    const permissions = byCategory.get(group.category) ?? new Map();
    group.permissions?.forEach((p) => permissions.set(p.id, p));
    byCategory.set(group.category, permissions);
  }
  return [...byCategory.entries()]
    .filter(([, permissions]) => permissions.size > 0)
    .map(([category, permissions]) => ({ category, permissions: [...permissions.values()] }));
}

/**
 * Fonctionnalité du plan dont dépend une page : celle du lien du menu dont le chemin est le plus
 * long préfixe de l'URL (ex. `/dashboard/team/add` → lien Collaborateurs → `manage_users`).
 */
export function planFeatureForPath(
  pathname: string,
  links: { path?: string; feature?: string }[],
): string | undefined {
  const match = links
    .filter(
      (l) => l.feature && l.path && (pathname === l.path || pathname.startsWith(`${l.path}/`)),
    )
    .sort((a, b) => b.path!.length - a.path!.length)[0];
  return match?.feature;
}
