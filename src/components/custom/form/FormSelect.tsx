import { Field, Flex, Input } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "_components/ui/select";
import { InputGroup } from "_components/ui/input-group";
import React, { FC, useState, useMemo } from "react";
import { FullSelectProps } from "./interface/input";
import { useField, useFormikContext } from "formik";
import { BaseText } from "../base-text";
import { useTranslation } from "react-i18next";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { BaseTooltip } from "../tooltip";
import { CustomSkeletonLoader } from "../custom-skeleton";
import { BiSearch } from "react-icons/bi";
import { VariablesColors } from "_theme/variables";

const FormSelect: FC<FullSelectProps> = ({
  listItems,
  label,
  name,
  required,
  isMultiSelect = false,
  placeholder = "COMMON.SELECT_OPTIONS",
  infoMessage,
  width = "full",
  variant = "subtle",
  validate,
  isDisabled = false,
  isClearable = true,
  showDropdownIcon = true,
  toolTipInfo = "",
  onChangeFunc,
  setFieldValue,
  isLoading,
  ref,
  isReadOnly = false,
  customRenderSelected,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const fieldHookConfig = { name, validate };
  const [field, { touched, error }] = useField(fieldHookConfig);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));

  const filteredItems = useMemo(() => {
    if (!listItems?.items?.length) return [];
    return listItems.items.filter((item: { label: string }) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [listItems, searchTerm]);

  const extractSingleValue = (value: any) =>
    Array.isArray(value) ? value[0] : value;

  return (
    <Field.Root
      id={name}
      invalid={isError}
      disabled={isDisabled}
      width={"full"}
    >
      <SelectRoot
        name={name}
        value={field.value}
        variant={variant}
        required={required}
        lazyMount
        unmountOnExit
        closeOnSelect={!isMultiSelect}
        onValueChange={(item) => {
          setFieldValue(name, item?.value, true);
          onChangeFunc?.(item?.value);
        }}
        multiple={isMultiSelect}
        onBlur={(e) => {
          field?.onBlur(e);
        }}
        collection={listItems?.items?.length ? listItems : undefined}
        width={width}
      >
        {label && (
          <SelectLabel
            display={"flex"}
            gap={"6px"}
            mb={"4px"}
            fontSize={{ base: "14px", md: "12px" }}
            alignItems={"center"}
          >
            {isLoading ? (
              <CustomSkeletonLoader type="TEXT" numberOfLines={1} />
            ) : (
              <>
                {t(label)}
                {required && <BaseText color={"red"}> * </BaseText>}
                {toolTipInfo && (
                  <BaseTooltip message={toolTipInfo}>
                    <HiOutlineInformationCircle size={14} />
                  </BaseTooltip>
                )}
              </>
            )}
          </SelectLabel>
        )}

        {isLoading ? (
          <CustomSkeletonLoader type="FORM" height={"50px"} width={"100%"} />
        ) : (
          <>
            <SelectTrigger
              clearable={isClearable}
              showDropdownIcon={showDropdownIcon}
            >
              {customRenderSelected ? (
                customRenderSelected(
                  listItems?.items.filter(
                    (i: any) => i.value === extractSingleValue(field.value),
                  ),
                )
              ) : (
                <SelectValueText
                  placeholder={t(placeholder)}
                  color={isError ? "red.500" : "inherit"}
                  fontSize={{ base: "16px", md: "12px" }}
                />
              )}
            </SelectTrigger>

            <SelectContent borderRadius={7} p={3} portalRef={ref} maxH="220px">
              {listItems?.items?.length > 4 && (
                <InputGroup
                  flex={1}
                  width={"full"}
                  mb={"3"}
                  endElement={
                    <Flex alignItems={"flex-end"} justifyContent={"flex-end"}>
                      <BiSearch
                        color={
                          isError
                            ? VariablesColors.danger
                            : VariablesColors.grayScale
                        }
                      />
                    </Flex>
                  }
                >
                  <Input
                    placeholder={t("COMMON.SEARCH")}
                    size="lg"
                    height={"40px"}
                    variant={"outline"}
                    borderColor={isError ? "red.500" : "bg.muted"}
                    borderBottom={1}
                    _placeholder={{ color: isError ? "red.500" : "gray.400" }}
                    fontSize={{ base: "16px", md: "12px" }}
                    _focus={{ borderColor: "bg.muted" }}
                    readOnly={isReadOnly}
                    disabled={isDisabled}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              )}

              {filteredItems?.length ? (
                filteredItems.map(
                  (item: { id: string; label: string; value: string }) => {
                    return (
                      <SelectItem
                        key={item.id || item.value}
                        item={item.value}
                        _highlighted={{
                          color: item.value ? "tertiary.500" : "inherit",
                          background: item.value ? "teal.50" : "transparent",
                        }}
                        fontSize={{ base: "16px", md: "13px" }}
                      >
                        {item.label}
                      </SelectItem>
                    );
                  },
                )
              ) : (
                <BaseText fontSize="sm" color="gray.400" px={2} py={1}>
                  {t("COMMON.NO_SELECT_OPTIONS")}
                </BaseText>
              )}
            </SelectContent>
          </>
        )}
      </SelectRoot>
      {isError && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={4} height={4} color={"red.500"} />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Flex>
      )}
      {infoMessage && (
        <>
          {isLoading ? (
            <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
          ) : (
            <Flex gap={1} mt={1} alignItems={"center"}>
              <Field.ErrorIcon width={4} height={4} color={"info.500"} />
              <Field.HelperText p={1}>{t(infoMessage)}</Field.HelperText>
            </Flex>
          )}
        </>
      )}
    </Field.Root>
  );
};

export default FormSelect;
