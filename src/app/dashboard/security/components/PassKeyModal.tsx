import { BaseText, BaseModal, ModalOpenProps, Icons, FormTextInput } from '_components/custom';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const PassKeyModal: FC<ModalOpenProps> = ({
  isOpen,
  onChange,
  callback = () => {},
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <Formik
      enableReinitialize
      initialValues={{ passkeyName: '' }}
      onSubmit={callback}
      validationSchema={Yup.object({
        passkeyName: Yup.string()
          .required('Veuillez renseigner le nom de votre clé')
          .min(3, 'Le nom de la clé doit contenir au moins 3 caractères'),
      })}
    >
      {({ handleSubmit, isValid, resetForm }) => (
        <BaseModal
          title={'PROFILE.SECURITY.ADD_PASS_KEY'}
          isOpen={isOpen}
          size={'md'}
          isLoading={isLoading}
          onClick={() => handleSubmit()}
          onChange={() => {
            onChange(!isOpen);
            resetForm();
          }}
          disabled={!isValid || isLoading}
          ignoreFooter={false}
          icon={<Icons.Key />}
        >
          <BaseText textAlign={'center'} mb={5}>
            {t('PROFILE.SECURITY.ADD_PASS_KEY_INFO')}
          </BaseText>
          <FormTextInput
            name="passkeyName"
            label="PROFILE.SECURITY.PASS_KEY_NAME"
            placeholder="PROFILE.SECURITY.PASS_KEY_NAME"
            leftAccessory={<Icons.Key />}
          />
        </BaseModal>
      )}
    </Formik>
  );
};
