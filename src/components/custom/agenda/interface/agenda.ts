// ---------------------------------------------------------------------------
// CalendarGrid — public API

import { ENUM } from '_types/*';
import { Locale } from 'date-fns';
import { ReactNode } from 'react';

// ---------------------------------------------------------------------------
export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

interface CalendarProps {
  view: CalendarView;
  current: Date;
  appointments: any[];
  onSelectSlot: (start: Date) => void;
  onSelectEvent: (a: any) => void;
  onMoveEvent: (id: string, newStart: Date) => void;
  onResizeEvent: (id: string, newEnd: Date) => void;
}
interface CalendarGridProps<TMeta = Record<string, any>> {
  view: CalendarView;
  current: Date;
  events: CalendarEvent<TMeta>[];
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent<TMeta>) => void;
  onMoveEvent: (eventId: string, newDate: Date) => void;
  onResizeEvent: (eventId: string, newEndDate: Date) => void;
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => ReactNode;
  maxVisibleMonthEvents?: number;
}

interface CalendarEvent<TMeta = Record<string, any>> {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  status: ENUM.COMMON.Status;
  description?: string;
  meta?: TMeta;
}
interface PlaningViewProps<TMeta = Record<string, any>> {
  current: Date;
  events: CalendarEvent<TMeta>[];
  onSelectEvent: (event: CalendarEvent<TMeta>) => void;
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => React.ReactNode;
}

interface MonthViewProps<TMeta = Record<string, any>> {
  current: Date;
  events: CalendarEvent<TMeta>[];
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent<TMeta>) => void;
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => React.ReactNode;
  maxVisibleEvents?: number;
}

interface TimeGridViewProps<TMeta = Record<string, any>> {
  view: 'day' | 'week';
  current: Date;
  events: CalendarEvent<TMeta>[];
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent<TMeta>) => void;
  onMoveEvent: (eventId: string, newDate: Date) => void;
  onResizeEvent: (eventId: string, newEndDate: Date) => void;
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => React.ReactNode;
}

interface ViewDefinition {
  value: CalendarView;
  label: ReactNode;
}

interface BaseAgendaProps<TMeta = Record<string, unknown>> {
  events: CalendarEvent<TMeta>[];
  title?: string;
  description?: string;
  icon?: ReactNode;
  defaultView?: CalendarView;
  defaultDate?: Date;
  locale?: Locale;
  views?: CalendarView[];
  // Actions
  onCreate?: (date?: Date) => void;
  onSelectEvent?: (event: CalendarEvent<TMeta>) => void;
  onMoveEvent?: (eventId: string, newDate: Date) => void;
  onResizeEvent?: (eventId: string, newEndDate: Date) => void;

  // Rendering
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => ReactNode;

  // Custom labels
  labels?: Partial<Record<CalendarView | 'today' | 'new', string>>;

  // Status legend
  showStatuses?: boolean;
  statuses?: ENUM.COMMON.Status[];
}

export type {
  CalendarProps,
  CalendarEvent,
  PlaningViewProps,
  MonthViewProps,
  TimeGridViewProps,
  CalendarGridProps,
  ViewDefinition,
  BaseAgendaProps,
};
