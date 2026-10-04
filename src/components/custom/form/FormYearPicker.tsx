'use client';

import { DatePicker, Field, Flex, Portal, type DateValue } from '@chakra-ui/react';
import { CalendarDate } from '@internationalized/date';
import { useField, useFormikContext } from 'formik';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseText } from '../base-text';
import { CustomSkeletonLoader } from '../custom-skeleton';
import { Icons } from '../icons';
import { parseYearInput } from '_utils/year';
import { FormYearPickerProps } from './interface/input';

const toYearDate = (year: number) => new CalendarDate(year, 1, 1);

/**
 * Choix d'une année, lié à Formik : la valeur du champ est l'année en nombre (`2026`).
 * Le calendrier s'ouvre directement sur la grille des années ; la saisie au clavier reste
 * possible (« 26 » devient 2026). Les années hors de [minYear, maxYear] sont grisées.
 */
export const FormYearPicker = memo(
  ({
    name,
    label,
    placeholder,
    required,
    isDisabled,
    isReadOnly,
    isLoading = false,
    minYear = 2020,
    maxYear = new Date().getFullYear(),
    onChangeFunc,
    width = '140px',
  }: FormYearPickerProps) => {
    const { t } = useTranslation();
    const [field, { touched, error }, { setValue, setTouched }] = useField<number | null>(name);
    const { submitCount } = useFormikContext();
    const isError = !!error && (touched || submitCount > 0);

    const value = useMemo(
      () => (typeof field.value === 'number' ? [toYearDate(field.value)] : []),
      [field.value],
    );
    const bounds = useMemo(
      () => ({ min: toYearDate(minYear), max: new CalendarDate(maxYear, 12, 31) }),
      [minYear, maxYear],
    );

    const handleChange = useCallback(
      ({ value: next }: DatePicker.ValueChangeDetails) => {
        const year = next?.[0]?.year ?? null;
        setValue(year);
        onChangeFunc?.(year);
      },
      [setValue, onChangeFunc],
    );

    const parse = useCallback(
      (input: string | undefined) => {
        const year = parseYearInput(input, minYear, maxYear);
        return year === null ? undefined : toYearDate(year);
      },
      [minYear, maxYear],
    );

    return (
      <Field.Root id={name} invalid={isError} width={width}>
        {isLoading ? (
          <CustomSkeletonLoader type="FORM" height="40px" width="100%" />
        ) : (
          <DatePicker.Root
            name={name}
            value={value}
            onValueChange={handleChange}
            format={(date: DateValue) => String(date.year)}
            parse={parse}
            defaultView="year"
            minView="year"
            min={bounds.min}
            max={bounds.max}
            locale="fr-FR"
            placeholder={placeholder ?? String(maxYear)}
            disabled={isDisabled}
            readOnly={isReadOnly}
            invalid={isError}
            onOpenChange={(e) => !e.open && setTouched(true)}
            positioning={{ strategy: 'fixed', placement: 'bottom-end' }}
          >
            {label && (
              <DatePicker.Label display="flex" gap="6px" fontSize="12px">
                {t(label)}
                {required && <BaseText color="danger.solid"> *</BaseText>}
              </DatePicker.Label>
            )}

            <DatePicker.Control>
              <DatePicker.Input aria-label={label ? t(label) : 'Année'} inputMode="numeric" />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger aria-label="Choisir une année">
                  <Icons.Calendar />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>

            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content minW="260px">
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
            <Field.ErrorText>{error}</Field.ErrorText>
          </Flex>
        )}
      </Field.Root>
    );
  },
);

FormYearPicker.displayName = 'FormYearPicker';
