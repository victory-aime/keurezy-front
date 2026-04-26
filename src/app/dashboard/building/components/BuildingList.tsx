'use client';
import { VStack } from '@chakra-ui/react';
import {
  BaseContainer,
  BaseTag,
  BaseText,
  BaseToast,
  ColumnsDataTable,
  DataTableContainer,
  ToastStatus,
} from '_components/custom';
import { useMemo, useState } from 'react';
import { BuildingFilter } from './BuildingFilter';
import { LandModule, BuildingModule } from '_store/state-management';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { CONSTANTS, MODELS } from '_types/*';
import { BuildingDelete } from './BuildingDelete';
import { BuildingDetails } from './BuildingDetail';
import { FormikValues } from 'formik';
import { IuseExportData, PDFService } from 'rise-core-frontend';
import { useTranslation } from 'react-i18next';
import { BuildingStatsCard } from './BuildingStats';
import { useUserContext } from '_context/user-context';

export const BuildingList = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user: currentUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  const { exportTableToPdf } = PDFService.ExportService();
  const [exportLoading, setExportLoading] = useState(false);
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedValues, setSelectedValues] = useState<MODELS.IBuilding | null>(null);
  const [filterValues, setFilterValues] = useState<MODELS.IBuildingFilter | null>(null);

  const agencyId = currentUser?.agencyId;
  const userId = currentUser?.ownerId ?? currentUser?.staffId;

  const queryPayload = useMemo(
    () => ({
      params: {
        ...filterValues,
        agencyId,
        userId,
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
    data: allBuildings,
    isLoading: isBuildingLoad,
    refetch: reloadBuildingList,
  } = BuildingModule.getAllBuildingByAgencyQueries(queryPayload);

  const { mutateAsync: deleteBuilding, isPending: isDeletePending } =
    BuildingModule.deleteBuildingMutation({
      mutationOptions: {
        onSuccess: async () => {
          setFilterValues(null);
          await reloadBuildingList();
        },
      },
    });

  const buildingColumns: ColumnsDataTable[] = [
    { header: 'Bâtiment', accessor: 'name' },
    {
      header: 'Structure',
      accessor: 'fullObject',
      cell: (value) => (
        <VStack alignItems={'flex-start'} gap={0}>
          <BaseText>{value?.floors} étages</BaseText>
          <BaseText fontSize={'xs'}>{value?.properties.length ?? 0} apparts</BaseText>
        </VStack>
      ),
    },
    {
      header: 'adresse',
      accessor: 'fullObject',
      cell: (value) => (
        <VStack alignItems={'flex-start'} gap={0}>
          <BaseText>{value?.address}</BaseText>
          <BaseText fontSize={'xs'}>
            {value?.city} ,{value?.district}
          </BaseText>
        </VStack>
      ),
    },
    // {
    //   header: "Loyer",
    //   accessor: "loyer_mensuel",
    //   cell: (value) => <BaseFormatNumber value={value} />,
    // },
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
            router.push(`${DASHBOARD_ROUTES.BUILDING.ADD}?buildingId=${data?.id}`);
          },
        },
        {
          name: 'delete',
          handleClick(data) {
            setOpenDelete(true);
            setSelectedValues(data);
          },
        },
      ],
    },
  ];

  const handleDeleteBuilding = async (data: MODELS.IDeleteBuilding) => {
    await deleteBuilding({ params: data });
  };

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
    await reloadBuildingList();
  };

  const paginationAction = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportPdf = async () => {
    if (allBuildings?.content?.length === 0) {
      return BaseToast({
        title: 'Export impossible',
        description: "Vous ne pouvez pas exporter la liste car vous ne disposer d'aucun bâtiment",
        type: ToastStatus.INFO,
      });
    }
    setExportLoading(true);
    const translatedColumns = buildingColumns.map((col) => ({
      ...col,
      header: t(col.header),
    }));
    await exportTableToPdf(
      allBuildings?.content as unknown as IuseExportData[],
      'Liste des Bâtiments',
      translatedColumns,
    );
  };

  return (
    <BaseContainer
      title="Gestion des Bâtiments"
      description="Gérez vos bâtiments avec efficacité"
      border={'none'}
      withActionButtons
      isFilterActive={toggleFilter}
      onToggleFilter={() => setToggleFilter(!toggleFilter)}
      filterComponent={
        <BuildingFilter
          isOpen={false}
          onChange={async () => {
            setToggleFilter(!toggleFilter);
            await handleResetFilter();
          }}
          data={filterValues}
          callback={handleFilter}
        />
      }
      actionsButtonProps={{
        validateTitle: 'Ajouter',
        downloadTitle: `Exporter PDF (${allBuildings?.content?.length ?? 0})`,
        onClick() {
          router.push(DASHBOARD_ROUTES.BUILDING.ADD);
        },
        onDownload: async () => {
          await handleExportPdf().then(() => !exportLoading);
        },
        onReload: async () => {
          await reloadBuildingList();
        },
        onToggleFilter() {
          setToggleFilter(true);
        },
      }}
    >
      <BuildingStatsCard buildings={allBuildings?.content ?? []} isLoading={isBuildingLoad} />

      <DataTableContainer
        isLoading={isBuildingLoad}
        data={allBuildings?.content ?? []}
        paginationData={{
          lazy: true,
          currentPage: 1,
          totalDataPerPage: allBuildings?.totalDataPerPages || 5,
          onLazyLoad(index) {
            paginationAction(index);
          },
          totalItems: allBuildings?.totalItems,
          totalPages: allBuildings?.totalPages,
        }}
        hidePagination={allBuildings?.totalPages === 1}
        columns={buildingColumns}
        notFoundTitle="Aucun bâtiment trouvé"
      />
      <BuildingDelete
        onChange={setOpenDelete}
        isOpen={openDelete}
        isLoading={isDeletePending}
        data={selectedValues}
        callback={() =>
          handleDeleteBuilding({
            agencyId: agencyId!,

            id: selectedValues?.id!,
          })
        }
      />
      <BuildingDetails
        onChange={setOpenDetails}
        isOpen={openDetails}
        data={selectedValues}
        isLoading={isBuildingLoad}
        callback={() => {
          setOpenDetails(false);
          setOpenDelete(true);
        }}
      />
    </BaseContainer>
  );
};
