'use client';

import {
  Box,
  chakra,
  Checkbox,
  Field,
  Flex,
  HStack,
  Input,
  RadioCard,
  SimpleGrid,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { BaseBadge, BaseText, TextVariant } from '_components/custom';
import { MODELS } from '_types/*';
import {
  BLOCK_LABELS,
  COLUMN_LABELS,
  FONT_OPTIONS,
  LAYOUT_OPTIONS,
  TEXT_FIELDS,
} from '_utils/invoice-template';
import { VariableTextField } from './VariableTextField';

type Config = MODELS.IInvoiceTemplateConfig;
type Change = (patch: Partial<Config>) => void;

/** Étape 1 (nouveau modèle) : partir d'un modèle existant. */
export const StepBase = ({
  templates,
  baseId,
  onSelect,
}: {
  templates: MODELS.IInvoiceTemplate[];
  baseId: string | null;
  onSelect: (template: MODELS.IInvoiceTemplate) => void;
}) => (
  <RadioCard.Root
    value={baseId}
    onValueChange={(e) => {
      const template = templates.find((t) => t.id === e.value);
      if (template) onSelect(template);
    }}
    aria-label="Modèle de départ"
  >
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
      {templates.map((template) => (
        <RadioCard.Item key={template.id} value={template.id}>
          <RadioCard.ItemHiddenInput />
          <RadioCard.ItemControl>
            <Stack gap={2} flex="1">
              <Box height="8px" rounded="full" bg={template.config.primaryColor} aria-hidden />
              <Flex alignItems="center" gap={2} wrap="wrap">
                <RadioCard.ItemText fontWeight="semibold">{template.name}</RadioCard.ItemText>
                {template.isDefault && <BaseBadge label="Commun" variant="subtle" size="sm" />}
              </Flex>
              <RadioCard.ItemDescription>
                {LAYOUT_OPTIONS.find((l) => l.value === template.config.layout)?.label}
              </RadioCard.ItemDescription>
            </Stack>
            <RadioCard.ItemIndicator />
          </RadioCard.ItemControl>
        </RadioCard.Item>
      ))}
    </SimpleGrid>
  </RadioCard.Root>
);

/** Étape « Mise en page » : disposition et police. */
export const StepLayout = ({ config, onChange }: { config: Config; onChange: Change }) => (
  <Stack gap={6}>
    <RadioCard.Root
      value={config.layout}
      onValueChange={(e) => e.value && onChange({ layout: e.value as MODELS.InvoiceLayout })}
      aria-label="Mise en page"
    >
      <RadioCard.Label>Mise en page</RadioCard.Label>
      <Stack gap={3}>
        {LAYOUT_OPTIONS.map((layout) => (
          <RadioCard.Item key={layout.value} value={layout.value}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemContent>
                <RadioCard.ItemText>{layout.label}</RadioCard.ItemText>
                <RadioCard.ItemDescription>{layout.description}</RadioCard.ItemDescription>
              </RadioCard.ItemContent>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
    <RadioCard.Root
      value={config.font}
      onValueChange={(e) => e.value && onChange({ font: e.value as MODELS.InvoiceFont })}
      aria-label="Police"
      size="sm"
    >
      <RadioCard.Label>Police</RadioCard.Label>
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={2}>
        {FONT_OPTIONS.map((font) => (
          <RadioCard.Item key={font.value} value={font.value}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>{font.label}</RadioCard.ItemText>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </SimpleGrid>
    </RadioCard.Root>
  </Stack>
);

/** Couleur : sélecteur natif et code hexadécimal, liés. */
const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <Field.Root>
    <Field.Label>{label}</Field.Label>
    <HStack gap={3}>
      <chakra.input
        type="color"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        aria-label={`${label} (sélecteur)`}
        boxSize="40px"
        p={0}
        borderWidth="1px"
        borderColor="border"
        rounded="7px"
        cursor="pointer"
        bg="transparent"
      />
      <Input
        value={value}
        maxLength={7}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} (code)`}
        width="120px"
        fontFamily="mono"
      />
    </HStack>
  </Field.Root>
);

/** Étape « Couleurs » : couleurs et logo. */
export const StepColors = ({ config, onChange }: { config: Config; onChange: Change }) => (
  <Stack gap={5}>
    <ColorField
      label="Couleur principale (titres, en-têtes)"
      value={config.primaryColor}
      onChange={(primaryColor) => onChange({ primaryColor })}
    />
    <ColorField
      label="Couleur d’accent (total, mentions)"
      value={config.accentColor}
      onChange={(accentColor) => onChange({ accentColor })}
    />
    <Switch.Root
      checked={config.showLogo}
      onCheckedChange={(e) => onChange({ showLogo: e.checked })}
    >
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Afficher le logo de l’agence (page Agence)</Switch.Label>
    </Switch.Root>
  </Stack>
);

/** Étape « Contenu » : colonnes du tableau et blocs. */
export const StepContent = ({ config, onChange }: { config: Config; onChange: Change }) => (
  <Stack gap={6}>
    <Stack gap={3} as="fieldset">
      <BaseText as="legend" fontWeight="semibold">
        Colonnes du tableau
      </BaseText>
      <BaseText variant={TextVariant.S} color="fg.muted">
        La désignation et le total sont toujours affichés.
      </BaseText>
      {(Object.keys(COLUMN_LABELS) as (keyof Config['columns'])[]).map((column) => (
        <Checkbox.Root
          key={column}
          checked={config.columns[column]}
          onCheckedChange={(e) =>
            onChange({ columns: { ...config.columns, [column]: e.checked === true } })
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{COLUMN_LABELS[column]}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Stack>
    <Stack gap={3} as="fieldset">
      <BaseText as="legend" fontWeight="semibold">
        Blocs
      </BaseText>
      {(Object.keys(BLOCK_LABELS) as (keyof Config['blocks'])[]).map((block) => (
        <Checkbox.Root
          key={block}
          alignItems="flex-start"
          checked={config.blocks[block]}
          onCheckedChange={(e) =>
            onChange({ blocks: { ...config.blocks, [block]: e.checked === true } })
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control mt="2px" />
          <Stack gap={0}>
            <Checkbox.Label>{BLOCK_LABELS[block].label}</Checkbox.Label>
            <BaseText variant={TextVariant.XS} color="fg.muted">
              {BLOCK_LABELS[block].hint}
            </BaseText>
          </Stack>
        </Checkbox.Root>
      ))}
    </Stack>
  </Stack>
);

/** Étape « Textes » : textes libres avec variables. */
export const StepTexts = ({
  config,
  onChange,
  catalogue,
}: {
  config: Config;
  onChange: Change;
  catalogue: MODELS.IInvoiceVariables | undefined;
}) => (
  <Stack gap={5}>
    {TEXT_FIELDS.map((field) => (
      <VariableTextField
        key={field.key}
        label={field.label}
        value={config.texts[field.key]}
        maxLength={field.maxLength}
        multiline={field.multiline}
        catalogue={catalogue}
        onChange={(value) => onChange({ texts: { ...config.texts, [field.key]: value } })}
      />
    ))}
  </Stack>
);
