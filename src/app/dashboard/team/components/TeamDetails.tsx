import { Flex, Box, Stack, HStack } from '@chakra-ui/react';
import {
  BaseButton,
  BaseDrawer,
  BaseIcon,
  BaseTag,
  BaseText,
  CustomSkeletonLoader,
  Icons,
  ISelectedCheckboxElement,
  ModalOpenProps,
  PermissionListGroup,
} from '_components/custom';
import { FormCard } from '../../components/FormCard';
import { CONSTANTS, ENUM, MODELS } from '_types/*';
import { SelectedPermissionsRecap } from '../../components/SelectedPermissionsRecap';
import { useEffect, useMemo, useState } from 'react';
import { groupPermissionsByCategory } from '_hooks/groupedPermissions';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { CommonModule, TeamModule } from '_store/state-management';
import { UserRole } from '../../../../types/enum';

interface TeamDetails extends ModalOpenProps {
  data: MODELS.ITeam | null;
  /** Membre mis à jour après l'enregistrement de ses permissions */
  onUpdated?: (member: MODELS.ITeam) => void;
}

export const TeamDetails = ({
  isOpen,
  onChange,
  data,
  isLoading,
  callback,
  onUpdated,
}: TeamDetails) => {
  const { user: authUser } = useAuthContext();
  const { user } = useUserContext();
  const agencyId = user?.agencyId;
  // Seul le propriétaire modifie les permissions (vérifié aussi par l'API)
  const isOwner = authUser?.role === UserRole.OWNER;
  const isActive = data?.status === ENUM.COMMON.Status.ACTIVE;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const grantedIds = useMemo(
    () => (data?.permissions ?? []).filter((p) => p.granted).map((p) => p.permissionId),
    [data],
  );

  // Nouveau membre ou fermeture : retour en consultation
  useEffect(() => {
    setIsEditing(false);
    setSelectedIds(grantedIds);
  }, [grantedIds, isOpen]);

  const defaultPermissions = useMemo(() => {
    if (!data?.permissions) return [];
    return groupPermissionsByCategory(data);
  }, [data]);

  const { data: allPermissions, isLoading: isPermissionsLoading } =
    CommonModule.getAllPermissionsByAgencyQueries({
      params: { agencyId: agencyId! },
      queryOptions: { enabled: !!agencyId && isOwner && isEditing },
    });

  const { mutateAsync: updatePermissions, isPending: isSaving } =
    TeamModule.updateTeamPermissionsMutation({
      mutationOptions: {
        onSuccess: (response) => {
          setIsEditing(false);
          onUpdated?.(response.member);
        },
      },
    });

  // Sélection initiale du sélecteur, au format des groupes de l'API
  const editorDefaults = useMemo((): ISelectedCheckboxElement[] => {
    if (!allPermissions) return [];
    const granted = new Set(grantedIds);
    return allPermissions.map((group) => ({
      category: group.category,
      permissions: group.permissions
        .filter((permission) => granted.has(permission.id))
        .map((permission) => ({ id: permission.id, granted: true })),
    }));
  }, [allPermissions, grantedIds]);

  const handlePermissionChange = (groups: ISelectedCheckboxElement[]) =>
    setSelectedIds(
      groups.flatMap((group) => group.permissions.filter((p) => p.granted).map((p) => p.id)),
    );

  const save = async () => {
    if (!data?.id || !agencyId) return;
    // Une permission dont la feature n'est plus dans le plan est retirée
    const assignable = new Set(
      (allPermissions ?? []).flatMap((group) => group.permissions.map((p) => p.id)),
    );
    await updatePermissions({
      payload: {
        staffId: data.id,
        permissionIds: [...new Set(selectedIds)].filter((id) => assignable.has(id)),
      },
      params: { agencyId },
    });
  };

  return (
    <BaseDrawer
      title={'Detail du membre'}
      description={' Visualisation des informations du membre'}
      size={'xl'}
      icon={<Icons.User />}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter
    >
      <Box
        borderLeftWidth={2}
        boxShadow={'sm'}
        borderRadius={'lg'}
        borderColor={'primary.500'}
        p={4}
        mb={4}
      >
        {isLoading ? (
          <Flex gap={2} justifyContent={'space-between'}>
            <HStack gap={2}>
              <CustomSkeletonLoader type="BUTTON" colorButton="primary" width={'40px'} />
              <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
            </HStack>
            <CustomSkeletonLoader type="BUTTON" colorButton="primary" width={'110px'} />
          </Flex>
        ) : (
          <Flex alignItems={'center'} justifyContent={'space-between'} gap={5}>
            <HStack alignItems={'flex-start'}>
              <BaseIcon>
                <Icons.User />
              </BaseIcon>
              <Stack gap={1} alignItems={'flex-start'}>
                <BaseText>{data?.name}</BaseText>
                <BaseText color={'gray.600'}>{data?.email}</BaseText>
                <BaseTag
                  label={
                    CONSTANTS.AGENCY_ROLE_LIST.find((r) => r.value === (data?.role as string))
                      ?.label ?? data?.role
                  }
                  textTransform={'capitalize'}
                />
              </Stack>
            </HStack>
            <BaseButton
              colorType={isActive ? 'danger' : 'tertiary'}
              variant={'outline'}
              onClick={() => callback?.()}
            >
              {isActive ? 'Désactiver' : 'Activer'}
            </BaseButton>
          </Flex>
        )}
      </Box>

      <FormCard
        title="Permissions"
        description={
          isEditing
            ? 'Cochez les permissions accordées à ce membre. Elles s’appliquent à sa prochaine connexion ou au rechargement de sa page.'
            : undefined
        }
        loader={isLoading || (isEditing && isPermissionsLoading)}
      >
        {isOwner && (
          <Flex justify="flex-end" gap={2} mb={3} mt={4} width="full">
            {isEditing ? (
              <>
                <BaseButton
                  variant={'outline'}
                  colorType={'secondary'}
                  disabled={isSaving}
                  onClick={() => {
                    setSelectedIds(grantedIds);
                    setIsEditing(false);
                  }}
                >
                  Annuler
                </BaseButton>
                <BaseButton
                  leftIcon={<Icons.Save />}
                  isLoading={isSaving}
                  disabled={isPermissionsLoading}
                  onClick={save}
                >
                  Enregistrer
                </BaseButton>
              </>
            ) : (
              <BaseButton
                variant={'outline'}
                leftIcon={<Icons.Edit size={14} />}
                onClick={() => setIsEditing(true)}
              >
                Modifier les permissions
              </BaseButton>
            )}
          </Flex>
        )}

        {isEditing ? (
          allPermissions && (
            <PermissionListGroup
              // Remonté à l'ouverture pour repartir des permissions actuelles
              key={`${data?.id}-${allPermissions.length}`}
              groupList={allPermissions}
              onChange={handlePermissionChange}
              defaultValues={editorDefaults}
            />
          )
        ) : (
          <SelectedPermissionsRecap permissions={defaultPermissions} />
        )}
      </FormCard>
    </BaseDrawer>
  );
};
