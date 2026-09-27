import { BaseModal, BaseText, FormTextArea, Icons, ModalOpenProps } from '_components/custom';
import { MODELS } from '_types/*';
import { Formik } from 'formik';
import * as Yup from 'yup';

const rejectSchema = Yup.object({
  reason: Yup.string()
    .trim()
    .required('Indiquez le motif du refus : il sera transmis au client.')
    .max(500, 'Le motif ne doit pas dépasser 500 caractères.'),
});

/** Refus d'une demande : le motif est obligatoire et notifié au client. */
export const RejectBookingModal = ({
  isOpen,
  onChange,
  isLoading,
  data,
  callback = () => {},
}: ModalOpenProps & { data: MODELS.IAgencyBooking | null }) => {
  return (
    <Formik
      initialValues={{ reason: '' }}
      validationSchema={rejectSchema}
      onSubmit={callback}
      enableReinitialize
    >
      {({ handleSubmit }) => (
        <BaseModal
          title="Refuser la demande"
          icon={<Icons.Close />}
          iconBackgroundColor="red.600"
          size={'md'}
          description={`Demande de ${data?.client?.name ?? 'ce client'} pour « ${data?.property?.title ?? ''} »`}
          isOpen={isOpen}
          onChange={onChange}
          isLoading={isLoading}
          onClick={() => handleSubmit()}
          buttonSaveTitle="Refuser"
          colorSaveButton="danger"
        >
          <BaseText fontSize={'sm'} color={'fg.muted'} mb={3}>
            Le client sera notifié avec ce motif. Les dates restent disponibles pour d’autres
            demandes.
          </BaseText>
          <FormTextArea
            required
            name="reason"
            label="Motif du refus"
            placeholder="Ex : le bien est en travaux à ces dates"
          />
        </BaseModal>
      )}
    </Formik>
  );
};
