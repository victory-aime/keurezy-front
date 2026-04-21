import { Span } from '@chakra-ui/react';
import { DeleteModalAnimation, BaseText, ModalOpenProps } from '_components/custom';

export const LandDelete = ({ isOpen, isLoading, callback, onChange, data }: ModalOpenProps) => {
  return (
    <DeleteModalAnimation
      title={'Supprimer ce terrain'}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter={false}
      isLoading={isLoading}
      buttonSaveTitle="Supprimer"
      callback={callback}
    >
      <BaseText textAlign={'center'} fontSize={'sm'}>
        Êtes-vous sûr de vouloir supprimer le terrain{' '}
        <Span color={'primary.500'}> {data?.title}</Span> ? Cette action est irréversible et
        supprimera également tous l'historique sur ce terrain
      </BaseText>
    </DeleteModalAnimation>
  );
};
