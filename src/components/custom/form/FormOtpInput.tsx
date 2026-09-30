'use client';

import { Field, Flex, Group, HStack, PinInput } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useField, useFormikContext } from 'formik';
import { OtpInputProps } from '_components/custom/form/interface/input';
import { ClipboardEvent, FC, useEffect, useRef } from 'react';
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
  charset = 'numeric',
  separatorAt,
}) => {
  const { t } = useTranslation();
  const fieldHookConfig = { name, validate };
  const [field, { touched, error }, { setValue }] = useField(fieldHookConfig);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly ? !!error : !!(error && (touched || submitCount > 0));
  const allowed = charset === 'numeric' ? /[^0-9]/g : /[^a-zA-Z0-9]/g;
  const controlRef = useRef<HTMLDivElement>(null);
  // Dernier code complet déjà envoyé : un collage déclenche à la fois notre gestionnaire et
  // `onValueComplete` du PinInput ; sans ce garde, le même code partait deux fois (le second
  // envoi échouait, code déjà consommé, puis le premier réussissait).
  const lastSentRef = useRef('');
  const sendOnce = (code: string) => {
    if (code.length !== count || code === lastSentRef.current) return;
    lastSentRef.current = code;
    onChangeFunction?.(code);
  };
  const isEmpty = !field.value?.some?.(Boolean);
  const isComplete = Array.isArray(field.value) && field.value.filter(Boolean).length === count;

  // Cases modifiées ou vidées (après une erreur) : le prochain code complet pourra repartir
  useEffect(() => {
    if (!isComplete) lastSentRef.current = '';
  }, [isComplete]);
  const disabled = isReadOnly || isDisabled;

  // Code refusé : cases vidées → focus sur la première, une fois les cases réactivées (un
  // élément désactivé pendant la vérification ne peut pas recevoir le focus)
  useEffect(() => {
    if (!error || !isEmpty || disabled) return;
    controlRef.current?.querySelector<HTMLInputElement>('[data-part="input"]')?.focus();
  }, [error, isEmpty, disabled]);

  /**
   * Collage d'un code complet (« ycCnP-aU7hc », « 123 456 ») : tirets et espaces retirés, puis
   * réparti dans les cases. Sans cela, le tiret rend le collage invalide pour le PinInput.
   */
  const handlePaste = async (event: ClipboardEvent<HTMLDivElement>) => {
    const chars = event.clipboardData.getData('text').replace(allowed, '').slice(0, count);
    if (!chars) return;
    // Capture : le PinInput ne reçoit pas ce collage (il le rejetterait à cause du tiret)
    event.preventDefault();
    event.stopPropagation();
    const next = Array.from({ length: count }, (_, i) => chars[i] ?? '');
    await setValue(next);
    sendOnce(chars);
  };

  const renderCell = (index: number) => (
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
      borderColor={isError ? 'red.500' : field.value?.[index] ? 'primary.500' : 'border.emphasized'}
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
  );
  const indexes = Array.from({ length: count }, (_, i) => i);

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
        type={charset}
        count={count}
        value={field.value || Array(count).fill('')}
        onValueChange={async (e) => {
          await setValue(e.value);
        }}
        onValueComplete={async (e) => {
          await setValue(e.value);
          sendOnce(e.value?.join('') ?? '');
        }}
        // 10 cases (codes de secours) : taille réduite pour tenir sur mobile
        size={separatorAt ? { base: 'sm', sm: 'md' } : 'xl'}
        disabled={disabled}
        attached={attached}
      >
        <PinInput.HiddenInput />
        <PinInput.Control ref={controlRef} onPasteCapture={handlePaste}>
          {separatorAt ? (
            <HStack gap={2}>
              <Group attached={attached}>{indexes.slice(0, separatorAt).map(renderCell)}</Group>
              <BaseText aria-hidden fontWeight={'bold'} color={'fg.muted'}>
                -
              </BaseText>
              <Group attached={attached}>{indexes.slice(separatorAt).map(renderCell)}</Group>
            </HStack>
          ) : (
            <Group attached={attached}>{indexes.map(renderCell)}</Group>
          )}
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
