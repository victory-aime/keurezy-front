'use client';

import { Box, Flex, Skeleton, Stack, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BaseModal, BaseText, Icons, ModalOpenProps } from '_components/custom';
import { variantColorType } from '_components/custom/button/interface/button';
import { useColorMode } from '_components/ui/color-mode';
import { ImpactGroup, ImpactSummary, ImpactTone } from '_utils/impact';

/** Couleur et icône de chaque type de conséquence ; le titre du groupe dit toujours le sens. */
const TONES: Record<ImpactTone, { palette: string; icon: ReactNode }> = {
  danger: { palette: 'red', icon: <Icons.Trash /> },
  warning: { palette: 'orange', icon: <Icons.Warn /> },
  success: { palette: 'green', icon: <Icons.Check /> },
  blocked: { palette: 'red', icon: <Icons.Lock /> },
};

interface ActionImpactDialogProps {
  isOpen: boolean;
  /** Même signature que `ModalOpenProps.onChange` (attendue par `BaseModal`) */
  onChange: ModalOpenProps['onChange'];
  /** Action, ex. « Supprimer ce bien » */
  title: string;
  /** Élément concerné, ex. le titre du bien */
  subject?: string;
  /** Impact calculé par `_utils/impact` ; absent pendant le chargement */
  summary?: ImpactSummary;
  isLoadingImpact?: boolean;
  isSubmitting?: boolean;
  confirmTitle: string;
  confirmColor?: variantColorType;
  onConfirm: () => void;
  /** Action plus sûre proposée à la place, ex. « Fermer le bien » quand la suppression est bloquée */
  alternative?: { title: string; onClick: () => void };
  /** Contenu affiché sous l'impact, ex. le champ Motif d'une annulation */
  children?: ReactNode;
  /** Confirmation désactivée par l'appelant, ex. motif encore vide */
  confirmDisabled?: boolean;
}

/** Un groupe de conséquences : bande colorée, icône, titre explicite et liste. */
function ImpactGroupBlock({ group }: { group: ImpactGroup }) {
  const { colorMode } = useColorMode();
  const { palette, icon } = TONES[group.tone];
  return (
    <Box
      width="full"
      p={3}
      rounded="lg"
      borderLeftWidth="4px"
      borderColor={`${palette}.500`}
      bg={colorMode === 'light' ? `${palette}.50` : `${palette}.900`}
    >
      <Flex align="center" gap={2} color={`${palette}.600`} mb={1}>
        {icon}
        <BaseText fontWeight="semibold">{group.title}</BaseText>
      </Flex>
      <Stack as="ul" gap={1} pl={6} listStyleType="disc">
        {group.items.map((item) => (
          <BaseText as="li" key={item} fontSize="sm">
            {item}
          </BaseText>
        ))}
      </Stack>
    </Box>
  );
}

/**
 * Confirmation d'une action destructrice (suppression, fermeture, annulation) qui montre ce
 * qu'elle entraîne réellement avant de l'autoriser. Quand l'impact bloque l'action, le bouton
 * de confirmation est désactivé et l'alternative éventuelle est proposée.
 */
export function ActionImpactDialog({
  isOpen,
  onChange,
  title,
  subject,
  summary,
  isLoadingImpact,
  isSubmitting,
  confirmTitle,
  confirmColor = 'danger',
  onConfirm,
  alternative,
  children,
  confirmDisabled,
}: ActionImpactDialogProps) {
  const blocked = summary?.blocked ?? true;
  return (
    <BaseModal
      isOpen={isOpen}
      onChange={onChange}
      title={title}
      description={subject}
      icon={blocked ? <Icons.Lock /> : <Icons.Warn />}
      buttonCancelTitle="Retour"
      buttonSaveTitle={confirmTitle}
      colorSaveButton={confirmColor}
      onClick={onConfirm}
      // Confirmation impossible tant que l'impact n'est pas connu ou s'il bloque l'action ;
      // « Retour » et l'alternative restent utilisables
      saveDisabled={isLoadingImpact || blocked || confirmDisabled}
      isLoading={isSubmitting}
      buttonRejectTitle={blocked && alternative ? alternative.title : ''}
      onReject={alternative?.onClick}
      colorRejectButton="primary"
    >
      <VStack gap={3} width="full" aria-busy={isLoadingImpact}>
        {isLoadingImpact || !summary ? (
          <>
            <Skeleton height="72px" width="full" rounded="lg" />
            <Skeleton height="48px" width="full" rounded="lg" />
          </>
        ) : (
          summary.groups.map((group) => <ImpactGroupBlock key={group.title} group={group} />)
        )}
        {children}
      </VStack>
    </BaseModal>
  );
}
