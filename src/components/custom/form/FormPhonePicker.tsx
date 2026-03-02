import React from "react";
import { Field, Flex, useBreakpointValue } from "@chakra-ui/react";
import {
  defaultCountries,
  parseCountry,
  PhoneInput,
} from "react-international-phone";
import { useField, useFormikContext } from "formik";
import { PhoneInputProps } from "./interface/input";
import { BaseText, CustomSkeletonLoader } from "_components/custom";
import { useTranslation } from "react-i18next";
import { useColorModeValue } from "_components/ui/color-mode";
import { VariablesColors } from "_theme/variables";
import "./utils/phone-dropdown.css";

export const FormPhonePicker = ({
  validate,
  isReadOnly,
  name,
  label,
  required,
  isLoading,
  placeholder = "Numero de telephone",
  infoMessage,
  onChangeFunction,
  hideDropdown = false,
  listAvailableCountries = ["sn", "cg"],
}: PhoneInputProps) => {
  const { t } = useTranslation();
  const [field, { touched, error }, helpers] = useField({ name, validate });
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));

  const colorBorder = useColorModeValue(
    VariablesColors.gray200,
    VariablesColors.black,
  );
  const colorDropdown = useColorModeValue(
    VariablesColors.white,
    VariablesColors.black,
  );
  const colorText = useColorModeValue(
    VariablesColors.black,
    VariablesColors.white,
  );
  const inputFontSize =
    useBreakpointValue({ base: "16px", md: "12px" }) || "16px";

  const availableCountries = React.useMemo(() => {
    if (!listAvailableCountries?.length) {
      return defaultCountries;
    }

    return defaultCountries.filter((country) => {
      const { iso2 } = parseCountry(country);
      return listAvailableCountries.includes(iso2);
    });
  }, [listAvailableCountries]);

  const defaultCountry = React.useMemo(() => {
    if (!availableCountries.length) return undefined;

    return parseCountry(availableCountries[0]).iso2;
  }, [availableCountries]);

  if (!availableCountries.length || !defaultCountry) {
    return <CustomSkeletonLoader type={"TEXT"} numberOfLines={1} />;
  }

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label
          display="flex"
          gap="6px"
          mb="4px"
          fontSize={{ base: "14px", md: "12px" }}
        >
          {isLoading ? (
            <CustomSkeletonLoader type="TEXT" numberOfLines={1} />
          ) : (
            <>
              {t(label)}
              {required && <BaseText color="red"> * </BaseText>}
            </>
          )}
        </Field.Label>
      )}

      <PhoneInput
        {...field}
        countries={availableCountries}
        defaultCountry={defaultCountry}
        disableDialCodePrefill
        disableDialCodeAndPrefix
        disableFocusAfterCountrySelect
        hideDropdown={availableCountries?.length <= 1 || hideDropdown}
        disabled={isReadOnly || isLoading}
        value={
          field.value !== undefined && field.value !== null ? field.value : ""
        }
        placeholder={t(placeholder)}
        onChange={(phone) => {
          helpers.setValue(phone);
          onChangeFunction?.(phone);
        }}
        style={{ width: "100%" }}
        countrySelectorStyleProps={{
          buttonStyle: {
            padding: "8px",
            //backgroundColor: colorBorder,
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
            borderRight: "none",
            borderTopColor: isError ? VariablesColors.danger : colorBorder,
            borderBottomColor: isError ? VariablesColors.danger : colorBorder,
            borderLeftColor: isError ? VariablesColors.danger : colorBorder,
            borderRightColor: colorBorder,
            height: "40px",
          },
          dropdownStyleProps: {
            style: {
              backgroundColor: colorDropdown,
              color: colorText,
              borderRadius: "12px",
              padding: "8px",
            },
            listItemClassName: "phone-dropdown-item",
            listItemFocusedClassName: "focused",
            listItemSelectedClassName: "selected",
          },
          dropdownArrowStyle: { marginLeft: "4px" },
        }}
        inputStyle={{
          //backgroundColor: colorBorder,
          color: colorText,
          border: `1px solid ${isError ? VariablesColors.danger : colorBorder}`,
          borderTopRightRadius: "12px",
          borderBottomRightRadius: "12px",
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
          height: "40px",
          width: "100%",
          fontSize: inputFontSize,
        }}
        inputProps={{
          name,
          required,
        }}
      />

      {isError && (
        <Flex gap={1} mt={1} alignItems="center">
          <Field.ErrorIcon width={2.5} height={2.5} color={"red.500"} />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Flex>
      )}

      {infoMessage && !isLoading && (
        <Flex gap={1} mt={1} alignItems="center">
          <Field.ErrorIcon width={4} height={4} color="info.500" />
          <Field.HelperText p={1}>{t(infoMessage)}</Field.HelperText>
        </Flex>
      )}
    </Field.Root>
  );
};
