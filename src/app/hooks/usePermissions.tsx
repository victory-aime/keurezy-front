"use client";

import { useAuthContext } from "_context/auth-context";
import { useMemo } from "react";
import { UserRole } from "../../types/enum";

interface IPermissionHooks {
  hasCategoryAccess: (category: string) => boolean;
  hasFeatureAccess: (category: string, feature: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const usePermissions = (): IPermissionHooks => {
  const { session, user } = useAuthContext();

  const role = user?.role;

  const isOwner = role === UserRole.OWNER;

  const permissions = session?.permissions ?? [];

  /**
   * 🔥 INDEXATION (O(n) -> O(1))
   */
  const permissionSet = useMemo(() => {
    return new Set(permissions.map((p) => p.name));
  }, [permissions]);

  const featureSet = useMemo(() => {
    return new Set(permissions.map((p) => `${p.category}:${p.feature}`));
  }, [permissions]);

  const categorySet = useMemo(() => {
    return new Set(permissions.map((p) => p.category));
  }, [permissions]);

  /**
   * 🔥 O(1)
   */
  function hasPermission(permissionName: string) {
    if (isOwner) return true;
    return permissionSet.has(permissionName);
  }

  /**
   * 🔥 O(1)
   */
  function hasAnyPermission(names: string[]) {
    if (isOwner) return true;

    for (const name of names) {
      if (permissionSet.has(name)) return true;
    }
    return false;
  }

  /**
   * 🔥 O(1)
   */
  function hasCategoryAccess(category: string) {
    if (isOwner) return true;
    return categorySet.has(category);
  }

  /**
   * 🔥 O(1)
   */
  function hasFeatureAccess(category: string, feature: string) {
    if (isOwner) return true;
    return featureSet.has(`${category}:${feature}`);
  }

  return {
    hasCategoryAccess,
    hasFeatureAccess,
    hasPermission,
    hasAnyPermission,
  };
};
