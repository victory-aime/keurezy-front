"use client";

import {
  Input,
  InputGroup,
  Popover,
  Field,
  Portal,
  Flex,
} from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import { BaseCalendar } from "../calendar/BaseCalendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useId, useState } from "react";
import { PiCalendarThin } from "react-icons/pi";
import { IoIosClose } from "react-icons/io";
import { FormDatePickerFieldProps } from "./interface/input";
import { BaseText } from "../base-text";
import { useTranslation } from "react-i18next";
import { COMMON_FORMAT_DATE, APP_DATE_PATTERN } from "rise-core-frontend";
import { BaseIcon } from "_components/custom";

export const FormDatePicker = ({
  name,
  displayFormat,
  label,
  mode,
  placeholder = "",
  isReadOnly,
  isDisabled,
  required,
  hideNavigation = false,
  activeCaptionLayout = false,
  disablePastDates,
  disableWeeksDates,
  isClearable = true,
  startMonth = new Date(2025, 0),
  endMonth = new Date(2030, 11),
}: FormDatePickerFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const [field, { touched, error }, helpers] = useField(name);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));
  const [open, setOpen] = useState(false);

  const handleChange = (value: Date | DateRange | Date[] | undefined) => {
    helpers.setValue(value);

    if (mode === "single") {
      setOpen(false);
    }

    if (mode === "range") {
      const range = value as DateRange;
      const { from, to } = range || {};

      if (from && to && from.getTime() !== to.getTime()) {
        setOpen(false);
      }
    }
  };

  const handleReset = () => {
    helpers.setValue(undefined);
    helpers.setTouched(true);
  };

  const getDisplayValue = (): string => {
    const value = field.value;
    if (!value) return "";

    if (mode === "single" && value instanceof Date) {
      return format(value, COMMON_FORMAT_DATE);
    }

    if (mode === "range") {
      const { from, to } = value as DateRange;
      if (!from) return "";

      const formatShort = (date: Date) => format(date, APP_DATE_PATTERN); // 01 Jan 2026

      if (!to || from.getTime() === to.getTime()) {
        return `${displayFormat === "short" ? formatShort(from) : format(from, COMMON_FORMAT_DATE)}`;
      }

      if (displayFormat === "short") {
        return `${formatShort(from)} - ${formatShort(to)}`;
      }

      return `${format(from, COMMON_FORMAT_DATE)}-${format(to, COMMON_FORMAT_DATE)}`;
    }

    return "";
  };

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label
          display={"flex"}
          gap={"6px"}
          fontSize={{ base: "14px", md: "12px" }}
        >
          {t(label)}
          {required && <BaseText color={"red"}> * </BaseText>}
        </Field.Label>
      )}
      <Popover.Root
        open={open}
        portalled={true}
        ids={{ trigger: id }}
        onPointerDownOutside={(e) => e.stopPropagation()}
        onInteractOutside={(e) => e.stopPropagation()}
        closeOnInteractOutside={false}
      >
        <Popover.Trigger asChild>
          <InputGroup
            flex={1}
            width={"full"}
            onClick={() => setOpen(true)}
            endElement={
              !!field.value && !isReadOnly && !isDisabled ? (
                <>
                  {isClearable ? (
                    <BaseIcon
                      color={"red"}
                      borderRadius={"full"}
                      boxSize={"15px"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                    >
                      <IoIosClose size={14} />
                    </BaseIcon>
                  ) : null}
                </>
              ) : (
                <Flex alignItems="center" justifyContent="center" mt="5px">
                  <PiCalendarThin />
                </Flex>
              )
            }
          >
            <Input
              {...field}
              name={field.name}
              onBlur={(e) => field?.onBlur(e)}
              value={getDisplayValue()}
              placeholder={t(placeholder)}
              borderRadius={"7px"}
              border={"1px solid"}
              borderColor={isError ? "red.500" : "bg.muted"}
              _focus={{ borderColor: "primary.500" }}
              _placeholder={{ color: isError ? "red.500" : "gray.400" }}
              size={"lg"}
              pl={3}
              mt={"5px"}
              variant={"outline"}
              bg={"bg.muted"}
              readOnly
              disabled={isDisabled}
              fontSize={{ base: "16px", md: "12px" }}
              height={"40px"}
              autoCapitalize="none"
            />
          </InputGroup>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content width={"fit-content"}>
              <BaseCalendar
                mode={mode}
                disablePastDates={disablePastDates}
                disableWeeksDates={disableWeeksDates}
                selected={field.value}
                onSelect={handleChange}
                startMonth={startMonth}
                endMonth={endMonth}
                hideNavigation={hideNavigation}
                activeCaptionLayout={activeCaptionLayout}
                onCloseButton={() => setOpen(false)}
              />
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
      {isError && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={4} height={4} color={"red.500"} />
          <Field.ErrorText>
            {typeof error === "string"
              ? error
              : typeof error === "object"
                ? Object.values(error).join(" | ")
                : null}
          </Field.ErrorText>
        </Flex>
      )}
    </Field.Root>
  );
};
