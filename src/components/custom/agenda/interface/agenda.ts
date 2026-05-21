import { ENUM } from '_types/*';
import { Locale } from 'date-fns';
import React, { ReactNode } from 'react';

// ---------------------------------------------------------------------------
export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

interface BaseLoadingProps {
  loading?: boolean;
}

interface CalendarGridProps<TMeta = Record<string, any>> extends BaseLoadingProps {
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
  date: Date | string;
  start: Date | string;
  end: Date | string;
  status: ENUM.COMMON.Status;
  description?: string;
  meta?: TMeta;
}
interface PlaningViewProps<TMeta = Record<string, any>> extends BaseLoadingProps {
  current: Date;
  events: CalendarEvent<TMeta>[];
  onSelectEvent: (event: CalendarEvent<TMeta>) => void;
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => React.ReactNode;
}

interface MonthViewProps<TMeta = Record<string, any>> extends BaseLoadingProps {
  current: Date;
  events: CalendarEvent<TMeta>[];
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent<TMeta>) => void;
  renderEventSubtitle?: (event: CalendarEvent<TMeta>) => React.ReactNode;
  maxVisibleEvents?: number;
}

interface TimeGridViewProps<TMeta = Record<string, any>> extends BaseLoadingProps {
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

interface BaseAgendaProps<TMeta = Record<string, unknown>> extends BaseLoadingProps {
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
  CalendarEvent,
  PlaningViewProps,
  MonthViewProps,
  TimeGridViewProps,
  CalendarGridProps,
  ViewDefinition,
  BaseAgendaProps,
};
