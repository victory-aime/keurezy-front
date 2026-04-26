'use client';
import { Formik } from 'formik';
import { FormContainer } from '../../components/FormContainer';
import { useEffect, useState } from 'react';
import { CONSTANTS, MODELS, VALIDATION } from '_types/*';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { BuildingModule, LandModule } from '_store/state-management';
import { findDynamicIdInList } from 'rise-core-frontend';
import { BuildingFormInner } from './BuildingFromInner';
import { useUserContext } from '_context/user-context';

export const BuildingForm = ({ buildingId }: { buildingId: string }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const [documentsURL, setDocumentsURL] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.CreateBuildingDto>({
    floors: 1,
  });

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const { data: allBuildings, isLoading: isAllBuildingLoad } =
    BuildingModule.getAllBuildingByAgencyQueries({
      params: {
        agencyId,
        userId,
        initialPage: CONSTANTS.PAGINATION.INIT,
        limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
      },
      queryOptions: { enabled: !!agencyId && !!userId },
    });

  const { data: allLands, isLoading: isAllLandLoad } = LandModule.getAllLandsByAgencyQueries({
    params: {
      agencyId,
      userId,
      initialPage: CONSTANTS.PAGINATION.INIT,
      limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
    },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const { mutateAsync: createBuilding, isPending: isCreateBuilding } =
    BuildingModule.createBuildingMutation({
      mutationOptions: {
        onSuccess: async () => {
          router.push(DASHBOARD_ROUTES.BUILDING.LIST);
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
        },
      },
    });

  const { mutateAsync: updateBuilding, isPending: isUpdateBuilding } =
    BuildingModule.updateBuildingMutation({
      mutationOptions: {
        onSuccess: async () => {
          router.push(DASHBOARD_ROUTES.BUILDING.LIST);
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
        },
      },
    });

  const onSubmit = async (data: MODELS.CreateBuildingDto) => {
    const formData = new FormData();
    const payload = {
      id: buildingId,
      name: data.name,
      description: data.description,
      city: data.city?.[0],
      district: data.district,
      address: data.address,
      buildingOwner: data.buildingOwner,
      status: data.status?.[0],
      floors: data.floors,
      agencyId,
      userId,
      landId: data.landId?.[0] ?? null,
    };

    formData.append('data', JSON.stringify(payload));

    if (data?.documents) {
      data.documents.forEach((file) => {
        formData.append('documents', file);
      });
    }

    if (buildingId) {
      await updateBuilding({
        payload: {
          data: formData as MODELS.UpdateBuildingDto,
        },
      });
    } else {
      await createBuilding({
        payload: {
          data: formData as MODELS.CreateBuildingDto,
        },
      });
    }
  };

  const getBuilding = findDynamicIdInList(buildingId, allBuildings?.content);

  useEffect(() => {
    if (buildingId && getBuilding) {
      setInitialValues({
        ...getBuilding,
        status: getBuilding?.status ? [getBuilding?.status] : [''],
        city: getBuilding?.city ? [getBuilding?.city] : [''],
        landId: getBuilding?.landId ? [getBuilding?.landId] : [],
      });
      setDocumentsURL(getBuilding?.documents);
    }
  }, [buildingId, allBuildings?.content, getBuilding]);

  return (
    <FormContainer
      pageTitle={buildingId ? 'Modifier ce bâtiment' : 'Nouveau bâtiment'}
      pageDescription={
        buildingId ? 'Modifier ce bâtiment' : 'Ajoutez un nouvel bâtiment à votre portefeuille'
      }
      isLoading={isAllBuildingLoad}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={VALIDATION.BULDING.createBuildingSchema}
      >
        <BuildingFormInner
          buildingId={buildingId}
          isCreateBuilding={isCreateBuilding}
          isAllLandLoad={isAllLandLoad}
          isUpdateBuilding={isUpdateBuilding}
          documentsURL={documentsURL}
          landsData={{
            content: allLands?.content ?? [],
          }}
        />
      </Formik>
    </FormContainer>
  );
};
