'use client';

import {
  BaseContainer,
  BaseText,
  ColumnsDataTable,
  BaseTag,
  DataTableContainer,
  BaseFormatNumber,
} from '_components/custom';
import { BuildingModule, PropertyModule } from '_store/state-management';
import { CONSTANTS, ENUM, MODELS } from '_types/*';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { PropertyStatsCard } from './AppartStats';
import { useMemo, useState } from 'react';
import { FormikValues } from 'formik';
import { PropertyFilter } from './PropertyFilter';
import { useUserContext } from '_context/user-context';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';

export const PropertyList = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { hasPermission } = usePermissions();
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<MODELS.IAgencyFilters | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

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
    [filterValues, currentPage, agencyId, userId],
  );

  const {
    data: allProperties,
    isLoading,
    refetch: refetchProperty,
  } = PropertyModule.getAllPropertiesByAgency(queryPayload);

  const { data: allBuildings } = BuildingModule.getAllBuildingByAgencyQueries({
    params: {
      agencyId,
      userId,
      limitPerPage: CONSTANTS.PAGINATION.FULL_PAGE_SIZE,
    },
    queryOptions: {
      enabled: !!agencyId && !!userId,
    },
  });

  const handleFilter = async (values: FormikValues) => {
    setFilterValues({
      ...values,
      type: values?.type && values?.type[0],
      status: values?.status && values?.status[0],
    });
    setCurrentPage(currentPage);
  };

  const handleResetFilter = async () => {
    setFilterValues(null);
    setCurrentPage(currentPage);
    await refetchProperty();
  };

  const paginationAction = (page: number) => {
    setCurrentPage(page);
  };

  const extractName = (buildingId: string) => {
    const data = allBuildings?.content.find((item) => item.id === buildingId);
    return data?.name;
  };

  const appartColumns: ColumnsDataTable[] = [
    {
      header: '',
      accessor: 'select',
    },
    {
      header: 'Propriété',
      accessor: 'title',
    },
    {
      header: 'Immeuble/proprietaire',
      accessor: 'fullObject',
      cell: (values) => (
        <BaseText>
          {values.batimentId ? extractName(values?.batimentId) : values?.propertyOwner}
        </BaseText>
      ),
    },
    {
      header: 'Numéro',
      accessor: 'propertyNumber',
      cell: (propertyNumber) => <BaseText>{propertyNumber ?? 'Aucun'}</BaseText>,
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (type: string) =>
        CONSTANTS.propertyTypes.find((item) => item.value === type)?.label || type,
    },
    {
      header: 'Loyer',
      accessor: 'price',
      cell: (price: number) => <BaseFormatNumber value={price} />,
    },

    {
      header: 'Status',
      accessor: 'status',
      cell: (status: ENUM.COMMON.Status) => <BaseTag status={status} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        {
          name: 'edit',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.UPDATE),
          handleClick(data) {
            router.push(`${DASHBOARD_ROUTES.PROPERTIES.ADD}?requestId=${data?.id}`);
          },
        },
        {
          name: 'publish',
          handleClick() {
            router.push(DASHBOARD_ROUTES.ANNONCES.ADD);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      border={'none'}
      title={'Propriétes'}
      description={"Gérez l'ensemble de vos propriétes locative avec efficacité"}
      loader={isLoading}
      numberOfLines={2}
      withActionButtons
      isFilterActive={toggleFilter}
      onToggleFilter={() => setToggleFilter(!toggleFilter)}
      filterComponent={
        <PropertyFilter
          isOpen={false}
          isLoading={isLoading}
          onChange={async () => {
            setToggleFilter(!toggleFilter);
            await handleResetFilter();
          }}
          data={filterValues}
          callback={handleFilter}
        />
      }
      actionsButtonProps={{
        validateTitle: 'Ajouter une propriété',
        isEmailVerified: user?.emailVerified,
        onReload: async () => {
          await refetchProperty();
        },
        onClick: () => {
          router.push(DASHBOARD_ROUTES.PROPERTIES.ADD);
        },
      }}
    >
      <PropertyStatsCard properties={allProperties?.content ?? []} isLoading={isLoading} />

      <DataTableContainer
        data={allProperties?.content ?? []}
        columns={appartColumns}
        isLoading={isLoading}
        paginationData={{
          lazy: true,
          totalItems: allProperties?.totalItems,
          totalDataPerPage: allProperties?.totalDataPerPages || 5,
          onLazyLoad: (index) => paginationAction(index),
          currentPage,
          totalPages: allProperties?.totalPages,
        }}
        hidePagination={allProperties?.totalPages === 1}
      />
    </BaseContainer>
  );
};
