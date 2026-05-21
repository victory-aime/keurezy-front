import { WrapProps, Wrap, DatePicker, DateValue, Flex } from '@chakra-ui/react';
import { BaseTag } from '../../tag';
import { DatePickerInputContainerProps } from '../interface/input';
import { memo } from 'react';

export const DatePickerValueContainer = memo((props: WrapProps) => (
  <Wrap
    gap="2"
    borderWidth="1px"
    borderRadius="12px"
    minH="10"
    alignItems="center"
    width="full"
    textStyle="sm"
    py="1.5"
    ps="2.5"
    pe="8"
    {...props}
  />
));

export const DatePickerInputContainer = memo(
  ({ isError, ...props }: DatePickerInputContainerProps) => (
    <DatePicker.Input
      borderRadius="12px"
      border="1px solid"
      borderColor={isError ? 'red.500' : 'inherit'}
      _focus={{
        borderColor: isError ? 'red.500' : 'primary.500',
      }}
      _placeholder={{
        color: isError ? 'red.500' : 'gray.400',
      }}
      fontSize="sm"
      {...props}
    />
  ),
);

export const DatePickerInputByMode = memo(
  ({
    placeholder,
    isError,
    formatWithDay,
  }: {
    placeholder?: string;
    isError?: boolean;
    formatWithDay: (date: DateValue) => string;
  }) => {
    return (
      <DatePicker.Context>
        {(api) => {
          if (api.selectionMode === 'single') {
            return (
              <DatePicker.Trigger unstyled width={'full'}>
                <DatePickerInputContainer
                  placeholder={placeholder}
                  isError={isError}
                  width={'full'}
                />
              </DatePicker.Trigger>
            );
          }

          if (api.selectionMode === 'range') {
            return (
              <Flex gap={2} width="full">
                <DatePicker.Trigger unstyled width={'full'}>
                  <DatePickerInputContainer
                    placeholder="Date de début"
                    isError={isError}
                    width={'full'}
                  />
                </DatePicker.Trigger>
                <DatePicker.Trigger unstyled width={'full'}>
                  <DatePickerInputContainer
                    placeholder="Date de fin"
                    isError={isError}
                    width={'full'}
                  />
                </DatePicker.Trigger>
              </Flex>
            );
          }

          if (api.selectionMode === 'multiple') {
            return (
              <DatePicker.Trigger unstyled asChild width={'full'}>
                <DatePickerValueContainer
                  borderColor={isError ? 'red.500' : 'gray.200'}
                  color={isError ? 'red.500' : 'gray.400'}
                >
                  <DatePicker.ValueText placeholder={placeholder}>
                    {({ value, index, remove }) => (
                      <BaseTag
                        key={index}
                        color="purple"
                        label={formatWithDay(value)}
                        size="lg"
                        onCloseIconTrigger={remove}
                        iconPosition="end"
                      />
                    )}
                  </DatePicker.ValueText>
                </DatePickerValueContainer>
              </DatePicker.Trigger>
            );
          }

          return null;
        }}
      </DatePicker.Context>
    );
  },
);

export const disabledPastDates = (date: DateValue) => {
  const jsDate = date.toDate('UTC');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return jsDate < today;
};

export const disabledWeekends = (date: DateValue) => {
  const dayOfWeek = date.toDate('UTC').getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};
