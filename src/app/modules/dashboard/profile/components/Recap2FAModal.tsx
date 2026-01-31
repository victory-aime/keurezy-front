import {
  BaseModal,
  FormTextInput,
  ModalOpenProps,
  BaseText,
} from "_components/custom";
import React from "react";
import { Formik } from "formik";
import { CiLock, CiUnlock } from "react-icons/ci";

export const Recap2FAModal = ({
  isOpen,
  onChange,
  callback = () => {},
  data,
  isLoading,
}: ModalOpenProps) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ password: "" }}
      onSubmit={(values, formikHelpers, actions) => {
        callback(values);
        actions.resetForm();
      }}
    >
      {({ handleSubmit }) => (
        <BaseModal
          title={data ? "Activer" : "Desactiver"}
          modalType={data ? "dialog" : "alertdialog"}
          isOpen={isOpen}
          onChange={onChange}
          onClick={() => handleSubmit()}
          buttonSaveTitle={data ? "COMMON.VALIDATE" : "COMMON.DEACTIVATE"}
          colorSaveButton={"tertiary"}
          isLoading={isLoading}
          icon={data ? <CiLock size={18} /> : <CiUnlock size={18} />}
          iconBackgroundColor={"tertiary.500"}
        >
          <BaseText mb={3}>
            {data
              ? "Vous allez activer le 2FA veuillez saisir votre mot de passe pour continuer"
              : "Vous allez desactiver le 2FA veuillez saisir votre mot de passe"}
          </BaseText>
          <FormTextInput
            name={"password"}
            label={"FORM.PASSWORD"}
            placeholder={"FORM.PASSWORD_PLACEHOLDER"}
          />
        </BaseModal>
      )}
    </Formik>
  );
};
