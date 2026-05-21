import { CalendarDateTime } from '@internationalized/date';

export const mergeDateAndTime = (date: Date, hours: number, minutes: number) => {
  return new CalendarDateTime(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    hours,
    minutes,
  );
};

export const formatTime = (date: CalendarDateTime) => {
  return `${String(date.hour).padStart(2, '0')}:${String(date.minute).padStart(2, '0')}`;
};
