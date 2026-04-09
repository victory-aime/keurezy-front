import { HStack, VStack } from "@chakra-ui/react";
import {
  ActionsButton,
  FormSelect,
  FormTextInput,
  Icons,
  ModalOpenProps,
} from "_components/custom";
import { Formik } from "formik";
import { MODELS } from "_types/*";
import { useEffect, useState } from "react";
import { propertyStatusList, propertyTypes } from "../constants/properties";

export const PropertyFilter = ({
  onChange,
  isLoading,
  callback = () => {},
  data,
}: ModalOpenProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (data) {
      setShow(true);
    }
  }, [data]);

  return (
    <Formik
      enableReinitialize
      initialValues={{} as MODELS.IBuildingFilter}
      onSubmit={callback}
      onReset={onChange}
    >
      {({ setFieldValue, handleSubmit, resetForm }) => (
        <VStack
          width={"full"}
          gap={4}
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
        >
          <HStack width={"full"}>
            <FormTextInput
              name="title"
              label="Nom"
              placeholder="rechercher par nom"
            />
            <FormSelect
              required
              name="type"
              label="Type de propriété"
              placeholder="Sélectionner un type"
              listItems={propertyTypes}
              setFieldValue={setFieldValue}
            />

            <FormSelect
              required
              name="status"
              label="Statut"
              placeholder="Sélectionner un statut"
              listItems={propertyStatusList}
              setFieldValue={setFieldValue}
            />
          </HStack>
          <ActionsButton
            onClick={() => handleSubmit()}
            onCancel={() => resetForm()}
            cancelShow={show}
            cancelVariant={"outline"}
            cancelTitle={"COMMON.CLEAR_FILTER"}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            validateTitle="Appliquer les filtres"
            isLoading={isLoading}
            icon={<Icons.Search />}
          />
        </VStack>
      )}
    </Formik>
  );
};
