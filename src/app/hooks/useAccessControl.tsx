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
      agencyId: user?.agencyId,
    },
    queryOptions: {
      enabled: !!user?.agencyId,
    },
  });

  /**
   * 🔥 Set pour perf O(1)
   */
  const featureSet = useMemo(() => {
    return new Set(data?.features?.map((f) => f.name) ?? []);
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
    isLoading,
  };
};
