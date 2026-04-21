'use client';

import { MotionBox } from '_constants/motion';
import { FormCard } from '../../components/FormCard';
import { ISelectedCheckboxElement, PermissionListGroup } from '_components/custom';
import { useFormikContext } from 'formik';
import { ISelectPermissions } from '../constants/team';
import { useMemo } from 'react';
import { MODELS } from '_types/*';

export const InviteTeamStep2 = ({
  allPermissions,
  isLoading,
}: {
  allPermissions: MODELS.COMMON.IGetAllPermissionResponse[];
  isLoading: boolean;
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<{
    permissions: ISelectPermissions[];
  }>();

  const handlePermissionChange = (selectedValues: ISelectedCheckboxElement[]) => {
    const flattened: ISelectPermissions[] = selectedValues.flatMap((group) =>
      group.permissions.map((perm) => ({
        permissionId: perm.id,
        granted: perm.granted,
      })),
    );
    setFieldValue('permissions', flattened);
  };

  const defaultPermissions = useMemo((): ISelectedCheckboxElement[] => {
    if (!values?.permissions || !allPermissions) return [];

    const selectedIds = new Set(
      values.permissions.filter((p) => p.granted).map((p) => p.permissionId),
    );

    return allPermissions.map((group) => ({
      category: group.category,
      permissions: group.permissions
        .filter((perm) => selectedIds.has(perm.id))
        .map((perm) => ({
          id: perm.id,
          granted: true,
        })),
    }));
  }, [values.permissions, allPermissions]);

  return (
    <MotionBox
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <FormCard
        title={'Liste des permissions disponible'}
        description={'Veuillez selectionner une permission'}
        loader={isLoading}
      >
        <PermissionListGroup
          groupList={allPermissions ?? []}
          onChange={handlePermissionChange}
          defaultValues={defaultPermissions}
          errorMessage={errors?.permissions}
          isTouched={!!touched?.permissions}
        />
      </FormCard>
    </MotionBox>
  );
};
