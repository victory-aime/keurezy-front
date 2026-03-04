"use client";
import { Formik } from "formik";
import { FormContainer } from "../../components/FormContainer";
import { PropertyModule, UserModule } from "_store/state-management";

export const RentalAgreementForm = ({ appartId }: { appartId: string }) => {
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

  return (
    <Formik
      enableReinitialize
      initialValues={{}}
      onSubmit={() => {}}
      validationSchema={() => {}}
    >
      {({}) => (
        <FormContainer
          pageTitle={appartId ? "Modifier le bien " : "Ajouter un bien"}
          pageDescription={"Renseignez les informations de votre propriété"}
          isLoading={fetchLoading}
        >
          Form
        </FormContainer>
      )}
    </Formik>
  );
};
