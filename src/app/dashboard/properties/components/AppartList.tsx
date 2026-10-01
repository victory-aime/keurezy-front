'use client';

import {
  BaseContainer,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  BaseFormatNumber,
} from '_components/custom';
import { BuildingModule, PropertyModule } from '_store/state-management';
import { CONSTANTS, MODELS } from '_types/*';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { PropertyStatsCard } from './AppartStats';
import { useMemo, useState } from 'react';
import { FormikValues } from 'formik';
import { PropertyFilter } from './PropertyFilter';
import { useUserContext } from '_context/user-context';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { propertyCloseImpact, propertyDeleteImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import { PropertyDetails } from './PropertyDetails';
import {
  assetStatusColumn,
  isInactiveAsset,
  useReactivateAssetAction,
} from '../../components/InactiveAsset';
import { useFeatureGuard } from '_hooks/useFeatureGuard';

export const PropertyList = () => {
  const router = useRouter();
  // Boutons « Ajouter » : pop-up « limite atteinte » quand le plan est plein
  const { guard, limitModal: propertyLimitModal } = useFeatureGuard('manage_properties');
  const { guard: guardAnnonce, limitModal: annonceLimitModal } =
    useFeatureGuard('publish_properties');
  const limitModal = (
    <>
      {propertyLimitModal}
      {annonceLimitModal}
    </>
  );
  const { user } = useUserContext();
  const { hasPermission } = usePermissions();
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<MODELS.IAgencyFilters | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  // Action destructrice en cours de confirmation : son impact est chargé à l'ouverture
  const [pending, setPending] = useState<{
    action: 'close' | 'delete';
    property: MODELS.IPropertyResponse;
  } | null>(null);

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

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
    [filterValues, currentPage, agencyId, userId],
  );

  const {
    data: allProperties,
    isLoading,
    refetch: refetchProperty,
  } = PropertyModule.getAllPropertiesByAgency(queryPayload);

  const { data: impact, isLoading: isImpactLoading } = PropertyModule.getPropertyImpactQueries({
    params: { id: pending?.property.id ?? '' },
    queryOptions: { enabled: !!pending },
  });

  const afterAction = {
    mutationOptions: {
      onSuccess: async () => {
        setPending(null);
        await refetchProperty();
      },
    },
  };
  const { mutate: closeProperty, isPending: isClosing } =
    PropertyModule.closePropertyMutation(afterAction);
  const { mutate: deleteProperty, isPending: isDeleting } =
    PropertyModule.deletePropertyMutation(afterAction);

  const isDelete = pending?.action === 'delete';

  const { data: allBuildings } = BuildingModule.getAllBuildingByAgencyQueries({
    params: {
      agencyId: agencyId!,
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

  // Bien désactivé par un downgrade : réactivable par l'owner dans la limite du plan
  const reactivateAction = useReactivateAssetAction('PROPERTY', refetchProperty);

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
      cell: (propertyNumber) => <BaseText>{propertyNumber ?? '-'}</BaseText>,
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

    assetStatusColumn,
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        reactivateAction,
        {
          name: 'view',
          title: 'Voir le bien',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.VIEW),
          handleClick(data) {
            setDetailId(data.id);
          },
        },
        {
          name: 'edit',
          isDisabled: (data) =>
            !hasPermission(AppPermissions.PROPERTIES.UPDATE) || isInactiveAsset(data),
          handleClick(data) {
            router.push(`${DASHBOARD_ROUTES.PROPERTIES.ADD}?requestId=${data?.id}`);
          },
        },
        {
          name: 'publish',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.PUBLISH),
          handleClick() {
            guardAnnonce(() => router.push(DASHBOARD_ROUTES.ANNONCES.ADD));
          },
        },
        {
          // Fermer : retire les annonces en ligne, conserve le bien et son historique
          name: 'close',
          title: 'Fermer le bien',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.UPDATE),
          handleClick(data) {
            setPending({ action: 'close', property: data });
          },
        },
        {
          name: 'delete',
          title: 'Supprimer le bien',
          isDisabled: () => !hasPermission(AppPermissions.PROPERTIES.DELETE),
          handleClick(data) {
            setPending({ action: 'delete', property: data });
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      border={'none'}
      title={'Propriétés'}
      description={"Gérez l'ensemble de vos propriétés locative avec efficacité"}
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
        // Point d'entrée masqué sans la permission de création
        validatePermission: hasPermission(AppPermissions.PROPERTIES.CREATE),
        isEmailVerified: user?.emailVerified,
        onReload: async () => {
          await refetchProperty();
        },
        onClick: () => {
          guard(() => router.push(DASHBOARD_ROUTES.PROPERTIES.ADD));
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
      <PropertyDetails propertyId={detailId} onClose={() => setDetailId(null)} />
      <ActionImpactDialog
        isOpen={!!pending}
        onChange={(open: boolean) => !open && setPending(null)}
        title={isDelete ? 'Supprimer ce bien' : 'Fermer ce bien'}
        subject={pending?.property.title}
        summary={
          impact
            ? isDelete
              ? propertyDeleteImpact(impact)
              : propertyCloseImpact(impact)
            : undefined
        }
        isLoadingImpact={isImpactLoading}
        isSubmitting={isClosing || isDeleting}
        confirmTitle={isDelete ? 'Supprimer définitivement' : 'Fermer le bien'}
        confirmColor={isDelete ? 'danger' : 'warning'}
        onConfirm={() => {
          if (!pending) return;
          const params = { id: pending.property.id };
          if (isDelete) deleteProperty({ params });
          else closeProperty({ params });
        }}
        // Suppression bloquée par l'historique : proposer la fermeture, plus sûre
        alternative={
          isDelete && hasPermission(AppPermissions.PROPERTIES.UPDATE)
            ? {
                title: 'Fermer le bien plutôt',
                onClick: () =>
                  pending && setPending({ action: 'close', property: pending.property }),
              }
            : undefined
        }
      />
      {limitModal}
    </BaseContainer>
  );
};
