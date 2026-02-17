import { Field, Flex, Text, Slider, Box } from "@chakra-ui/react";
import { useField } from "formik";
import { FC } from "react";
import { DefaultProps } from "./interface/input";
import { BaseFormatNumber } from "../format-number";
import { Icons } from "../icons";

export const FormSlider: FC<DefaultProps> = ({
  name,
  validate,
  label,
  required,
  isNumber,
  min = 10,
  max = 1000,
  onChangeFunction,
  slideIcon = Icons.Payment,
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

      <Slider.Root
        {...field}
        width={"full"}
        min={min}
        max={max}
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
      >
        <Slider.Control>
          <Slider.Track bg="secondary.500">
            <Slider.Range bg="primary.500" />
          </Slider.Track>
          <Slider.Thumb index={0} boxSize={8} borderColor="primary.200">
            <Box color="secondary.600" as={slideIcon} />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    </Field.Root>
  );
};
