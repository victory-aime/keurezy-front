'use client';

import { Field, Flex, Group, PinInput } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useField, useFormikContext } from 'formik';
import { OtpInputProps } from '_components/custom/form/interface/input';
import { FC } from 'react';
import { BaseText } from '_components/custom';
import { hexToRGB } from '_theme/colors';

export const FormOtpInput: FC<OtpInputProps> = ({
  name,
  label,
  validate,
  isReadOnly = false,
  required = false,
  infoMessage,
  count = 6,
  attached = false,
  isDisabled,
  onChangeFunction,
}) => {
  const { t } = useTranslation();
  const fieldHookConfig = { name, validate };
  const [field, { touched, error }, { setValue }] = useField(fieldHookConfig);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly ? !!error : !!(error && (touched || submitCount > 0));

  return (
    <Field.Root id={name} invalid={isError} alignItems={'center'}>
      {label && (
        <Field.Label display="flex" gap="6px" fontSize={{ base: '14px', md: '12px' }}>
          {t(label)}
          {required && <BaseText color="red"> * </BaseText>}
        </Field.Label>
      )}

      <PinInput.Root
        otp
        count={count}
        value={field.value || ['', '', '', '', '', '']}
        onValueChange={async (e) => {
          await setValue(e.value);
        }}
        onValueComplete={async (e) => {
          await setValue(e.value);
          onChangeFunction?.(e.value?.join(''));
        }}
        size="xl"
        disabled={isReadOnly || isDisabled}
        attached={attached}
      >
        <PinInput.HiddenInput />
        <PinInput.Control>
          <Group attached={attached}>
            {Array.from({ length: count }).map((_, index) => (
              <PinInput.Input
                key={index}
                index={index}
                borderRadius={8}
                bg={
                  field.value?.[index]
                    ? isError
                      ? hexToRGB('danger', 0.12)
                      : hexToRGB('primary', 0.12)
                    : 'bg'
                }
                // Case vide toujours visible (clair comme sombre) ; l'état se lit aussi à la couleur du chiffre
                borderColor={
                  isError ? 'red.500' : field.value?.[index] ? 'primary.500' : 'border.emphasized'
                }
                borderWidth={1.5}
                fontWeight={'semibold'}
                _focusVisible={{
                  borderColor: 'primary.500',
                  outline: '2px solid',
                  outlineColor: 'primary.500',
                  outlineOffset: '1px',
                }}
                animation={isError ? 'shake' : undefined}
                placeholder="·"
              />
            ))}
          </Group>
        </PinInput.Control>
      </PinInput.Root>

      {isError && (
        <Flex gap={1} mt={1} alignItems="center">
          <Field.ErrorIcon width={4} height={4} color="red.500" />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Flex>
      )}
      {infoMessage && (
        <Flex gap={1} mt={1} alignItems={'center'}>
          <Field.ErrorIcon width={4} height={4} color={'info.500'} />
          <Field.HelperText p={1}>{t(infoMessage)}</Field.HelperText>
        </Flex>
      )}
    </Field.Root>
  );
};
