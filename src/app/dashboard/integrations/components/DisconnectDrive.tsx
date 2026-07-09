import { DeleteModalAnimation, Icons, ModalOpenProps } from '_components/custom';
import React from 'react';

export const DisconnectDrive = ({
  isOpen,
  callback = () => {},
  isLoading,
  onChange,
}: ModalOpenProps) => {
  return (
    <DeleteModalAnimation
      title="Déconnecter Google Drive"
      icon={<Icons.Trash />}
      size="sm"
      isOpen={isOpen}
      callback={callback}
      isLoading={isLoading}
      onChange={onChange}
      ignoreFooter={false}
      buttonSaveTitle={'Déconnecter'}
    >
      La déconnexion désynchronisera votre compte Google Drive de l'application. Vos fichiers
      resteront disponibles dans votre espace Google Drive et ne seront pas supprimés. Vous pourrez
      reconnecter votre compte à tout moment pour rétablir la synchronisation.
    </DeleteModalAnimation>
  );
};
