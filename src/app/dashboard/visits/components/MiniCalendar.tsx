import { useMemo } from 'react';
import { fr } from 'date-fns/locale';
import { DatePicker } from '@chakra-ui/react';
import { disabledPastDates } from '_components/custom/form/utils/DatePickerUtils';

interface Props {
  value: Date;
  onChange: (d: string) => void;
  marked?: Date[];
}

export const MiniCalendar = ({ value, onChange, marked = [] }: Props) => {
  return (
    <DatePicker.Root
      inline
      hideOutsideDays
      width="fit-content"
      onValueChange={(e) => {
        console.log('values', e);
        onChange(e.valueAsString?.[0]);
      }}
      isDateUnavailable={disabledPastDates}
    >
      <DatePicker.Content borderRadius={'xl'} border={'1px'} borderColor={'red'}>
        <DatePicker.View view="day">
          <DatePicker.Header />
          <DatePicker.DayTable />
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
    </DatePicker.Root>
  );
};
