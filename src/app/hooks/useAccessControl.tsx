'use client';

import { useMemo } from 'react';
import { usePermissions } from './usePermissions';
import { AgencyModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';

interface AccessParams {
  feature?: string;
  permission?: string;
}

export const useAccessControl = () => {
  const { user } = useUserContext();
  const { hasPermission } = usePermissions();
  const { data, isLoading } = AgencyModule.getAgencySubscriptionInfo({
    params: {
      agencyId: user?.agencyId!,
    },
    queryOptions: {
      enabled: !!user?.agencyId,
    },
  });

  /**
   * Fonctionnalités réellement disponibles : incluses dans le plan avec une limite non nulle
   * (une limite à 0, comme les collaborateurs du plan Gratuit, vaut « non incluse »).
   */
  const featureSet = useMemo(() => {
    return new Set(
      data?.features
        ?.filter((f: { limit: number | null }) => f.limit !== 0)
        .map((f: { name: string }) => f.name) ?? [],
    );
  }, [data]);

  function hasFeature(feature?: string) {
    if (!feature) return true;
    return featureSet.has(feature);
  }

  function canAccess({ feature, permission }: AccessParams) {
    // 1. Plan check
    if (feature && !hasFeature(feature)) return false;

    // 2. Permission check
    if (permission && !hasPermission(permission)) return false;

    return true;
  }

  return {
    canAccess,
    hasFeature,
    isLoading,
  };
};
