'use client';
import { Formik } from 'formik';
import { FormContainer } from '../../components/FormContainer';
import { useEffect, useState } from 'react';
import { CONSTANTS, ENUM, MODELS, VALIDATION } from '_types/*';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '../../routes';
import { UserModule, LandModule } from '_store/state-management';
import { findDynamicIdInList } from 'rise-core-frontend';
import { LandFormInner } from './LandFormInner';

export const LandForm = ({ landId }: { landId: string }) => {
  const router = useRouter();
  const [documentsURL, setDocumentsURL] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.CreateLandDto>({
    paymentType: [ENUM.LandPaymentType.CASH] as any,
  });

  const { data: currentUser } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });
  const agencyId = currentUser?.agencyId;

  const { data: allLands, isLoading: isAllLandsLoad } = LandModule.getAllLandsByAgencyQueries({
    params: {
      agencyId,
      initialPage: CONSTANTS.PAGINATION.INIT,
      limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
    },
    queryOptions: { enabled: !!agencyId },
  });

  const { mutateAsync: createLand, isPending: isCreateLand } = LandModule.createLandMutation({
    mutationOptions: {
      onSuccess: async () => {
        LandModule.LandCache.invalidateAllLandsCache();
        router.push(DASHBOARD_ROUTES.LAND.LIST);
      },
    },
  });

  const { mutateAsync: updateBuilding, isPending: isUpdateBuilding } =
    LandModule.updateLandMutation({
      mutationOptions: {
        onSuccess: async () => {
          LandModule.LandCache.invalidateAllLandsCache();
          router.push(DASHBOARD_ROUTES.LAND.LIST);
        },
      },
    });

  const onSubmit = async (data: MODELS.CreateLandDto) => {
    const formData = new FormData();
    const payload = {
      id: landId,
      title: data.title,
      purchasePrice: data.purchasePrice,
      area: data.area,
      city: data.city?.[0],
      paymentType: data.paymentType?.[0],
      district: data.district,
      address: data.address,
      landOwner: data.landOwner ?? null,
      status: data.status?.[0],
      agencyId,
    };

    formData.append('data', JSON.stringify(payload));

    if (data?.documents) {
      data.documents.forEach((file) => {
        formData.append('documents', file);
      });
    }

    if (landId) {
      await updateBuilding({
        payload: {
          data: formData as MODELS.UpdateLandDto,
        },
      });
    } else {
      await createLand({
        payload: {
          data: formData as MODELS.CreateLandDto,
        },
      });
    }
  };

  useEffect(() => {
    if (landId) {
      const getLand = findDynamicIdInList(landId, allLands?.content);
      setInitialValues({
        ...getLand,
        status: [getLand?.status],
        city: [getLand?.city],
        paymentType: [getLand?.paymentType],
      });
      setDocumentsURL(getLand?.documents);
    }
  }, [landId]);

  return (
    <FormContainer
      pageTitle={landId ? 'Modifier ce terrain' : 'Nouveau Terrain'}
      pageDescription={
        landId ? 'Modifier ce terrain' : 'Ajoutez un nouveau terrain à votre portefeuille'
      }
      isLoading={isAllLandsLoad}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={VALIDATION.LAND.createLandSchema}
      >
        <LandFormInner
          landId={landId}
          isCreateLand={isCreateLand}
          isUpdateBuilding={isUpdateBuilding}
          documentsURL={documentsURL}
        />
      </Formik>
    </FormContainer>
  );
};
