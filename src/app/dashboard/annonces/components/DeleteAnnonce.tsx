import { DeleteModalAnimation, ModalOpenProps } from '_components/custom';

export const DeleteAnnonce = ({ onChange, isOpen, isLoading, callback }: ModalOpenProps) => {
  return (
    <DeleteModalAnimation
      title={'Supprimer une annonce'}
      onChange={onChange}
      isOpen={isOpen}
      isLoading={isLoading}
      callback={callback}
      ignoreFooter={false}
    >
      Voulez vous vraiment supprimer cette annonce
    </DeleteModalAnimation>
  );
};
