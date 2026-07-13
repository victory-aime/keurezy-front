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
import { AnnonceModule } from '_store/state-management';
import { formatDisplayDate } from 'rise-core-frontend';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { Flex, Stack } from '@chakra-ui/react';
import { MODELS } from '_types/*';
import { DeleteAnnonce } from './DeleteAnnonce';
import { AnnoncesDetails } from './AnnonceDetails';

export const AnnoncesList = () => {
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
    params: { agencyId: agencyId!, userId: userId! },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const { mutateAsync: deleteAnnonce, isPending: isDeletePending } =
    AnnonceModule.deleteAnnonceMutation({
      mutationOptions: {
        onSuccess: async () => {
          await reloadAnnonceList();
        },
      },
    });

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
      <DeleteAnnonce
        onChange={setOpenDelete}
        isOpen={openDelete}
        isLoading={isDeletePending}
        callback={async () =>
          await deleteAnnonce({
            params: { id: selectedValues?.id!, userId: userId!, agencyId: agencyId! },
          })
        }
        ignoreFooter={false}
      />
    </BaseContainer>
  );
};
