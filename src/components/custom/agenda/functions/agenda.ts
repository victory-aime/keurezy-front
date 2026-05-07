import { CalendarView } from '../interface/agenda';
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  Locale,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';

/** Returns a human-readable period label depending on the active view. */
function buildCurrentLabel(view: CalendarView, date: Date, locale: Locale): string {
  switch (view) {
    case 'month':
      return format(date, 'MMMM yyyy', { locale });
    case 'day':
      return format(date, 'EEEE d MMMM yyyy', { locale });
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(weekStart, 'd MMM', { locale })} – ${format(weekEnd, 'd MMM yyyy', { locale })}`;
    }
    case 'agenda':
    default:
      return format(date, 'd MMM', { locale });
  }
}

/** Returns the step to add/subtract when navigating for a given view. */
function navigate(view: CalendarView, date: Date, dir: -1 | 1): Date {
  switch (view) {
    case 'day':
      return dir > 0 ? addDays(date, 1) : subDays(date, 1);
    case 'week':
      return dir > 0 ? addDays(date, 7) : subDays(date, 7);
    default:
      return dir > 0 ? addMonths(date, 1) : subMonths(date, 1);
  }
}

export { navigate, buildCurrentLabel };
