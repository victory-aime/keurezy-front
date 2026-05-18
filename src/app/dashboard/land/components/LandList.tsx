'use client';
import {
  BaseContainer,
  BaseFormatNumber,
  BaseTag,
  BaseText,
  BaseToast,
  ColumnsDataTable,
  DataTableContainer,
  ToastStatus,
} from '_components/custom';
import { useMemo, useState } from 'react';
import { LandFilter } from './LandFilter';
import { LandModule } from '_store/state-management';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { CONSTANTS, MODELS } from '_types/*';
import { LandDelete } from './LandDelete';
import { LandDetails } from './LandDetails';
import { FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import { LandStatsCard } from './LandStats';
import { useUserContext } from '_context/user-context';

export const LandList = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user: currentUser } = useUserContext();
  const [currentPage, setCurrentPage] = useState(1);
  // const { exportTableToPdf } = PDFService.ExportService();
  const [exportLoading, setExportLoading] = useState(false);
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedValues, setSelectedValues] = useState<MODELS.LandResponseDto | null>(null);
  const [filterValues, setFilterValues] = useState<MODELS.ILandFilter | null>(null);

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
    data: allLands,
    isLoading: isLandLoad,
    refetch: reloadLandsList,
  } = LandModule.getAllLandsByAgencyQueries(queryPayload);

  const { mutateAsync: deleteLand, isPending: isLandPending } = LandModule.deleteLandMutation({
    mutationOptions: {
      onSuccess: async () => {
        setFilterValues(null);
        await reloadLandsList();
      },
    },
  });

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

  const handleDeleteLand = async (data: any) => {
    await deleteLand({ params: data });
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
    await reloadLandsList();
  };

  const paginationAction = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportPdf = async () => {
    if (allLands?.content?.length === 0) {
      return BaseToast({
        title: 'Export impossible',
        description: "Vous ne pouvez pas exporter la liste car vous ne disposer d'aucun terrain",
        type: ToastStatus.INFO,
      });
    }
    setExportLoading(true);
    const translatedColumns = landColumns.map((col) => ({
      ...col,
      header: t(col.header),
    }));
    // await exportTableToPdf(
    //   allLands?.content as unknown as IuseExportData[],
    //   'Liste des Terrains',
    //   translatedColumns,
    // );
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
        />
      }
      actionsButtonProps={{
        validateTitle: 'Ajouter',
        downloadTitle: `Exporter PDF (${allLands?.content?.length ?? 0})`,
        onClick() {
          router.push(DASHBOARD_ROUTES.LAND.ADD);
        },
        onDownload: async () => {
          await handleExportPdf().then(() => !exportLoading);
        },
        onReload: async () => {
          await reloadLandsList();
        },
        onToggleFilter() {
          setToggleFilter(true);
        },
      }}
    >
      <LandStatsCard lands={allLands?.content ?? []} isLoading={isLandLoad} />

      <DataTableContainer
        isLoading={isLandLoad}
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
      <LandDelete
        onChange={setOpenDelete}
        isOpen={openDelete}
        isLoading={isLandPending}
        data={selectedValues}
        callback={() => handleDeleteLand({})}
      />
      <LandDetails
        onChange={setOpenDetails}
        isOpen={openDetails}
        data={selectedValues}
        isLoading={isLandLoad}
        callback={() => {
          setOpenDetails(false);
          setOpenDelete(true);
        }}
      />
    </BaseContainer>
  );
};
