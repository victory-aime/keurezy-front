"use client";
import { Formik, FormikValues } from "formik";
import {
  ActionsButton,
  BaseRadio,
  BaseText,
  FormSelect,
  FormTextInput,
  Icons,
} from "_components/custom";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MODELS, CONSTANTS, VALIDATION } from "_types/";
import { FormCard } from "../../components/FormCard";
import { FormContainer } from "../../components/FormContainer";
import { useRouter } from "next/navigation";
import {
  BuildingModule,
  PropertyModule,
  UserModule,
} from "_store/state-management";
import { findDynamicIdInList } from "rise-core-frontend";
import { cityList } from "_constants/city";
import { DASHBOARD_ROUTES } from "../../routes";
import {
  getBuildingsList,
  propertyStatusList,
  propertyTypes,
} from "../constants/properties";

export const PropertyForm = ({ appartId }: { appartId: string }) => {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<MODELS.ICreateProperty>(
    {} as MODELS.ICreateProperty,
  );

  const { data: user } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });

  const agencyId = user?.agencyId;

  const { data: allProperties, isLoading: fetchLoading } =
    PropertyModule.getAllPropertiesByAgency({
      params: {
        agencyId,
        initialPage: CONSTANTS.PAGINATION.INIT,
        limitPerPage: CONSTANTS.PAGINATION.FULL_PAGE_SIZE,
      },
      queryOptions: {
        enabled: !!agencyId,
      },
    });

  const { data: allBuildings, isLoading: isAllBuildingsLoad } =
    BuildingModule.getAllBuildingByAgencyQueries({
      params: {
        agencyId,
        initialPage: CONSTANTS.PAGINATION.INIT,
        limitPerPage: CONSTANTS.PAGINATION.FULL_PAGE_SIZE,
      },
      queryOptions: {
        enabled: !!agencyId,
      },
    });

  const { mutateAsync: createProperty, isPending: createPending } =
    PropertyModule.createPropertyMutation({
      mutationOptions: {
        onSuccess: async () => {
          PropertyModule.PropertyCache.invalidateAllPropertyCache();
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
          router.back();
        },
      },
    });

  const { mutateAsync: updateProperty, isPending: updatePending } =
    PropertyModule.updatePropertyMutation({
      mutationOptions: {
        onSuccess: async () => {
          PropertyModule.PropertyCache.invalidateAllPropertyCache();
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
          router.back();
        },
      },
    });

  const getProperty = findDynamicIdInList(appartId, allProperties?.content);

  useEffect(() => {
    if (appartId && getProperty) {
      setInitialValues({
        ...getProperty,
        type: getProperty.type ? [getProperty.type] : [],
        batimentId: getProperty.batimentId ? [getProperty.batimentId] : [],
        city: getProperty.city ? [getProperty.city] : [],
        status: getProperty.status ? [getProperty.status] : [],
        hasBatiment: getProperty.batimentId ? true : false,
      });
    }
    if (!appartId) {
      setInitialValues({
        hasBatiment: true,
        agencyId: agencyId!,
      });
    }
  }, [appartId, getProperty]);

  const handleCreateProperty = async (values: FormikValues) => {
    const { hasBatiment, ...rest } = values;

    const request: MODELS.ICreateProperty = {
      ...rest,
      agencyId: agencyId!,
      batimentId: hasBatiment ? values.batimentId?.[0] : null,
      type: values.type?.[0],
      city: values.city?.[0],
      status: values.status?.[0],
    };

    if (appartId) {
      await updateProperty({
        payload: request,
        params: { appartId },
      });
    } else {
      await createProperty({
        payload: request,
      });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialValues,
        bathrooms: 1,
        area: 1,
        rooms: 1,
        hasBatiment: getProperty?.batimentId ? true : false,
      }}
      onSubmit={handleCreateProperty}
      validationSchema={VALIDATION.PROPERTY_VALIDATION.createPropertySchema}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <FormContainer
          pageTitle={appartId ? "Modifier le bien " : "Ajouter un bien"}
          pageDescription={"Renseignez les informations de votre propriété"}
          isLoading={fetchLoading}
        >
          <VStack gap={3} alignItems={"flex-end"} width={"full"}>
            <Flex
              width={"full"}
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <FormCard title="Informations principales">
                <VStack width={"full"} mt={4} gap={4}>
                  <HStack
                    width="full"
                    flexDir={{ base: "column", sm: "row" }}
                    gap={4}
                  >
                    <FormTextInput
                      required
                      label="Nom de la propriéte"
                      placeholder="Ex: Appartement à louer à Mermoz"
                      name="title"
                      isLoading={fetchLoading}
                    />
                    <FormSelect
                      required
                      name="type"
                      label="Type de propriété"
                      placeholder="Sélectionner un type"
                      listItems={propertyTypes}
                      setFieldValue={setFieldValue}
                    />
                  </HStack>

                  <HStack
                    width="full"
                    flexDir={{ base: "column", sm: "row" }}
                    gap={4}
                  >
                    <FormSelect
                      required
                      name="status"
                      label="Statut"
                      placeholder="Sélectionner un statut"
                      listItems={propertyStatusList}
                      setFieldValue={setFieldValue}
                    />
                    <FormTextInput
                      label="Loyer mensuel"
                      placeholder="Ex: 1500"
                      name="price"
                      type="amount"
                    />

                    <FormTextInput
                      label="Dépôt de garantie"
                      placeholder="Ex: 500"
                      name="caution" // ✅ corrigé
                      type="amount"
                    />
                  </HStack>
                  <HStack
                    width="full"
                    flexDir={{ base: "column", sm: "row" }}
                    gap={4}
                  >
                    <FormTextInput
                      required
                      label="Surface (m²)"
                      placeholder="Ex: 120"
                      name="area"
                      type="number"
                    />

                    <FormTextInput
                      required
                      label="Nombre de chambres"
                      placeholder="Ex: 3"
                      name="rooms"
                      type="number"
                    />

                    <FormTextInput
                      required
                      label="Nombre de salles de bain"
                      placeholder="Ex: 2"
                      name="bathrooms"
                      type="number"
                    />
                  </HStack>
                </VStack>
              </FormCard>
            </Flex>
          </VStack>
          {/* 🔥 QUESTION */}
          <BaseText mb={3}>
            Cette propriété est-elle dans un bâtiment ?
          </BaseText>
          <BaseRadio
            colorPalette="purple"
            value={values.hasBatiment ? "yes" : "no"}
            items={[
              { label: "Oui", value: "yes" },
              { label: "Non", value: "no" },
            ]}
            onValueChange={(details) => {
              if (details?.value === "yes") {
                setFieldValue("hasBatiment", true);
              } else {
                setFieldValue("hasBatiment", false);
                setFieldValue("batimentId", []);
                setFieldValue("propertyNumber", null);
              }
            }}
          />
          {/* ==================== LOCALISATION ==================== */}
          <FormCard title="Localisation">
            <VStack gap={8} mt={4} width={"full"}>
              {/* 🏢 CAS BATIMENT */}
              {values.hasBatiment && (
                <HStack width={"full"}>
                  <FormSelect
                    required
                    name="batimentId"
                    label="Bâtiment"
                    placeholder="Lier cette propriéte à un bâtiment"
                    listItems={getBuildingsList({
                      content: allBuildings?.content ?? [],
                    })}
                    setFieldValue={setFieldValue}
                    isLoading={isAllBuildingsLoad}
                  />
                  <FormTextInput
                    required
                    label="Numéro"
                    placeholder="Ex: A3,ZZ0"
                    name="propertyNumber"
                    isLoading={fetchLoading}
                  />
                </HStack>
              )}

              {/* 🏠 CAS SANS BATIMENT */}
              {!values.hasBatiment && (
                <VStack gap={4} mt={4} width={"full"}>
                  <HStack
                    width="full"
                    flexDir={{ base: "column", sm: "row" }}
                    gap={4}
                  >
                    <FormSelect
                      required
                      name="city"
                      label="Ville"
                      placeholder="Sélectionner une ville"
                      listItems={cityList}
                      setFieldValue={setFieldValue}
                    />
                    <FormTextInput
                      required
                      label="Quartier"
                      placeholder="Ex: Niarry Tally"
                      name="district"
                    />
                  </HStack>

                  <HStack
                    width="full"
                    flexDir={{ base: "column", sm: "row" }}
                    gap={4}
                  >
                    <FormTextInput
                      required
                      name="address"
                      label="Adresse complète"
                      placeholder="Cite avion ouakam"
                    />
                    <FormTextInput
                      required
                      name="propertyOwner"
                      label="Nom du propriétaire"
                      placeholder="Ahmed Toure"
                    />
                  </HStack>
                </VStack>
              )}
            </VStack>
          </FormCard>
          <ActionsButton
            justifyContent={"flex-end"}
            onClick={() => handleSubmit()}
            onCancel={() => router.push(DASHBOARD_ROUTES.PROPERTIES.LIST)}
            isLoading={createPending || updatePending}
            validateTitle={appartId ? "Modiler le bien" : "Ajouter le bien"}
            isEmailVerified={user?.emailVerified}
            icon={<Icons.RiBuildingLine />}
          />
        </FormContainer>
      )}
    </Formik>
  );
};
