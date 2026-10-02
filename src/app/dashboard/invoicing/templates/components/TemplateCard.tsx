'use client';

import { Box, Flex, HStack, IconButton, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { BaseBadge, BaseText, Icons, TextVariant } from '_components/custom';
import { Tooltip } from '_components/ui/tooltip';
import { MODELS } from '_types/*';
import { COLOR_ROLES, colorName, FONT_OPTIONS, LAYOUT_OPTIONS } from '_utils/invoice-template';

type Template = MODELS.IInvoiceTemplate;

/** Bouton icône dont le libellé s'affiche au survol (et sert de nom accessible). */
const ActionIcon = ({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) => (
  <Tooltip content={label} showArrow openDelay={150} closeDelay={50}>
    <IconButton
      aria-label={label}
      size="sm"
      variant="ghost"
      colorPalette={danger ? 'red' : 'gray'}
      onClick={onClick}
    >
      {children}
    </IconButton>
  </Tooltip>
);

/** Présentation d'un modèle de l'agence, déduite de sa configuration. */
const customDescription = (config: MODELS.IInvoiceTemplateConfig) => {
  const layout = LAYOUT_OPTIONS.find((l) => l.value === config.layout)?.label;
  const font = FONT_OPTIONS.find((f) => f.value === config.font)?.label.split(' (')[0];
  return `Votre modèle : mise en page ${layout?.toLowerCase()}, police ${font}.`;
};

/**
 * Carte d'un modèle : nom, description, rôle de chaque couleur et actions en icônes
 * (aperçu, personnaliser, choisir par défaut, supprimer), libellées au survol.
 */
export const TemplateCard = ({
  template,
  isDefaultChoice,
  isOwner,
  onPreview,
  onEdit,
  onMakeDefault,
  onDelete,
}: {
  template: Template;
  isDefaultChoice: boolean;
  isOwner: boolean;
  onPreview: () => void;
  onEdit: () => void;
  onMakeDefault: () => void;
  onDelete: () => void;
}) => (
  <Stack
    gap={4}
    p={4}
    rounded="7px"
    borderWidth="1px"
    borderColor={isDefaultChoice ? 'primary.500' : 'border'}
    bg="bg"
  >
    <Stack gap={1}>
      <Flex alignItems="center" gap={2} wrap="wrap">
        <BaseText fontWeight="semibold">{template.name}</BaseText>
        {isDefaultChoice && <BaseBadge label="Par défaut" variant="subtle" size="sm" />}
      </Flex>
      <BaseText variant={TextVariant.S} color="fg.muted">
        {template.description ?? customDescription(template.config)}
      </BaseText>
    </Stack>

    <Stack as="dl" gap={2}>
      {COLOR_ROLES.map((role) => {
        const hex = template.config[role.key];
        return (
          <HStack key={role.key} gap={3} alignItems="center">
            <Box
              boxSize="20px"
              flexShrink={0}
              rounded="full"
              bg={hex}
              borderWidth="1px"
              borderColor="border.emphasized"
              aria-hidden
            />
            <Stack gap={0} minW={0}>
              <BaseText as="dt" variant={TextVariant.S} fontWeight="medium">
                {colorName(hex)}
                <Box as="span" color="fg.muted" fontWeight="normal">
                  {' '}
                  → {role.label.toLowerCase()}
                </Box>
              </BaseText>
              <BaseText as="dd" variant={TextVariant.XS} color="fg.muted">
                {role.usage}
              </BaseText>
            </Stack>
          </HStack>
        );
      })}
    </Stack>

    <HStack gap={1} mt="auto" justifyContent="flex-end">
      <ActionIcon label="Aperçu" onClick={onPreview}>
        <Icons.View aria-hidden />
      </ActionIcon>
      {isOwner && (
        <ActionIcon label={template.isDefault ? 'Personnaliser' : 'Modifier'} onClick={onEdit}>
          <Icons.Edit aria-hidden />
        </ActionIcon>
      )}
      {isOwner && !isDefaultChoice && (
        <ActionIcon label="Choisir ce modèle" onClick={onMakeDefault}>
          <Icons.Check aria-hidden />
        </ActionIcon>
      )}
      {isOwner && !template.isDefault && (
        <ActionIcon label="Supprimer" onClick={onDelete} danger>
          <Icons.Trash aria-hidden />
        </ActionIcon>
      )}
    </HStack>
  </Stack>
);
