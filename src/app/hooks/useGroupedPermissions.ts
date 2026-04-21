import { useMemo } from 'react';
import { ISelectPermissions } from '../dashboard/invitations/constants/team';
import { MODELS } from '_types/*';

export function useGroupedPermissions(
  permissions?: MODELS.COMMON.IGetAllPermissionResponse[],
  selectedPermissions?: ISelectPermissions[],
) {
  return useMemo(() => {
    if (!permissions || !selectedPermissions) return [];

    const selectedIds = new Set(
      selectedPermissions.filter((p) => p.granted).map((p) => p.permissionId),
    );

    return permissions
      .map((group) => ({
        category: group.category,
        permissions: group.permissions.filter((perm) => selectedIds.has(perm.id)),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [permissions, selectedPermissions]);
}
