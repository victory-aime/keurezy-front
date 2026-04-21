'use client';
import { Formik } from 'formik';
import { FormContainer } from '../../components/FormContainer';

export const RentalAgreementForm = ({ appartId }: { appartId: string }) => {
  return (
    <Formik enableReinitialize initialValues={{}} onSubmit={() => {}} validationSchema={() => {}}>
      {({}) => (
        <FormContainer
          pageTitle={appartId ? 'Modifier le bien ' : 'Ajouter un bien'}
          pageDescription={'Renseignez les informations de votre propriété'}
          isLoading={false}
        >
          Form
        </FormContainer>
      )}
    </Formik>
  );
};
