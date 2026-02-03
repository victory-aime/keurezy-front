"use client";

import { Field, Flex, Group, PinInput } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useField, useFormikContext } from "formik";
import { OtpInputProps } from "_components/custom/form/interface/input";
import { FC } from "react";
import { BaseText } from "_components/custom";
import * as React from "react";
import { hexToRGB } from "_theme/colors";

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
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));

  return (
    <Field.Root id={name} invalid={isError} alignItems={"center"}>
      {label && (
        <Field.Label
          display="flex"
          gap="6px"
          fontSize={{ base: "14px", md: "12px" }}
        >
          {t(label)}
          {required && <BaseText color="red"> * </BaseText>}
        </Field.Label>
      )}

      <PinInput.Root
        otp
        count={count}
        value={field.value || ["", "", "", "", "", ""]}
        onValueChange={async (e) => {
          await setValue(e.value);
        }}
        onValueComplete={async (e) => {
          await setValue(e.value);
          onChangeFunction?.(e.value?.join(""));
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
                bg={field.value?.[index] ? "white" : hexToRGB("lighter", 0.4)}
                borderColor={
                  field.value?.[index]
                    ? isError
                      ? "red"
                      : "tertiary.500"
                    : "bg.muted"
                }
                borderWidth={1.5}
                animation={isError ? "shake" : undefined}
                color={"black"}
                boxShadow={field.value?.[index] ? "lg" : "none"}
                placeholder="."
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
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={4} height={4} color={"info.500"} />
          <Field.HelperText p={1}>{t(infoMessage)}</Field.HelperText>
        </Flex>
      )}
    </Field.Root>
  );
};
