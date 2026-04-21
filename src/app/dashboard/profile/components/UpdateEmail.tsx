import { BaseModal, BaseText, ModalOpenProps } from '_components/custom';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineMail } from 'react-icons/hi';

export const UpdateEmailModal: FC<ModalOpenProps> = ({ isOpen, onChange, callback, isLoading }) => {
  const { t } = useTranslation();
  return (
    <BaseModal
      size={'md'}
      isOpen={isOpen}
      ignoreFooter={false}
      onChange={onChange}
      onClick={callback}
      title="PROFILE.EMAIL_UPDATE"
      icon={<HiOutlineMail />}
      iconBackgroundColor="primary.300"
      isLoading={isLoading}
    >
      <BaseText textAlign={'center'}>{t('PROFILE.EMAIL_UPDATE_INFO')}</BaseText>
    </BaseModal>
  );
};
