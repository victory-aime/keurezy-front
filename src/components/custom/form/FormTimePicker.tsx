import React from "react";
import { useField, useFormikContext } from "formik";
import { Field, Flex } from "@chakra-ui/react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BaseText, BaseTooltip } from "_components/custom";
import { useTranslation } from "react-i18next";
import { NativeSelect } from "_components/ui/select-native";
import { TimeInputProps } from "./interface/input";
import { CiTimer } from "react-icons/ci";
import { generateTimeOptions } from "./utils/gerenateTime";

export const FormTimePicker = ({
  name,
  label,
  required = false,
  toolTipInfo,
  isDisabled = false,
  variant = "subtle",
  placeholder = "Select an option",
  infoMessage,
  isReadOnly = false,
}: TimeInputProps) => {
  const { t, i18n } = useTranslation();
  const [field, { touched, error }] = useField(name);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));

  const timeOptions = generateTimeOptions(i18n.language);

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label
          display={"flex"}
          gap={"6px"}
          fontSize={{ base: "14px", md: "16px" }}
        >
          {t(label)}
          {required && <BaseText color={"red"}>*</BaseText>}
          {toolTipInfo && (
            <BaseTooltip message={toolTipInfo}>
              <HiOutlineInformationCircle size={18} />
            </BaseTooltip>
          )}
        </Field.Label>
      )}

      <NativeSelect
        {...field}
        name={field.name}
        value={field.value}
        items={timeOptions}
        placeholder={t(placeholder)}
        icon={<CiTimer />}
        size={"lg"}
        bg={"bg.muted"}
        variant={variant}
        borderRadius={"7px"}
        disabled={isDisabled}
        borderColor={isError ? "red.500" : "bg.muted"}
        _focus={{ borderColor: "primary.500" }}
        _placeholder={{ color: isError ? "red.500" : "gray.400" }}
        width={"full"}
      />

      {isError && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={4} height={4} color={"red.500"} />
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
