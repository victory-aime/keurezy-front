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
