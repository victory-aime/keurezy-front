'use client';

import { ActionProps, BaseBadge, BaseTag, ColumnsDataTable } from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { ENUM } from '_types/*';

type AssetType = 'PROPERTY' | 'LAND' | 'BUILDING';
type AssetRow = { id: string; status?: string; isActive?: boolean };

/** Désactivé par un downgrade : en lecture seule, hors quota et invisible au public. */
export const isInactiveAsset = (row?: AssetRow | null) => row?.isActive === false;

/** Colonne « Status » d'une liste de biens : « Désactivé » prime sur le statut du bien. */
export const assetStatusColumn: ColumnsDataTable = {
  header: 'Status',
  accessor: 'fullObject',
  cell: (row?: AssetRow) =>
    isInactiveAsset(row) ? (
      <BaseTag status={ENUM.COMMON.Status.INACTIVE} label="Désactivé" variant="subtle" size="sm" />
    ) : (
      <BaseTag status={row?.status as ENUM.COMMON.Status} />
    ),
};

/**
 * Action « Réactiver » (owner) d'un bien désactivé, dans la limite du plan : le backend refuse
 * au-delà (`PROPERTY_CAPACITY_REACHED`, affiché par le toast d'erreur).
 */
export const useReactivateAssetAction = (
  type: AssetType,
  onDone: () => unknown,
): ActionProps<AssetRow> => {
  const { user } = useUserContext();
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === ENUM.UserRole.OWNER;
  const { mutate, isPending } = AgencyModule.activateAssetMutation({
    mutationOptions: { onSuccess: () => onDone() },
  });

  return {
    name: 'restore',
    title: 'Réactiver',
    isShown: (row) => isOwner && isInactiveAsset(row),
    isDisabled: () => isPending,
    handleClick: (row) =>
      mutate({ payload: { type, id: row.id }, params: { agencyId: user?.agencyId ?? '' } }),
  };
};
