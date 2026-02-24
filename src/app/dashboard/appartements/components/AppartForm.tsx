"use client";
import { Formik, FormikValues } from "formik";
import {
  ActionsButton,
  BaseDragDropZone,
  FormSelect,
  FormTextArea,
  FormTextInput,
  Icons,
} from "_components/custom";
import { createListCollection, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MODELS, CONSTANTS, VALIDATION } from "_types/";
import { FormCard } from "../../components/FormCard";
import { FormContainer } from "../../components/FormContainer";
import { useRouter } from "next/navigation";
import { PropertyModule, UserModule } from "_store/state-management";
import { findDynamicIdInList } from "rise-core-frontend";

export const AppartForm = ({ appartId }: { appartId: string }) => {
  const router = useRouter();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.ICreateProperty>(
    {} as MODELS.ICreateProperty,
  );

  const { data: user } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });

  const {
    data: allProperties,
    isLoading: fetchLoading,
    refetch: refectProperty,
  } = PropertyModule.getAllPropertiesByAgency({
    params: {
      agencyId: user?.propertyOwner?.propertyAgency?.id,
    },
    queryOptions: {
      enabled: !!user?.propertyOwner?.propertyAgency?.id && !!appartId,
    },
  });

  const { mutateAsync: createProperty, isPending: createPending } =
    PropertyModule.createPropertyMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refectProperty();
          router.back();
        },
      },
    });

  const handleCreateProperty = async (data: MODELS.ICreateProperty) => {
    const formData = new FormData();
    formData.append("title", String(data.title));
    formData.append("description", String(data.description));
    formData.append("type", String(data.type));
    formData.append("country", String(data.country));
    formData.append("city", String(data.city));
    formData.append("address", String(data.address));
    formData.append("price", String(data.price));
    formData.append("surface", String(data.surface));
    formData.append("rooms", String(data.rooms));
    formData.append("sdb", String(data.sdb));
    formData.append("postalCode", String(data.postalCode));
    formData.append("locationCaution", String(data.locationCaution));
    formData.append("status", String(data.status));
    formData.append(
      "propertyAgenceId",
      String(user?.propertyOwner?.propertyAgency.id),
    );
    if (data.galleryImages) {
      data.galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });
    }
    if (data?.id) {
      console.log("update property with id", data?.id);
    } else {
      await createProperty({ payload: formData as MODELS.ICreateProperty });
    }
  };

  const getProperty = findDynamicIdInList(appartId, allProperties);

  useEffect(() => {
    if (appartId && getProperty) {
      setInitialValues({
        ...getProperty,
        type: getProperty.type ? [getProperty.type] : [],
        country: getProperty.country ? [getProperty.country] : [],
        city: getProperty.city ? [getProperty.city] : [],
        status: getProperty.status ? [getProperty.status] : [],
      });
      setGalleryImages(getProperty?.galleryImages || []);
    }
    if (!appartId) {
      setInitialValues({});
      setGalleryImages([]);
    }
  }, [appartId, getProperty]);

  const propertyTypes = createListCollection({
    items: CONSTANTS.propertyTypes.map((type) => ({
      label: type.label,
      value: type.value,
    })),
  });

  const propertyStatusList = createListCollection({
    items: CONSTANTS.propertyStatus.map((type) => ({
      label: type.label,
      value: type.value,
    })),
  });

  const countryList = createListCollection({
    items: CONSTANTS.countryList.map((country) => ({
      label: country.label,
      value: country.value,
    })),
  });

  const getCityList = (value: string) => {
    const cities = CONSTANTS.citiesByCountry[value] || [];
    return createListCollection({
      items:
        cities.map((city) => ({
          label: city.label,
          value: city.value,
        })) || [],
    });
  };

  const onSubmit = (values: FormikValues) => {
    const request: MODELS.ICreateProperty = {
      ...values,
      type: values.type?.[0],
      country: values.country?.[0],
      city: values.city?.[0],
      status: values.status?.[0],
    };
    handleCreateProperty(request);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={VALIDATION.PROPERTY_VALIDATION.createPropertySchema}
    >
      {({ handleSubmit, setFieldValue, errors, values }) => (
        <FormContainer
          pageTitle={appartId ? "Modifier le bien " : "Ajouter un bien"}
          pageDescription={"Renseignez les informations de votre propriété"}
          isLoading={fetchLoading}
        >
          <VStack gap={8}>
            {/* ==================== INFORMATIONS GENERALES ==================== */}
            <FormCard
              title="Informations générales"
              description="Détails principaux du bien"
            >
              <FormTextInput
                label="Titre du bien"
                placeholder="Ex: Appartement à louer à Paris"
                name="title"
                isLoading={fetchLoading}
              />

              <HStack width="full" gap={4}>
                <FormSelect
                  name="type"
                  label="Type de propriété"
                  placeholder="Sélectionner un type"
                  listItems={propertyTypes}
                  setFieldValue={setFieldValue}
                />

                <FormSelect
                  name="status"
                  label="Statut du bien"
                  placeholder="Sélectionner un statut"
                  listItems={propertyStatusList} // ⚠️ utiliser la bonne liste
                  setFieldValue={setFieldValue}
                />
              </HStack>

              <FormTextArea
                label="Description"
                placeholder="Décrivez votre bien..."
                name="description"
                maxCharacters={1000}
              />
            </FormCard>

            {/* ==================== LOCALISATION ==================== */}
            <FormCard title="Localisation">
              <FormTextInput
                label="Adresse"
                placeholder="Adresse complète"
                name="address"
              />

              <HStack width="full" gap={4}>
                <FormSelect
                  name="country"
                  label="Pays"
                  placeholder="Sélectionner un pays"
                  listItems={countryList}
                  setFieldValue={setFieldValue}
                  onChangeFunc={() => {
                    setFieldValue("city", []);
                  }}
                />

                <FormTextInput
                  label="Code postal"
                  placeholder="45800"
                  name="postalCode"
                  type="number"
                />

                <FormSelect
                  name="city"
                  label="Ville"
                  placeholder="Sélectionner une ville"
                  listItems={getCityList(values?.country?.[0]!)}
                  setFieldValue={setFieldValue}
                />
              </HStack>
            </FormCard>

            {/* ==================== CARACTÉRISTIQUES ==================== */}
            <FormCard title="Caractéristiques">
              <HStack width="full" gap={4}>
                <FormTextInput
                  label="Surface (m²)"
                  placeholder="Ex: 120"
                  name="surface"
                  type="number"
                />

                <FormTextInput
                  label="Nombre de chambres"
                  placeholder="Ex: 3"
                  name="rooms"
                  type="number"
                />

                <FormTextInput
                  label="Nombre de salles de bain"
                  placeholder="Ex: 2"
                  name="sdb" // ✅ corrigé
                  type="number"
                />
              </HStack>
            </FormCard>

            {/* ==================== TARIFICATION ==================== */}
            <FormCard title="Tarification">
              <HStack width="full" gap={4}>
                <FormTextInput
                  label="Loyer mensuel"
                  placeholder="Ex: 1500"
                  name="price"
                  type="amount"
                />

                <FormTextInput
                  label="Dépôt de garantie"
                  placeholder="Ex: 500"
                  name="locationCaution" // ✅ corrigé
                  type="amount"
                />
              </HStack>
            </FormCard>

            {/* ==================== PHOTOS ==================== */}
            <FormCard
              title="Photos"
              description="Ajoutez des photos pour illustrer votre bien"
            >
              <BaseDragDropZone
                getFilesUploaded={(files) =>
                  setFieldValue("galleryImages", files)
                }
                initialImageUrls={galleryImages}
                maxFiles={4}
                messageInfo={errors?.galleryImages as string}
              />
            </FormCard>
          </VStack>
          <ActionsButton
            justifyContent={"flex-end"}
            onClick={() => handleSubmit()}
            onCancel={() => router.back()}
            isLoading={createPending}
            validateTitle={appartId ? "Modiler le bien" : "Ajouter le bien"}
            icon={<Icons.RiBuildingLine />}
          />
        </FormContainer>
      )}
    </Formik>
  );
};
