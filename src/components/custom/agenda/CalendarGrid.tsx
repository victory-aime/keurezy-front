import { CalendarGridProps } from './interface/agenda';
import { PlaningView } from './PlaningView';
import { MonthView } from './MonthView';
import { TimeGridView } from './TimeGridView';

export const CalendarGrid = <TMeta = Record<string, any>,>({
  view,
  current,
  events,
  onSelectSlot,
  onSelectEvent,
  onMoveEvent,
  onResizeEvent,
  renderEventSubtitle,
  maxVisibleMonthEvents,
  loading,
}: CalendarGridProps<TMeta>) => {
  // --------------------------------------------------------------------
  // MONTH VIEW
  // --------------------------------------------------------------------

  if (view === 'month') {
    return (
      <MonthView<TMeta>
        loading={loading}
        current={current}
        events={events}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        renderEventSubtitle={renderEventSubtitle}
        maxVisibleEvents={maxVisibleMonthEvents}
      />
    );
  }

  // --------------------------------------------------------------------
  // AGENDA VIEW
  // --------------------------------------------------------------------

  if (view === 'agenda') {
    return (
      <PlaningView<TMeta>
        current={current}
        events={events}
        onSelectEvent={onSelectEvent}
        renderEventSubtitle={renderEventSubtitle}
      />
    );
  }

  // --------------------------------------------------------------------
  // DAY / WEEK VIEW
  // --------------------------------------------------------------------

  return (
    <TimeGridView<TMeta>
      view={view}
      loading={loading}
      current={current}
      events={events}
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      onMoveEvent={onMoveEvent}
      onResizeEvent={onResizeEvent}
      renderEventSubtitle={renderEventSubtitle}
    />
  );
};

// ---------------------------------------------------------------------------
// Month view
// ---------------------------------------------------------------------------
