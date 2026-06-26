'use client';
import {
  BaseContainer,
  BaseFormatNumber,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
} from '_components/custom';
import { useMemo, useState } from 'react';
import { LandFilter } from './LandFilter';
import { LandModule } from '_store/state-management';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { CONSTANTS, MODELS } from '_types/*';
import { LandDetails } from './LandDetails';
import { FormikValues } from 'formik';
import { LandStatsCard } from './LandStats';
import { useUserContext } from '_context/user-context';

export const LandList = () => {
  const router = useRouter();
  const { user: currentUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedValues, setSelectedValues] = useState<MODELS.LandResponseDto | null>(null);
  const [filterValues, setFilterValues] = useState<MODELS.ILandFilter | null>(null);

  const agencyId = currentUser?.agencyId;
  const userId = currentUser?.ownerId ?? currentUser?.staffId;

  const queryPayload = useMemo(
    () => ({
      params: {
        ...filterValues,
        agencyId: agencyId!,
        userId: userId!,
        initialPage: currentPage,
        limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
      },
      queryOptions: {
        enabled: !!agencyId && !!userId,
      },
    }),
    [filterValues, currentPage, agencyId],
  );

  const {
    data: allLands,
    isLoading: isLandLoad,
    isFetching,
    refetch: reloadLandsList,
  } = LandModule.getAllLandsByAgencyQueries(queryPayload);

  const landColumns: ColumnsDataTable[] = [
    { header: 'Terrain', accessor: 'title' },
    {
      header: 'Prix de vente',
      accessor: 'purchasePrice',
      cell: (value) => <BaseFormatNumber value={value} />,
    },
    {
      header: 'ville',
      accessor: 'city',
      cell: (value) => (
        <BaseText textTransform={'capitalize'} fontSize={'sm'}>
          {value}
        </BaseText>
      ),
    },
    {
      header: 'adresse',
      accessor: 'address',
      cell: (value) => <BaseText fontSize={'sm'}>{value ?? 'Aucune addresse'}</BaseText>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => <BaseTag status={value} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        {
          name: 'view',
          handleClick(data) {
            setOpenDetails(true);
            setSelectedValues(data);
          },
        },
        {
          name: 'edit',
          handleClick(data) {
            router.push(`${DASHBOARD_ROUTES.LAND.ADD}?landId=${data?.id}`);
          },
        },
      ],
    },
  ];

  const handleFilter = async (values: FormikValues) => {
    setFilterValues({
      ...values,
      city: values?.city && values?.city[0],
      status: values?.status && values?.status[0],
    });
    setCurrentPage(currentPage);
  };

  const handleResetFilter = async () => {
    setFilterValues(null);
    setCurrentPage(currentPage);
    await reloadLandsList();
  };

  const paginationAction = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <BaseContainer
      title="Gestion des Terrains"
      description="Gérez vos terrains avec efficacité"
      border={'none'}
      withActionButtons
      isFilterActive={toggleFilter}
      onToggleFilter={() => setToggleFilter(!toggleFilter)}
      filterComponent={
        <LandFilter
          isOpen={false}
          onChange={async () => {
            setToggleFilter(!toggleFilter);
            await handleResetFilter();
          }}
          data={filterValues}
          callback={handleFilter}
          isLoading={isLandLoad || isFetching}
        />
      }
      actionsButtonProps={{
        validateTitle: 'Ajouter',
        downloadTitle: `Exporter PDF (${allLands?.content?.length ?? 0})`,
        onClick() {
          router.push(DASHBOARD_ROUTES.LAND.ADD);
        },
        onReload: async () => {
          await reloadLandsList();
        },
        onToggleFilter() {
          setToggleFilter(true);
        },
      }}
    >
      <LandStatsCard lands={allLands?.content ?? []} isLoading={isLandLoad || isFetching} />

      <DataTableContainer
        isLoading={isLandLoad || isFetching}
        data={allLands?.content ?? []}
        paginationData={{
          lazy: true,
          currentPage: 1,
          totalDataPerPage: allLands?.totalDataPerPages || 5,
          onLazyLoad(index) {
            paginationAction(index);
          },
          totalItems: allLands?.totalItems,
          totalPages: allLands?.totalPages,
        }}
        hidePagination={allLands?.totalPages === 1}
        columns={landColumns}
        notFoundTitle="Aucun Terrain trouvé"
      />
      <LandDetails
        onChange={setOpenDetails}
        isOpen={openDetails}
        data={selectedValues}
        isLoading={isLandLoad || isFetching}
        callback={() => {
          setOpenDetails(false);
        }}
      />
    </BaseContainer>
  );
};
