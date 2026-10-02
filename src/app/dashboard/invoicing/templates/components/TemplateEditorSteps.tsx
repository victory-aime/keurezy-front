'use client';

import { Box, RadioCard, SimpleGrid, Span, Stack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import {
  BaseText,
  FormCheckbox,
  FormColorPicker,
  FormSwitch,
  TextVariant,
} from '_components/custom';
import { MODELS } from '_types/*';
import {
  BLOCK_LABELS,
  COLUMN_LABELS,
  FONT_OPTIONS,
  LAYOUT_OPTIONS,
  SIGNATURE_STYLES,
  TEXT_FIELDS,
} from '_utils/invoice-template';
import { VariableTextField } from './VariableTextField';

type Config = MODELS.IInvoiceTemplateConfig;

/** Valeurs du formulaire de l'éditeur de modèle (Formik). */
export interface TemplateEditorValues {
  name: string;
  /** Absent tant que le modèle de départ n'est pas choisi (nouveau modèle) */
  config: Config | null;
}

/**
 * Choix unique en cartes, lié à un champ du formulaire. Cartes Chakra plutôt que `BaseRadioCard` :
 * chaque carte garde sa description et peut être indisponible (cachet non téléversé).
 */
const ChoiceCards = <T extends string>({
  name,
  label,
  options,
  size,
  columns,
}: {
  name: string;
  label: string;
  options: { value: T; label: string; description?: string; disabled?: boolean }[];
  size?: 'sm' | 'md';
  columns?: { base: number; sm?: number; md?: number };
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext<TemplateEditorValues>();
  const value = getFieldProps<T | undefined>(name).value;
  return (
    <RadioCard.Root
      value={value ?? null}
      onValueChange={(e) => e.value && setFieldValue(name, e.value)}
      aria-label={label}
      size={size}
      colorPalette="primary"
    >
      <RadioCard.Label>{label}</RadioCard.Label>
      <SimpleGrid columns={columns ?? { base: 1 }} gap={columns ? 2 : 3}>
        {options.map((option) => (
          <RadioCard.Item key={option.value} value={option.value} disabled={option.disabled}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemContent>
                <RadioCard.ItemText>{option.label}</RadioCard.ItemText>
                {option.description && (
                  <RadioCard.ItemDescription>{option.description}</RadioCard.ItemDescription>
                )}
              </RadioCard.ItemContent>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </SimpleGrid>
    </RadioCard.Root>
  );
};

/** Étape 1 (nouveau modèle) : partir d'un modèle existant (sa configuration et un nom proposé). */
export const StepBase = ({ templates }: { templates: MODELS.IInvoiceTemplate[] }) => {
  const { values, setValues } = useFormikContext<TemplateEditorValues & { baseId?: string }>();
  return (
    <RadioCard.Root
      value={values.baseId ?? null}
      onValueChange={(e) => {
        const template = templates.find((t) => t.id === e.value);
        if (template) {
          setValues({
            baseId: template.id,
            config: structuredClone(template.config),
            name: `${template.name} (copie)`,
          });
        }
      }}
      aria-label="Modèle de départ"
      colorPalette="primary"
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
        {templates.map((template) => (
          <RadioCard.Item key={template.id} value={template.id}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <Stack gap={2} flex="1">
                <Box height="8px" rounded="full" bg={template.config.primaryColor} aria-hidden />
                <RadioCard.ItemText fontWeight="semibold">{template.name}</RadioCard.ItemText>
                <RadioCard.ItemDescription>
                  {template.description ??
                    `Mise en page ${LAYOUT_OPTIONS.find((l) => l.value === template.config.layout)?.label.toLowerCase()}`}
                </RadioCard.ItemDescription>
              </Stack>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </SimpleGrid>
    </RadioCard.Root>
  );
};

/** Étape « Mise en page » : disposition et police. */
export const StepLayout = () => (
  <Stack gap={6}>
    <ChoiceCards<MODELS.InvoiceLayout>
      name="config.layout"
      label="Mise en page"
      options={LAYOUT_OPTIONS}
    />
    <ChoiceCards<MODELS.InvoiceFont>
      name="config.font"
      label="Police"
      size="sm"
      columns={{ base: 1, sm: 3 }}
      options={FONT_OPTIONS}
    />
  </Stack>
);

/** Étape « Couleurs » : couleurs et logo. */
export const StepColors = () => (
  <Stack gap={5}>
    <FormColorPicker name="config.primaryColor" label="Couleur principale (titres, en-têtes)" />
    <FormColorPicker name="config.accentColor" label="Couleur d’accent (total, mentions)" />
    <FormSwitch name="config.showLogo" label="Afficher le logo de l’agence (page Agence)" />
  </Stack>
);

/** Étape « Contenu » : colonnes du tableau, blocs et contenu de la zone de signature. */
export const StepContent = ({ hasStamp }: { hasStamp: boolean }) => {
  const { values } = useFormikContext<TemplateEditorValues>();
  return (
    <Stack gap={6}>
      <Stack gap={3} as="fieldset">
        <BaseText as="legend" fontWeight="semibold">
          Colonnes du tableau
        </BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          La désignation et le total sont toujours affichés.
        </BaseText>
        {(Object.keys(COLUMN_LABELS) as (keyof Config['columns'])[]).map((column) => (
          <FormCheckbox
            key={column}
            name={`config.columns.${column}`}
            label={COLUMN_LABELS[column]}
          />
        ))}
      </Stack>
      <Stack gap={3} as="fieldset">
        <BaseText as="legend" fontWeight="semibold">
          Blocs
        </BaseText>
        {(Object.keys(BLOCK_LABELS) as (keyof Config['blocks'])[]).map((block) => (
          <FormCheckbox
            key={block}
            name={`config.blocks.${block}`}
            label={
              <>
                {BLOCK_LABELS[block].label}
                <br />
                <Span color="fg.muted" fontSize="xs">
                  {BLOCK_LABELS[block].hint}
                </Span>
              </>
            }
          />
        ))}
      </Stack>
      {values.config?.blocks.signature && (
        <ChoiceCards<MODELS.InvoiceSignatureStyle>
          name="config.signatureStyle"
          label="Dans la zone « Signature et cachet »"
          size="sm"
          options={SIGNATURE_STYLES.map((style) => {
            const unavailable = style.value === 'IMAGE' && !hasStamp;
            return {
              ...style,
              disabled: unavailable,
              description: unavailable
                ? 'Téléversez d’abord votre cachet, section « Cachet et signature » de la page.'
                : style.description,
            };
          })}
        />
      )}
    </Stack>
  );
};

/** Étape « Textes » : textes libres avec variables. */
export const StepTexts = ({ catalogue }: { catalogue: MODELS.IInvoiceVariables | undefined }) => (
  <Stack gap={5}>
    {TEXT_FIELDS.map((field) => (
      <VariableTextField
        key={field.key}
        name={`config.texts.${field.key}`}
        label={field.label}
        maxLength={field.maxLength}
        multiline={field.multiline}
        catalogue={catalogue}
      />
    ))}
  </Stack>
);
