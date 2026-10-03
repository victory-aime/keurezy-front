import { Separator } from '@chakra-ui/react';
import { BaseContainer, TextVariant } from '_components/custom';
import { ReactNode } from 'react';

/** Panneau d'un onglet : titre, explication, puis le contenu de la section. */
export const Panel = ({
  title,
  description,
  textVariant,
  children,
}: {
  title: string;
  description?: string;
  textVariant?: TextVariant.L;
  children: ReactNode;
}) => {
  return (
    <BaseContainer
      gap={5}
      width="full"
      p={{ base: 1, md: 2 }}
      title={title}
      description={description}
      textVariant={textVariant}
      border="none"
    >
      <Separator mt={'10px'} mb={'10px'} />
      {children}
    </BaseContainer>
  );
};
