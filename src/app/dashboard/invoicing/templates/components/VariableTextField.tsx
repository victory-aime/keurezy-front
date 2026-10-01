'use client';

import { Button, Field, Flex, Input, Menu, Portal, Textarea } from '@chakra-ui/react';
import { useRef } from 'react';
import { Icons } from '_components/custom';
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
 * Texte d'un modèle avec insertion guidée de variables : le menu insère `{{groupe.cle}}` au
 * curseur. Les variables hors catalogue sont signalées tout de suite (le backend les refuse).
 */
export const VariableTextField = ({
  label,
  value,
  onChange,
  maxLength,
  multiline,
  catalogue,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  multiline: boolean;
  catalogue: MODELS.IInvoiceVariables | undefined;
}) => {
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const unknown = catalogue ? unknownVariables(value, catalogue) : [];

  const insert = (variable: string) => {
    const element = input.current;
    const { text, cursor } = insertVariable(
      value,
      {
        start: element?.selectionStart ?? value.length,
        end: element?.selectionEnd ?? value.length,
      },
      variable,
    );
    if (text.length > maxLength) return;
    onChange(text);
    // Curseur replacé après la variable insérée
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(cursor, cursor);
    });
  };

  const fieldProps = {
    ref: input,
    value,
    maxLength,
    onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };

  return (
    <Field.Root invalid={unknown.length > 0}>
      <Flex width="full" justifyContent="space-between" alignItems="center" gap={2}>
        <Field.Label mb={0}>{label}</Field.Label>
        <Menu.Root positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger asChild>
            <Button size="xs" variant="ghost" disabled={!catalogue}>
              <Icons.PlusMinus aria-hidden />
              Insérer une variable
            </Button>
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
      {multiline ? <Textarea rows={3} {...fieldProps} /> : <Input {...fieldProps} />}
      <Flex width="full" justifyContent="space-between" gap={2}>
        {unknown.length > 0 ? (
          <Field.ErrorText>Variable inconnue : {unknown.join(', ')}</Field.ErrorText>
        ) : (
          <Field.HelperText>
            Les variables sont remplacées par les données de la facture.
          </Field.HelperText>
        )}
        <Field.HelperText flexShrink={0}>
          {value.length}/{maxLength}
        </Field.HelperText>
      </Flex>
    </Field.Root>
  );
};
