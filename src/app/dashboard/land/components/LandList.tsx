'use client';
import {
  BaseContainer,
  BaseFormatNumber,
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
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { landDeleteImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import {
  assetStatusColumn,
  isInactiveAsset,
  useReactivateAssetAction,
} from '../../components/InactiveAsset';

export const LandList = () => {
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const { user: currentUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedValues, setSelectedValues] = useState<MODELS.LandResponseDto | null>(null);
  const [filterValues, setFilterValues] = useState<MODELS.ILandFilter | null>(null);
  // Terrain dont on confirme la suppression (l'impact est chargé à l'ouverture)
  const [landToDelete, setLandToDelete] = useState<MODELS.LandResponseDto | null>(null);

  const agencyId = currentUser?.agencyId;
  const userId = currentUser?.ownerId ?? currentUser?.staffId;

  const queryPayload = useMemo(
    () => ({
      params: {
        ...filterValues,
        agencyId: agencyId!,
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

  const { data: landImpact, isLoading: isImpactLoading } = LandModule.getLandImpactQueries({
    params: { id: landToDelete?.id ?? '' },
    queryOptions: { enabled: !!landToDelete },
  });

  const { mutate: deleteLand, isPending: isDeleting } = LandModule.deleteLandMutation({
    mutationOptions: {
      onSuccess: async () => {
        setLandToDelete(null);
        await reloadLandsList();
      },
    },
  });

  // Bien désactivé par un downgrade : réactivable par l'owner dans la limite du plan
  const reactivateAction = useReactivateAssetAction('LAND', reloadLandsList);

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
    assetStatusColumn,
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        reactivateAction,
        {
          name: 'view',
          handleClick(data) {
            setOpenDetails(true);
            setSelectedValues(data);
          },
        },
        {
          name: 'edit',
          isDisabled: (data) => !hasPermission(AppPermissions.LAND.MANAGE) || isInactiveAsset(data),
          handleClick(data) {
            router.push(`${DASHBOARD_ROUTES.LAND.ADD}?landId=${data?.id}`);
          },
        },
        {
          name: 'delete',
          isDisabled: () => !hasPermission(AppPermissions.LAND.MANAGE),
          handleClick(data) {
            setLandToDelete(data);
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
        // Point d'entrée masqué sans la permission de création
        validatePermission: hasPermission(AppPermissions.LAND.MANAGE),
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
          // Bouton « Supprimer » du détail : même confirmation avec impact que la liste
          setOpenDetails(false);
          setLandToDelete(selectedValues);
        }}
      />
      <ActionImpactDialog
        isOpen={!!landToDelete}
        onChange={(open: boolean) => !open && setLandToDelete(null)}
        title="Supprimer ce terrain"
        subject={landToDelete?.title}
        summary={landImpact ? landDeleteImpact(landImpact) : undefined}
        isLoadingImpact={isImpactLoading}
        isSubmitting={isDeleting}
        confirmTitle="Supprimer définitivement"
        onConfirm={() => landToDelete && deleteLand({ params: { id: landToDelete.id } })}
      />
    </BaseContainer>
  );
};
