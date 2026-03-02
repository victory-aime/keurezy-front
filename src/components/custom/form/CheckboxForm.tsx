import {
  CheckboxGroup,
  Field,
  Fieldset,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { Checkbox } from "_components/ui/checkbox";
import { useField, useFormikContext } from "formik";
import React, { FC } from "react";
import { CheckBoxProps } from "./interface/input";
import { NoDataFound } from "../no-data-found";
import { BaseText, TextVariant } from "../base-text";

export const FormCheckbox: FC<CheckBoxProps> = ({
  name,
  validate,
  label,
  items,
  size = "sm",
  itemsPerRow,
  isReadOnly = false,
}) => {
  const fieldHookConfig = { name, validate };
  const [field, { touched, error }, { setValue }] = useField(fieldHookConfig);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));

  return (
    <Field.Root id={name} invalid={isError}>
      {items && (
        <CheckboxGroup
          invalid={isError}
          name={field.name}
          value={field.value}
          onValueChange={(value: string[]) => {
            setValue(value);
          }}
        >
          <Fieldset.Content>
            {itemsPerRow ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lgOnly: itemsPerRow }}
                gap={8}
                width={"full"}
              >
                {items?.map((item, index) => (
                  <Checkbox key={index} value={item.name} size={size}>
                    {item.name}
                  </Checkbox>
                ))}
              </SimpleGrid>
            ) : (
              <>
                {items?.map((item, index) => (
                  <Checkbox key={index} value={item.name} size={size}>
                    {item.name}
                  </Checkbox>
                ))}
              </>
            )}
            {items?.length === 0 && (
              <NoDataFound
                containerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              />
            )}
          </Fieldset.Content>
        </CheckboxGroup>
      )}

      {!items && label && (
        <Checkbox
          {...field}
          name={field.name}
          value={field.value}
          checked={field.value}
          size={size}
          width={"fit-content"}
          cursor={"pointer"}
          colorPalette={field?.value ? "purple" : isError ? "red" : "none"}
          onCheckedChange={({ checked }: { checked: boolean | string }) => {
            setValue(checked);
          }}
        >
          <BaseText variant={TextVariant.S}>{label}</BaseText>
        </Checkbox>
      )}
      {isError && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={2.5} height={2.5} color={"red.500"} />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Flex>
      )}
    </Field.Root>
  );
};
