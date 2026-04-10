"use client";
import { Formik } from "formik";
import { FormContainer } from "../../components/FormContainer";
import { useEffect, useState } from "react";
import { CONSTANTS, MODELS, VALIDATION } from "_types/*";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";
import { UserModule, LandModule } from "_store/state-management";
import { findDynamicIdInList } from "rise-core-frontend";
import { LandFormInner } from "./LandFormInner";

export const LandForm = ({ landId }: { landId: string }) => {
  const router = useRouter();
  const [documentsURL, setDocumentsURL] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.CreateLandDto>(
    {} as MODELS.CreateLandDto,
  );

  const { data: currentUser } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });
  const agencyId = currentUser?.owner?.agency?.id;
  const ownerId = currentUser?.owner?.id;

  const { data: allLands, isLoading: isAllLandsLoad } =
    LandModule.getAllLandsByAgencyQueries({
      params: {
        agencyId,
        ownerId,
        initialPage: CONSTANTS.PAGINATION.INIT,
        limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
      },
      queryOptions: { enabled: !!agencyId && !!ownerId },
    });

  const { mutateAsync: createLand, isPending: isCreateLand } =
    LandModule.createLandMutation({
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
    formData.append("title", String(data.title));
    formData.append("city", String(data.city?.[0]));
    formData.append("address", String(data.address));
    formData.append("district", String(data.district));
    formData.append("purchasePrice", String(data.purchasePrice));
    formData.append("area", String(data.area));
    formData.append("landOwner", String(data.landOwner));
    formData.append("status", String(data.status?.[0]));
    formData.append("agencyId", String(agencyId));

    if (data?.documents) {
      data.documents.forEach((file) => {
        formData.append("documents", file);
      });
    }

    if (landId) {
      formData.append("id", landId);
    }
    if (ownerId) {
      formData.append("ownerId", ownerId);
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
      const getBuilding = findDynamicIdInList(landId, allLands?.content);
      setInitialValues({
        ...getBuilding,
        status: [getBuilding?.status],
        city: [getBuilding?.city],
      });
      setDocumentsURL(getBuilding?.documents);
    }
  }, [landId]);

  return (
    <FormContainer
      pageTitle={landId ? "Modifier ce terrain" : "Nouveau Terrain"}
      pageDescription={
        landId
          ? "Modifier ce terrain"
          : "Ajoutez un nouveau terrain à votre portefeuille"
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
