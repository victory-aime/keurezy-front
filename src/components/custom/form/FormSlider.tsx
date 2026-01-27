import { Field, Flex, Text } from "@chakra-ui/react";
import { Slider } from "_components/ui/slider";
import { useField } from "formik";
import React, { FC } from "react";
import { DefaultProps } from "./interface/input";
import { BaseFormatNumber } from "../format-number";

export const FormSlider: FC<DefaultProps> = ({
  name,
  validate,
  label,
  required,
  isNumber,
  min = 10,
  max = 1000,
  onChangeFunction,
  ...rest
}) => {
  const fieldHookConfig = {
    name,
    validate,
  };
  const [field, { touched, error }, helpers] = useField(fieldHookConfig);
  const { setValue } = helpers;
  const isError = error ? Boolean(error) : touched || Boolean(error);

  return (
    <Field.Root {...rest} id={name} invalid={isError}>
      {label && (
        <Field.Label
          display={"flex"}
          gap={"6px"}
          fontSize={{ base: "16px", lg: "18px" }}
        >
          {label}
          {required ? (
            <Text color={"red"}> * </Text>
          ) : isNumber ? (
            <Flex ml={3} gap={2} alignItems={"center"}>
              <BaseFormatNumber value={field?.value[0]} />
              -
              <BaseFormatNumber value={field?.value[1]} />
            </Flex>
          ) : null}
        </Field.Label>
      )}

      <Slider
        {...field}
        width="full"
        name={field.name}
        value={field.value}
        onFocusChange={({ focusedIndex, value }) => {
          if (focusedIndex !== -1) return;
          setValue(value);
          onChangeFunction?.(value);
        }}
        onValueChange={({ value }) => {
          setValue(value);
          onChangeFunction?.(value);
        }}
        min={min}
        max={max}
      />
    </Field.Root>
  );
};
