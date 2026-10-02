'use client';

import { Flex, Menu, Portal, Stack } from '@chakra-ui/react';
import { useField } from 'formik';
import { useRef } from 'react';
import {
  BaseButton,
  BaseText,
  FormTextArea,
  FormTextInput,
  Icons,
  TextVariant,
} from '_components/custom';
import { MODELS } from '_types/*';
import { insertVariable, unknownVariables } from '_utils/invoice-template';

const GROUP_LABELS: Record<string, string> = {
  agence: 'Agence',
  client: 'Client',
  facture: 'Facture',
  reservation: 'Réservation',
  bien: 'Bien',
};

/**
 * Texte d'un modèle (champ Formik `name`) avec insertion guidée de variables : le menu insère
 * `{{groupe.cle}}` au curseur. Les variables hors catalogue sont signalées tout de suite (le
 * backend les refuse).
 */
export const VariableTextField = ({
  name,
  label,
  maxLength,
  multiline,
  catalogue,
}: {
  name: string;
  label: string;
  maxLength: number;
  multiline: boolean;
  catalogue: MODELS.IInvoiceVariables | undefined;
}) => {
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const validate = (text: string) => {
    const unknown = catalogue ? unknownVariables(text ?? '', catalogue) : [];
    return unknown.length ? `Variable inconnue : ${unknown.join(', ')}` : undefined;
  };
  const [field, , { setValue, setTouched }] = useField<string>(name);

  const insert = (variable: string) => {
    const element = input.current;
    const value = field.value ?? '';
    const { text, cursor } = insertVariable(
      value,
      {
        start: element?.selectionStart ?? value.length,
        end: element?.selectionEnd ?? value.length,
      },
      variable,
    );
    if (text.length > maxLength) return;
    setValue(text);
    setTouched(true, false);
    // Curseur replacé après la variable insérée
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <Stack gap={1}>
      <Flex justifyContent="flex-end">
        <Menu.Root positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger asChild>
            <BaseButton size="xs" variant="ghost" p={2} disabled={!catalogue}>
              <Icons.PlusMinus aria-hidden />
              Insérer une variable
            </BaseButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content maxH="320px" overflowY="auto" minW="240px">
                {Object.entries(catalogue ?? {}).map(([group, keys]) => (
                  <Menu.ItemGroup key={group}>
                    <Menu.ItemGroupLabel>{GROUP_LABELS[group] ?? group}</Menu.ItemGroupLabel>
                    {Object.entries(keys).map(([key, description]) => (
                      <Menu.Item
                        key={key}
                        value={`${group}.${key}`}
                        onSelect={() => insert(`${group}.${key}`)}
                      >
                        {description}
                      </Menu.Item>
                    ))}
                  </Menu.ItemGroup>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
      {multiline ? (
        <FormTextArea
          name={name}
          label={label}
          rows={3}
          maxCharacters={maxLength}
          validate={validate}
          inputRef={input}
          autoresize={false}
        />
      ) : (
        <FormTextInput
          name={name}
          label={label}
          maxLength={maxLength}
          validate={validate}
          inputRef={input}
        />
      )}
      <BaseText variant={TextVariant.XS} color="fg.muted">
        Les variables sont remplacées par les données de la facture.
      </BaseText>
    </Stack>
  );
};
