"use client";
import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { Input, Field, Flex, InputGroup, Spinner } from "@chakra-ui/react";
import { TextInputProps } from "./interface/input";
import { TbLockBitcoin } from "react-icons/tb";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  BaseText,
  BaseTooltip,
  CustomSkeletonLoader,
} from "_components/custom";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { ENUM } from "_types/enum";

const FormTextInput = ({
  name,
  label,
  type = "text",
  placeholder = "",
  infoMessage = "",
  required = false,
  isReadOnly = false,
  isDisabled = false,
  isVerified = false,
  rightAccessory,
  leftAccessory,
  customRadius,
  height = "40px",
  validate,
  toolTipInfo,
  isLoading,
  onChangeFunction,
  currency = ENUM.COMMON.Currency.XAF,
  ...rest
}: TextInputProps) => {
  const { t } = useTranslation();
  const fieldHookConfig = {
    name,
    validate,
  };
  const [field, { touched, error }] = useField(fieldHookConfig);
  const { submitCount, handleSubmit } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));
  const isPassword = type === "password";
  const isCurrency = type === "amount";
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label
          display={"flex"}
          gap={"6px"}
          mb={"4px"}
          fontSize={{ base: "14px", md: "12px" }}
        >
          {isLoading ? (
            <CustomSkeletonLoader type="TEXT" numberOfLines={1} />
          ) : (
            <>
              {t(label)}
              {required && <BaseText color={"red"}> * </BaseText>}
            </>
          )}
        </Field.Label>
      )}

      {isLoading ? (
        <CustomSkeletonLoader type="FORM" height={height} width={"100%"} />
      ) : (
        <InputGroup
          width={"full"}
          startElement={
            isPassword ? (
              <Flex alignItems={"flex-start"} justifyContent={"flex-start"}>
                <TbLockBitcoin />
              </Flex>
            ) : isCurrency && currency === ENUM.COMMON.Currency.USD ? (
              <Flex alignItems={"flex-start"} justifyContent={"flex-start"}>
                {currency}
              </Flex>
            ) : (
              leftAccessory && (
                <Flex alignItems={"flex-start"} justifyContent={"flex-start"}>
                  {leftAccessory}
                </Flex>
              )
            )
          }
          endElement={
            isPassword ? (
              <Flex
                mt={"5px"}
                pr={"5px"}
                alignItems={"center"}
                justifyContent={"center"}
                onClick={() => setSecureTextEntry(!secureTextEntry)}
                cursor={"pointer"}
              >
                {secureTextEntry ? <RiEyeOffLine /> : <RiEyeLine />}
              </Flex>
            ) : toolTipInfo ? (
              <>
                <BaseTooltip message={toolTipInfo}>
                  <HiOutlineInformationCircle size={18} />
                </BaseTooltip>
              </>
            ) : isCurrency && currency !== ENUM.COMMON.Currency.USD ? (
              currency
            ) : (
              rightAccessory && (
                <Flex alignItems={"flex-end"} justifyContent={"flex-end"}>
                  {rightAccessory}
                </Flex>
              )
            )
          }
        >
          <Input
            {...field}
            {...rest}
            name={field.name}
            type={isPassword ? (secureTextEntry ? "password" : "text") : type}
            onBlur={(e) => {
              field?.onBlur(e);
            }}
            onChange={(e) => {
              field.onChange(e);
              onChangeFunction?.(e);
            }}
            value={
              field.value !== undefined && field.value !== null
                ? field.value
                : ""
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder={t(placeholder)}
            borderRadius={customRadius ?? "12px"}
            border={"1px solid"}
            borderColor={isError ? "red.500" : "gray.200"}
            _focus={{ borderColor: isError ? "red.500" : "primary.500" }}
            _placeholder={{ color: isError ? "red.500" : "gray.400" }}
            variant={"outline"}
            //bg={"bg.muted"}
            readOnly={isReadOnly}
            disabled={isDisabled || isLoading}
            fontSize={{ base: "16px", md: "14px" }}
            height={height}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
          />
        </InputGroup>
      )}

      {isVerified && !isError ? (
        <Flex gap={1} mt={1} alignItems={"center"} color={"primary.500"}>
          <Spinner />
          <BaseText>verification en cours ...</BaseText>
        </Flex>
      ) : (
        isError && (
          <Flex gap={1} mt={1} alignItems={"center"}>
            <Field.ErrorIcon width={4} height={4} color={"red.500"} />
            <Field.ErrorText>{error}</Field.ErrorText>
          </Flex>
        )
      )}
      {infoMessage && !isLoading && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={4} height={4} color={"info.500"} />
          <Field.HelperText p={1}>{t(infoMessage)}</Field.HelperText>
        </Flex>
      )}
    </Field.Root>
  );
};

export default FormTextInput;
