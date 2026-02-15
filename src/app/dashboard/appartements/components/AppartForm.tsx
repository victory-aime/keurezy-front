import { Formik, FormikValues } from "formik";
import {
  BaseDragDropZone,
  BaseDrawer,
  FormSelect,
  FormTextArea,
  FormTextInput,
  ModalOpenProps,
} from "_components/custom";
import { createListCollection, HStack, VStack } from "@chakra-ui/react";
import { BsFillBuildingsFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { MODELS, CONSTANTS, VALIDATION } from "_types/";

export const AppartForm = ({
  isOpen,
  onChange,
  isLoading,
  callback = () => {},
  data,
}: ModalOpenProps) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.ICreateProperty>(
    {} as MODELS.ICreateProperty,
  );

  useEffect(() => {
    if (data) {
      setInitialValues({
        ...data,
        type: data.type ? [data.type] : [],
        country: data.country ? [data.country] : [],
        city: data.city ? [data.city] : [],
      });
      setGalleryImages(data?.galleryImages || []);
    }
    if (!isOpen) {
      setInitialValues({});
      setGalleryImages([]);
    }
  }, [data, isOpen]);

  const propertyTypes = createListCollection({
    items: CONSTANTS.propertyTypes.map((type) => ({
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
      type: values.type?.[0] || "",
      country: values.country?.[0] || "",
      city: values.city?.[0] || "",
    };
    callback(request);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={VALIDATION.PROPERTY_VALIDATION.createPropertySchema}
    >
      {({ handleSubmit, setFieldValue, errors, resetForm, values }) => (
        <BaseDrawer
          title={
            data?.id ? "Modifier votre appartement" : "Ajouter un appartement"
          }
          icon={<BsFillBuildingsFill />}
          iconBackgroundColor={"secondary.500"}
          onChange={() => {
            onChange(false);
            resetForm();
          }}
          isOpen={isOpen}
          callback={() => handleSubmit()}
          size={"lg"}
          buttonSaveTitle={data?.id ? "COMMON.EDIT" : "COMMON.ADD"}
          isLoading={isLoading}
        >
          <VStack gap={4}>
            <HStack width={"full"}>
              <FormTextInput
                label={"Titre de l'annonce de l'appartement"}
                placeholder={"Appartement à louer à Paris"}
                name={"title"}
              />
              <FormTextInput
                label={"Prix de location par mois"}
                placeholder="Prix de location par mois"
                name={"price"}
                type="amount"
              />
            </HStack>
            <HStack width={"full"}>
              <FormTextInput
                label={"Adresse"}
                placeholder="Adresse"
                name={"address"}
              />
              <FormSelect
                name={"type"}
                label={"Type de propriété"}
                placeholder="Type de propriété"
                listItems={propertyTypes}
                setFieldValue={setFieldValue}
              />
            </HStack>
            <HStack width={"full"}>
              <FormTextInput
                label={"Surface en m²"}
                placeholder="Surface en m²"
                name={"surface"}
                type="number"
              />
              <FormTextInput
                label={"Nombre de chambre"}
                placeholder={"Nombre de chambre"}
                name={"rooms"}
                type="number"
              />
            </HStack>
            <HStack width={"full"}>
              <FormSelect
                name={"country"}
                label={"Pays"}
                placeholder={"Pays"}
                listItems={countryList}
                setFieldValue={setFieldValue}
                onChangeFunc={() => {
                  setFieldValue("city", []);
                }}
              />
              <FormSelect
                name={"city"}
                label={"Ville"}
                placeholder={"Ville"}
                listItems={getCityList(values?.country?.[0]!)}
                setFieldValue={setFieldValue}
              />
            </HStack>
            <FormTextArea
              label={"Description de l'appartement"}
              placeholder={"Description de l'appartement"}
              name={"description"}
              maxCharacters={1000}
            />
            <BaseDragDropZone
              getFilesUploaded={(files) =>
                setFieldValue("galleryImages", files)
              }
              initialImageUrls={galleryImages}
              maxFiles={4}
              label={"Glisser et déposer les images de l'appartement ici"}
              messageInfo={errors?.galleryImages as string}
            />
          </VStack>
        </BaseDrawer>
      )}
    </Formik>
  );
};
