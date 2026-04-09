"use client";
import { Formik } from "formik";
import { FormContainer } from "../../components/FormContainer";
import { useEffect, useState } from "react";
import { CONSTANTS, MODELS } from "_types/*";
import { Flex, VStack } from "@chakra-ui/react";
import { FormCard } from "../../components/FormCard";
import {
  ActionsButton,
  BaseText,
  BaseUploadMultipleFiles,
  FormSelect,
  FormTextArea,
  FormTextInput,
  Icons,
} from "_components/custom";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";
import { UserModule, BuildingModule } from "_store/state-management";
import { findDynamicIdInList } from "rise-core-frontend";
import { buildingStatusList, cityList } from "../constants/building";

export const BuildingForm = ({ buildingId }: { buildingId: string }) => {
  const router = useRouter();
  const [documentsURL, setDocumentsURL] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.CreateBuildingDto>({
    floors: 1,
  });

  const { data: currentUser } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });
  const agencyId = currentUser?.owner?.agency?.id;
  const ownerId = currentUser?.owner?.id;

  const { data: allBuildings, isLoading: isAllBuildingLoad } =
    BuildingModule.getAllBuildingByAgencyQueries({
      params: {
        agencyId,
        ownerId,
        initialPage: CONSTANTS.PAGINATION.INIT,
        limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
      },
      queryOptions: { enabled: !!buildingId && !!agencyId && !!ownerId },
    });

  const { mutateAsync: createBuilding, isPending: isCreateBuilding } =
    BuildingModule.createBuildingMutation({
      mutationOptions: {
        onSuccess: async () => {
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
          router.push(DASHBOARD_ROUTES.BUILDING.LIST);
        },
      },
    });

  const { mutateAsync: updateBuilding, isPending: isUpdateBuilding } =
    BuildingModule.updateBuildingMutation({
      mutationOptions: {
        onSuccess: async () => {
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
          router.push(DASHBOARD_ROUTES.BUILDING.LIST);
        },
      },
    });

  const onSubmit = async (data: MODELS.CreateBuildingDto) => {
    const formData = new FormData();
    formData.append("name", String(data.name));
    formData.append("description", String(data.description));
    formData.append("city", String(data.city?.[0]));
    formData.append("district", String(data.district));
    formData.append("address", String(data.address));
    formData.append("buildingOwner", String(data.buildingOwner));
    formData.append("status", String(data.status?.[0]));
    formData.append("floors", String(data.floors));
    formData.append("agencyId", String(agencyId));

    if (data?.landId) {
      formData.append("landId", data.landId);
    }
    if (data?.documents) {
      data.documents.forEach((file) => {
        formData.append("documents", file);
      });
    }

    if (buildingId) {
      formData.append("id", buildingId);
    }

    if (buildingId) {
      await updateBuilding({
        payload: {
          data: formData as MODELS.UpdateBuildingDto,
          ownerId: ownerId!,
        },
      });
    } else {
      await createBuilding({
        payload: {
          data: formData as MODELS.CreateBuildingDto,
          ownerId: ownerId!,
        },
      });
    }
  };

  useEffect(() => {
    if (buildingId) {
      const getBuilding = findDynamicIdInList(
        buildingId,
        allBuildings?.content,
      );
      setInitialValues({
        ...getBuilding,
        status: [getBuilding?.status],
        city: [getBuilding?.city],
        landId: [getBuilding?.landId],
      });
      setDocumentsURL(getBuilding?.documents);
    }
  }, [buildingId]);

  return (
    <FormContainer
      pageTitle={buildingId ? "Modifier ce bâtiment" : "Nouveau bâtiment"}
      pageDescription={
        buildingId
          ? "Modifier ce bâtiment"
          : "Ajoutez un nouvel bâtiment à votre portefeuille"
      }
      isLoading={isAllBuildingLoad}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, setFieldValue }) => (
          <VStack gap={3} alignItems={"flex-end"} width={"full"}>
            <Flex
              width={"full"}
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <FormCard title="Informations principales">
                <VStack width={"full"} mt={4} gap={4}>
                  <FormTextInput
                    required
                    name="name"
                    label="Nom du bâtiment"
                    placeholder="Residence Bosh"
                  />
                  <FormSelect
                    required
                    name="city"
                    label="Ville"
                    listItems={cityList}
                    setFieldValue={setFieldValue}
                  />
                  <FormTextInput
                    required
                    name="address"
                    label="Adresse complète"
                    placeholder="Cite avion ouakam"
                  />
                  <FormTextInput
                    required
                    name="buildingOwner"
                    label="Nom du propriétaire du bâtiment"
                    placeholder="Ahmed Toure"
                  />
                </VStack>
              </FormCard>

              <FormCard title="Informations secondaires">
                <VStack width={"full"} mt={4} gap={4}>
                  <FormTextInput
                    name="district"
                    label="Quartier"
                    placeholder="Grand Dakar"
                  />
                  <FormTextInput
                    type="number"
                    name="floors"
                    label="Nombre d'étages"
                    min={1}
                  />
                  <FormSelect
                    name="land"
                    label="Terrain"
                    placeholder="Lier ce bâtiment à un terrain"
                    listItems={[]}
                    setFieldValue={setFieldValue}
                  />
                  <FormSelect
                    name="status"
                    label="Status"
                    listItems={buildingStatusList}
                    setFieldValue={setFieldValue}
                  />
                  <BaseUploadMultipleFiles
                    initialImageUrls={documentsURL}
                    getFilesUploaded={(files) =>
                      setFieldValue("documents", files)
                    }
                    label={
                      <Flex fontSize={"sm"} alignItems={"center"} gap={2}>
                        <Icons.Paper />
                        <BaseText fontSize={"sm"}>
                          Documents(images, pdf, etc...)
                        </BaseText>
                      </Flex>
                    }
                  />
                </VStack>
              </FormCard>
            </Flex>
            <FormTextArea
              name="description"
              label="Description du bâtiment"
              placeholder="Décrivez les caractérisques du bâtiment plus en details ici...."
              maxCharacters={10000}
              autoresize
            />
            <ActionsButton
              validateTitle={buildingId ? "Modifier" : "Ajouter"}
              isLoading={isCreateBuilding || isUpdateBuilding}
              onCancel={() => router.push(DASHBOARD_ROUTES.BUILDING.LIST)}
              onClick={() => handleSubmit()}
              icon={buildingId ? <Icons.Edit /> : <Icons.PlusMinus />}
            />
          </VStack>
        )}
      </Formik>
    </FormContainer>
  );
};
