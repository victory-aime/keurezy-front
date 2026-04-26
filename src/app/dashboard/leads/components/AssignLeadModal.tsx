import { BaseModal, Icons, FormSelect, ModalOpenProps } from '_components/custom';
import { Formik } from 'formik';

export const AssignLeadModal = ({
  isOpen,
  onChange,
  isLoading,
  agentList,
  callback = () => {},
  staffListLoad
}: ModalOpenProps) => {
  return (
    <Formik initialValues={{ staffId: '' }} onSubmit={callback}>
      {({ setFieldValue, handleSubmit }) => (
        <BaseModal
          title="Assigner la tâche"
          icon={<Icons.Assignment />}
          iconBackgroundColor="yellow.700"
          size={'md'}
          description="Veuillez choisir l'agent qui va s'occuper de cette demande"
          isOpen={isOpen}
          onChange={onChange}
          isLoading={isLoading}
          onClick={() => handleSubmit()}
          colorSaveButton="warning"
        >
          <FormSelect name={'staffId'} setFieldValue={setFieldValue} listItems={agentList ?? []} isLoading={staffListLoad} />
        </BaseModal>
      )}
    </Formik>
  );
};
