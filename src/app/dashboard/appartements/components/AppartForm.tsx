import { Formik } from "formik";
import { BaseDrawer, FormTextInput, ModalOpenProps } from "_components/custom";
import { VStack } from "@chakra-ui/react";
import { BsFillBuildingsFill } from "react-icons/bs";
import { useEffect, useState } from "react";

export const AppartForm = ({
  isOpen,
  onChange,
  callback = () => {},
  data,
}: ModalOpenProps) => {
  const [initialValues, setInitialValues] = useState({} as any);

  useEffect(() => {
    if (data) {
      setInitialValues(data);
    }
    if (!isOpen) {
      setInitialValues({});
    }
  }, [data, isOpen]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={callback}
    >
      {({ handleSubmit }) => (
        <BaseDrawer
          title={"Appartement Form"}
          icon={<BsFillBuildingsFill />}
          iconBackgroundColor={"secondary.500"}
          onChange={onChange}
          isOpen={isOpen}
          callback={() => handleSubmit}
        >
          <VStack>
            <FormTextInput name={"name"} />
            <FormTextInput name={"name"} />
            <FormTextInput name={"name"} />
            <FormTextInput name={"name"} />
          </VStack>
        </BaseDrawer>
      )}
    </Formik>
  );
};
