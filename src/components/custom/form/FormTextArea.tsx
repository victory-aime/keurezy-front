import React, { FC } from "react";
import { useField, useFormikContext } from "formik";
import { Field, Flex, Span, Text, Textarea } from "@chakra-ui/react";
import { FormTextAreaProps } from "./interface/input";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const FormTextArea: FC<FormTextAreaProps> = ({
  required = false,
  label,
  value,
  onChangeFunction,
  name,
  placeholder = "",
  width,
  infoMessage,
  isReadOnly = false,
  isDisabled,
  validate,
  minHeight,
  helperMessage,
  autoresize = true,
  maxCharacters,
}) => {
  const { t } = useTranslation();
  const fieldHookConfig = {
    name,
    validate,
  };

  const [field, { touched, error }, helpers] = useField(fieldHookConfig);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));

  const { setValue } = helpers;

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label
          display={"flex"}
          gap={"6px"}
          justifyContent={"space-between"}
          width={"full"}
        >
          <Flex gap={"6px"}>
            {t(label)}
            {required && <Text color={"red"}> * </Text>}
          </Flex>
          {maxCharacters && (
            <Span color="fg.muted" textStyle="xs">
              {field.value?.length || 0} / {maxCharacters}
            </Span>
          )}
        </Field.Label>
      )}
      <Textarea
        {...field}
        //bg={"bg.muted"}
        autoresize={autoresize}
        border={"1px solid"}
        borderColor={isError ? "red.500" : "inherit"}
        _focus={{ borderColor: isError ? "red.500" : "primary.500" }}
        _placeholder={{ color: isError ? "red.500" : "gray.400" }}
        placeholder={t(placeholder)}
        fontSize={{ base: "16px", md: "12px" }}
        width={width}
        height={minHeight}
        p={3}
        mt={"5px"}
        borderRadius={"12px"}
        value={value ?? field.value}
        onChange={(event) => {
          field.onChange(event);
          onChangeFunction?.(event);
          setValue(event.currentTarget.value.slice(0, maxCharacters));
        }}
        readOnly={isReadOnly}
        disabled={isDisabled}
        maxLength={maxCharacters}
        onBlur={(e) => {
          field.onBlur(e);
        }}
      />
      {infoMessage || helperMessage ? (
        <Flex p={1} gap={2}>
          <HiOutlineInformationCircle
            size={18}
            color={isError ? "red" : "none"}
          />
          <Field.HelperText>
            {infoMessage ? infoMessage : helperMessage ? null : ""}
          </Field.HelperText>
        </Flex>
      ) : null}
      {isError && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={2.5} height={2.5} color={"red.500"} />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Flex>
      )}
    </Field.Root>
  );
};

export default FormTextArea;
