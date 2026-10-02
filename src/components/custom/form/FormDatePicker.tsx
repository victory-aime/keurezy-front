'use client';

import React, { useCallback, memo, useMemo } from 'react';
import { Field, Portal, Flex, DatePicker, parseDate, DateValue, HStack } from '@chakra-ui/react';
import { useField, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormDatePickerFieldProps } from './interface/input';
import { BaseText } from '../base-text';
import { BaseButton, CustomSkeletonLoader, Icons } from '_components/custom';
import {
  DatePickerInputByMode,
  disabledPastDates,
  disabledWeekends,
} from './utils/DatePickerUtils';

export const FormDatePicker = memo(
  ({
    name,
    label,
    placeholder = '',
    isReadOnly,
    isDisabled,
    required,
    startMonth = new Date(2026, 0),
    endMonth = new Date(2030, 12),
    isLoading = false,
    mode = 'single',
    isDisabledPassDates,
    isDisabledWeekDates,
    minDate,
    maxDate,
    ...rest
  }: FormDatePickerFieldProps) => {
    const { t } = useTranslation();

    const [field, { touched, error }, { setValue, setTouched }] = useField(name!);
    const { submitCount } = useFormikContext();

    const isError = isReadOnly ? !!error : !!(error && (touched || submitCount > 0));

    const handleChange = useCallback(
      (date: DatePicker.ValueChangeDetails) => {
        if (mode === 'single') {
          const selectedDate = date?.value?.[0];
          if (!selectedDate) {
            setValue(null);
            return;
          }
          setValue(selectedDate.toDate('UTC').toISOString());
        }

        if (mode === 'range' || mode === 'multiple') {
          setValue(date?.valueAsString);
        }
      },
      [mode, setValue],
    );

    // Date saisie (AAAA-MM-JJ…) → DateValue, mémoïsée pour ne pas réinitialiser le calendrier à chaque rendu
    const selectedDate = useMemo(
      () =>
        field.value
          ? typeof field.value === 'string'
            ? parseDate(field.value.split('T')[0])
            : field.value
          : undefined,
      [field.value],
    );
    const minSelectableDate = useMemo(() => (minDate ? parseDate(minDate) : undefined), [minDate]);
    const maxSelectableDate = useMemo(() => (maxDate ? parseDate(maxDate) : undefined), [maxDate]);
    const bounds = useMemo(
      () => ({ min: parseDate(startMonth), max: parseDate(endMonth) }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [startMonth.getTime(), endMonth.getTime()],
    );

    // minDate grise les jours sans borner la navigation (contrairement à `min` de zag)
    const isDateUnavailable = useCallback(
      (date: DateValue) =>
        // Priorité historique : les dates passées l'emportent sur les week-ends
        (isDisabledPassDates
          ? disabledPastDates(date)
          : !!isDisabledWeekDates && disabledWeekends(date)) ||
        (!!minSelectableDate && date.compare(minSelectableDate) < 0) ||
        (!!maxSelectableDate && date.compare(maxSelectableDate) > 0),
      [isDisabledPassDates, isDisabledWeekDates, minSelectableDate, maxSelectableDate],
    );

    const formatDate = useCallback((date: DateValue) => {
      const day = date.day.toString().padStart(2, '0');
      const month = date.month.toString().padStart(2, '0');
      const year = (date.year % 100).toString().padStart(2, '0');

      return `${day}/${month}/${year}`;
    }, []);

    const formatWithDay = useCallback((date: DateValue) => {
      const jsDate = date.toDate('UTC');
      return jsDate.toLocaleDateString('fr-FR', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }, []);

    return (
      <Field.Root id={name} invalid={isError}>
        {isLoading ? (
          <CustomSkeletonLoader type="FORM" height="40px" width="100%" />
        ) : (
          <DatePicker.Root
            // Sans valeur, le calendrier s'ouvre sur le premier jour sélectionnable
            key={selectedDate ? 'selected' : minDate}
            defaultFocusedValue={selectedDate ?? minSelectableDate}
            format={formatDate}
            isDateUnavailable={isDateUnavailable}
            value={selectedDate ? [selectedDate] : undefined}
            outsideDaySelectable
            onOpenChange={(e) => setTouched(!e.open)}
            positioning={{ strategy: 'fixed', placement: 'bottom' }}
            invalid={isError}
            disabled={isDisabled}
            readOnly={isReadOnly}
            onBlur={field.onBlur}
            min={bounds.min}
            max={bounds.max}
            onValueChange={handleChange}
            selectionMode={mode}
            locale="fr-FR"
            autoFocus={false}
            {...rest}
          >
            {label && (
              <DatePicker.Label display="flex" gap="6px" fontSize="12px">
                {t(label)}
                {required && <BaseText color="danger.solid"> *</BaseText>}
              </DatePicker.Label>
            )}

            <DatePicker.Control>
              <DatePickerInputByMode
                placeholder={placeholder}
                formatWithDay={formatWithDay}
                isError={isError}
              />

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
                    <HStack width={'full'} justifyContent={'space-between'} alignItems={'center'}>
                      <DatePicker.PrevTrigger _hover={{ color: 'purple.500' }} />
                      <DatePicker.ViewTrigger asChild>
                        <DatePicker.RangeText
                          color={'primary.500'}
                          fontWeight={'bold'}
                          textTransform={'capitalize'}
                          cursor={'pointer'}
                          onClick={() => {}}
                        />
                      </DatePicker.ViewTrigger>

                      <DatePicker.NextTrigger _hover={{ color: 'purple.500' }} />
                    </HStack>

                    <Flex gap="4">
                      <DatePicker.DayTable />
                      {rest.numOfMonths === 2 && <DatePicker.DayTable offset={1} />}
                    </Flex>

                    <DatePicker.Context>
                      {(api) =>
                        api.selectionMode === 'single' && (
                          <BaseButton variant="outline" onClick={api.selectToday}>
                            Today
                          </BaseButton>
                        )
                      }
                    </DatePicker.Context>
                  </DatePicker.View>

                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>

                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>
        )}

        {isError && (
          <Flex gap={1} mt={1} alignItems="center">
            <Field.ErrorIcon width={2.5} height={2.5} color="danger.solid" />
            <Field.ErrorText>
              {typeof error === 'string'
                ? error
                : typeof error === 'object'
                  ? Object.values(error).join(' | ')
                  : null}
            </Field.ErrorText>
          </Flex>
        )}
      </Field.Root>
    );
  },
);
