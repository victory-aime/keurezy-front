'use client';

import React, { memo, useCallback, useState } from 'react';
import {
  Field,
  Portal,
  Flex,
  DatePicker,
  DateValue,
  HStack,
  Input,
  parseDate,
} from '@chakra-ui/react';
import { useField, useFormikContext } from 'formik';
import { BaseText } from '../base-text';
import { Icons } from '_components/custom';
import {
  DatePickerInputContainer,
  disabledPastDates,
  disabledWeekends,
} from './utils/DatePickerUtils';
import { mergeDateAndTime, formatTime } from './utils/datetime-utils';
import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
import { FormDateTimePickerProps } from './interface/input';

export const FormDateTimePicker = memo(
  ({
    name,
    label,
    placeholder,
    isDisabled,
    isReadOnly,
    stopPropagation,
    required,
    startMonth = new Date(2026, 0),
    endMonth = new Date(2030, 12),
    isDisabledPassDates = true,
    isDisabledWeekDates = true,
  }: FormDateTimePickerProps) => {
    const [field, { error, touched }, { setValue, setTouched }] = useField(name!);

    const { submitCount } = useFormikContext();

    const isError = !!(error && (touched || submitCount > 0));

    const [internal, setInternal] = useState<CalendarDateTime | null>(
      field.value
        ? new CalendarDateTime(
            new Date(field.value).getFullYear(),
            new Date(field.value).getMonth() + 1,
            new Date(field.value).getDate(),
            new Date(field.value).getHours(),
            new Date(field.value).getMinutes(),
          )
        : null,
    );

    const timeValue = internal ? formatTime(internal) : '';

    const onDateChange = useCallback(
      (details: { value: DateValue[] }) => {
        const newDate = details.value[0];
        if (!newDate) return;

        const base =
          internal ?? new CalendarDateTime(newDate.year, newDate.month, newDate.day, 0, 0);

        const updated = new CalendarDateTime(
          newDate.year,
          newDate.month,
          newDate.day,
          base.hour,
          base.minute,
        );

        setInternal(updated);
        setValue(updated.toDate(getLocalTimeZone()).toISOString());
      },
      [internal, setValue],
    );

    const onTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const [h, m] = e.target.value.split(':').map(Number);

        setInternal((prev) => {
          if (!prev) return prev;

          const updated = prev.set({ hour: h, minute: m });
          setValue(updated.toDate(getLocalTimeZone()).toISOString());
          return updated;
        });
      },
      [setValue],
    );

    const handleStopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
    };

    return (
      <Field.Root id={name} invalid={isError}>
        {label && (
          <DatePicker.Label display="flex" gap="6px" fontSize="12px">
            {label}
            {required && <BaseText color="red"> *</BaseText>}
          </DatePicker.Label>
        )}

        <DatePicker.Root
          selectionMode="single"
          outsideDaySelectable
          onOpenChange={(e) => setTouched(!e.open)}
          disabled={isDisabled}
          readOnly={isReadOnly}
          onBlur={field.onBlur}
          min={parseDate(startMonth)}
          max={parseDate(endMonth)}
          onClick={stopPropagation ? handleStopPropagation : undefined}
          isDateUnavailable={
            isDisabledPassDates
              ? disabledPastDates
              : isDisabledWeekDates
                ? disabledWeekends
                : undefined
          }
          locale={'fr-FR'}
          invalid={isError}
        >
          <DatePicker.Control>
            <DatePicker.Trigger unstyled width="full">
              <DatePickerInputContainer width="full" placeholder={placeholder} isError={isError} />
            </DatePicker.Trigger>

            <DatePicker.Context>
              {(api) => (
                <DatePicker.IndicatorGroup>
                  {api.value.length > 0 && <DatePicker.ClearTrigger />}
                  <DatePicker.Trigger>
                    <Icons.Calendar />
                  </DatePicker.Trigger>
                </DatePicker.IndicatorGroup>
              )}
            </DatePicker.Context>
          </DatePicker.Control>

          <Portal>
            <DatePicker.Positioner>
              <DatePicker.Content>
                <DatePicker.View view="day">
                  <HStack justify="space-between" width="full">
                    <DatePicker.PrevTrigger />
                    <DatePicker.ViewTrigger asChild>
                      <DatePicker.RangeText fontWeight="bold" />
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger />
                  </HStack>

                  <Flex direction="column" gap="4">
                    <DatePicker.DayTable />
                    <Flex
                      mt="3"
                      p="2"
                      borderWidth="1px"
                      borderRadius="lg"
                      align="center"
                      justify="space-between"
                    >
                      <BaseText fontSize="sm" fontWeight="medium">
                        Heure
                      </BaseText>
                      <Input type="time" value={timeValue} onChange={onTimeChange} width="120px" />
                    </Flex>
                  </Flex>
                </DatePicker.View>
              </DatePicker.Content>
            </DatePicker.Positioner>
          </Portal>
        </DatePicker.Root>

        {isError && (
          <Flex gap={1} mt={1} alignItems="center">
            <Field.ErrorText>{typeof error === 'string' ? error : null}</Field.ErrorText>
          </Flex>
        )}
      </Field.Root>
    );
  },
);
