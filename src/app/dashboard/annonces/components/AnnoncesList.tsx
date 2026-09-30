'use client';

import {
  BaseContainer,
  BaseRatio,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
} from '_components/custom';
import { useUserContext } from '_context/user-context';
import React, { useState } from 'react';
import { AnnonceModule, PropertyModule } from '_store/state-management';
import { formatDisplayDate } from 'rise-core-frontend';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { Flex, Stack } from '@chakra-ui/react';
import { MODELS } from '_types/*';
import { AnnoncesDetails } from './AnnonceDetails';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { annonceDeleteImpact } from '_utils/impact';
import { ENUM } from '_types/';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';

export const AnnoncesList = () => {
  const { hasPermission } = usePermissions();
  const { push } = useRouter();
  const { user } = useUserContext();
  const [selectedValues, setSelectedValues] = useState<MODELS.IAnnonceResponse | null>(null);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const {
    data: allAnnonces,
    isLoading: isAnnonceLoad,
    refetch: reloadAnnonceList,
  } = AnnonceModule.getAllAnnoncesByAgency({
    params: { agencyId: agencyId! },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const closeDelete = async () => {
    setOpenDelete(false);
    await reloadAnnonceList();
  };

  const { mutateAsync: deleteAnnonce, isPending: isDeletePending } =
    AnnonceModule.deleteAnnonceMutation({ mutationOptions: { onSuccess: closeDelete } });

  // Alternative réversible à la suppression : l'annonce sort de la mise en ligne
  const { mutateAsync: updateAnnonce, isPending: isUnpublishing } =
    AnnonceModule.updateAnnonceMutation({ mutationOptions: { onSuccess: closeDelete } });

  // Impact du bien de l'annonce, chargé à l'ouverture de la confirmation
  const { data: propertyImpact, isLoading: isImpactLoading } =
    PropertyModule.getPropertyImpactQueries({
      params: { id: selectedValues?.propertyId ?? '' },
      queryOptions: {
        enabled:
          openDelete &&
          !!selectedValues?.propertyId &&
          hasPermission(AppPermissions.PROPERTIES.VIEW),
      },
    });
  const isOnline = selectedValues?.status === ENUM.COMMON.Status.ACTIVE;
  const canViewImpact = hasPermission(AppPermissions.PROPERTIES.VIEW);
  // Sans accès aux biens, impact générique : la suppression reste possible
  const deleteSummary =
    canViewImpact && !propertyImpact
      ? undefined
      : annonceDeleteImpact({ isOnline }, propertyImpact);

  const unpublish = async () => {
    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({ id: selectedValues?.id, status: ENUM.COMMON.Status.INACTIVE }),
    );
    await updateAnnonce({ payload: formData as MODELS.ICreateAnnonce });
  };

  const annonceColumns: ColumnsDataTable[] = [
    {
      header: 'Titre',
      accessor: 'fullObject',
      cell: (data) => {
        return (
          <Flex gap={2} width={'full'} alignItems={'center'}>
            <BaseRatio image={data?.galleryImages[0]} width={{ base: 130, sm: '1/5' }} />
            <Stack gap={0}>
              <BaseText fontWeight={'bold'}> {data?.title} </BaseText>
              <BaseText fontSize={'sm'}> {data?.galleryImages?.length} photos </BaseText>
            </Stack>
          </Flex>
        );
      },
    },
    {
      header: 'Bien concerné',
      accessor: 'fullObject',
      cell: (data) => data?.property?.title,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell(status) {
        return <BaseTag status={status} />;
      },
    },
    {
      header: 'Publié le',
      accessor: 'publishedAt',
      cell(date) {
        return (
          <BaseText fontSize={'sm'}>{formatDisplayDate(date) ?? 'Pas encore publié'}</BaseText>
        );
      },
    },

    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        {
          name: 'edit',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.PUBLISH),
          handleClick(data) {
            push(`${DASHBOARD_ROUTES.ANNONCES.ADD}/?annonceId=${data?.id}`);
          },
        },
        {
          name: 'view',
          handleClick(data) {
            setSelectedValues(data);
            setOpenDetails(true);
          },
        },
        {
          name: 'delete',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.UNPUBLISH),
          handleClick(data) {
            setSelectedValues(data);
            setOpenDelete(true);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      border={'none'}
      title={'Annonces'}
      description={'Créez et gérez les annonces pour vos propriétés'}
      withActionButtons
      actionsButtonProps={{
        validateTitle: 'Nouvelle annonce',
        // Point d'entrée masqué sans la permission de création
        validatePermission: hasPermission(AppPermissions.PROPERTIES.PUBLISH),
        onReload: async () => {
          await reloadAnnonceList();
        },
        onClick() {
          push(DASHBOARD_ROUTES.ANNONCES.ADD);
        },
      }}
    >
      <DataTableContainer
        data={allAnnonces ?? []}
        columns={annonceColumns}
        isLoading={isAnnonceLoad}
        notFoundTitle={"Créez votre première annonce à partir d'une propriété existante."}
        hidePagination
      />
      <AnnoncesDetails
        data={selectedValues}
        onChange={setOpenDetails}
        isOpen={openDetails}
        isLoading={isAnnonceLoad}
        callback={() => {
          setOpenDelete(true);
        }}
      />
      <ActionImpactDialog
        isOpen={openDelete}
        onChange={(open: boolean) => setOpenDelete(open)}
        title="Supprimer cette annonce"
        subject={selectedValues?.title}
        summary={deleteSummary}
        isLoadingImpact={isImpactLoading}
        isSubmitting={isDeletePending || isUnpublishing}
        confirmTitle="Supprimer définitivement"
        onConfirm={() => selectedValues?.id && deleteAnnonce({ params: { id: selectedValues.id } })}
        alternative={
          isOnline && hasPermission(AppPermissions.PROPERTIES.PUBLISH)
            ? { title: 'Dépublier plutôt', onClick: unpublish }
            : undefined
        }
      />
    </BaseContainer>
  );
};
