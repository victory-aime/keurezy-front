'use client';

import { useCallback, useMemo, useState } from 'react';
import { fr } from 'date-fns/locale';
import { Box, HStack, SegmentGroup, VStack } from '@chakra-ui/react';

import {
  BaseButton,
  BaseIcon,
  BaseText,
  Icons,
  STATUS_META,
  TextVariant,
  TextWeight,
} from '_components/custom';
import { CalendarGrid } from './CalendarGrid';
import { ENUM } from '_types/*';
import { BaseAgendaProps, CalendarEvent, CalendarView, ViewDefinition } from './interface/agenda';
import { Status } from '_components/ui/status';
import { DEFAULT_VIEW_DEFS } from './constants/agenda';
import { buildCurrentLabel, navigate } from './functions/agenda';
import { t } from 'i18next';
import { StatusValue } from '_components/ui/status';

export const BaseAgenda = <TMeta = Record<string, unknown>,>({
  // Data
  events,

  // Config
  defaultView = 'month',
  defaultDate,
  locale = fr,
  views = ['month', 'week', 'day', 'agenda'],

  // Actions
  onCreate,
  onSelectEvent,
  onMoveEvent,
  onResizeEvent,

  // Rendering
  renderEventSubtitle,

  // Labels
  labels,

  // Status
  showStatuses = true,
  statuses,
  loading,
}: BaseAgendaProps<TMeta>) => {
  // -------------------------------------------------------------------------
  // State — stable initial values to avoid re-renders on parent re-mount
  // -------------------------------------------------------------------------

  const [view, setView] = useState<CalendarView>(defaultView);
  const [current, setCurrent] = useState<Date>(() => defaultDate ?? new Date());

  // -------------------------------------------------------------------------
  // Derived — all memoized so descendants never re-render for free
  // -------------------------------------------------------------------------

  /** Human-readable period label shown in the toolbar center. */
  const currentLabel = useMemo(
    () => buildCurrentLabel(view, current, locale),
    [view, current, locale],
  );

  /**
   * Filtered + labelled view definitions.
   * Re-computed only when `views` or `labels` change.
   */
  const availableViews = useMemo<ViewDefinition[]>(
    () =>
      DEFAULT_VIEW_DEFS.filter((v) => views.includes(v.value)).map((v) => ({
        ...v,
        // Use custom label string when provided, keep the original ReactNode otherwise.
        label: labels?.[v.value] != null ? labels[v.value] : v.label,
      })),
    // labels is usually an object literal — JSON-stringify gives a stable dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [views, JSON.stringify(labels)],
  );

  /**
   * Status list used for the legend.
   * Falls back to all keys from STATUS_META when not provided.
   */
  const availableStatuses = useMemo<ENUM.COMMON.Status[]>(
    () => statuses ?? (Object.keys(STATUS_META) as ENUM.COMMON.Status[]),
    [statuses],
  );

  // -------------------------------------------------------------------------
  // Stable callbacks — dependencies are narrowed to avoid unnecessary rebuilds
  // -------------------------------------------------------------------------

  const handlePrev = useCallback(() => setCurrent((d) => navigate(view, d, -1)), [view]);

  const handleNext = useCallback(() => setCurrent((d) => navigate(view, d, 1)), [view]);

  const handleToday = useCallback(() => setCurrent(new Date()), []);

  const handleViewChange = useCallback((e: any) => setView(e.value as CalendarView), []);

  const handleSelectSlot = useCallback((date: Date) => onCreate?.(date), [onCreate]);

  const handleSelectEvent = useCallback(
    (event: CalendarEvent<TMeta>) => onSelectEvent?.(event),
    [onSelectEvent],
  );

  const handleMoveEvent = useCallback(
    (id: string, date: Date) => onMoveEvent?.(id, date),
    [onMoveEvent],
  );

  const handleResizeEvent = useCallback(
    (id: string, date: Date) => onResizeEvent?.(id, date),
    [onResizeEvent],
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <VStack gap={8} mb={6} mt={10} alignItems="flex-start" width="full">
      {/* ---------------------------------------------------------------- */}
      {/* Toolbar                                                          */}
      {/* ---------------------------------------------------------------- */}
      <HStack width="full" justify="space-between" align="center" flexWrap="wrap" gap={4}>
        {/* Left — today button + prev/next arrows */}
        <HStack gap={4}>
          <BaseButton
            borderRadius="full"
            px={4}
            py={2}
            borderWidth={1}
            colorType="neutral"
            variant="outline"
            color="gray"
            onClick={handleToday}
            aria-label="Aller à aujourd'hui"
          >
            {labels?.today ?? "Aujourd'hui"}
          </BaseButton>

          <HStack gap={2}>
            <BaseIcon
              as="button"
              borderRadius="full"
              boxSize="30px"
              cursor="pointer"
              aria-label="Période précédente"
              onClick={handlePrev}
              _hover={{ bg: 'bg.subtle' }}
              transition="background 0.15s ease"
            >
              <Icons.ChevronLeft size={22} />
            </BaseIcon>

            <BaseIcon
              as="button"
              borderRadius="full"
              boxSize="30px"
              cursor="pointer"
              aria-label="Période suivante"
              onClick={handleNext}
              _hover={{ bg: 'bg.subtle' }}
              transition="background 0.15s ease"
            >
              <Icons.ChevronRight size={22} />
            </BaseIcon>
          </HStack>
        </HStack>

        {/* Center — current period label */}
        <BaseText
          variant={TextVariant.L}
          weight={TextWeight.Bold}
          textTransform="capitalize"
          transition="opacity 0.2s ease"
          aria-live="polite"
          aria-atomic
        >
          {currentLabel}
        </BaseText>

        {/* Right — view switcher */}
        <SegmentGroup.Root
          value={view}
          onValueChange={(e) => handleViewChange(e)}
          aria-label="Type de vue"
        >
          <SegmentGroup.Indicator />

          {availableViews.map((v) => (
            <SegmentGroup.Item key={v.value} value={v.value}>
              <SegmentGroup.ItemText>{v.label}</SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          ))}
        </SegmentGroup.Root>
      </HStack>
      {/* ---------------------------------------------------------------- */}
      {/* Status legend                                                    */}
      {/* ---------------------------------------------------------------- */}
      {showStatuses && availableStatuses?.length > 0 && (
        <HStack gap={5} flexWrap="wrap" role="list" aria-label="Légende des statuts">
          {availableStatuses.map((status: string, i) => {
            const variant = STATUS_META[status as keyof typeof STATUS_META] as unknown as
              | StatusValue
              | undefined;
            if (!variant) return null;
            return (
              <Status key={i} value={variant} size="lg" role="listitem">
                {t(`COMMON.STATUS.${status}`)}
              </Status>
            );
          })}
        </HStack>
      )}
      {/* ------------------------------------------------------------------ */}
      {/* Calendar grid                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box width="full" minW={0}>
        <CalendarGrid<TMeta>
          loading={loading}
          view={view}
          current={current}
          events={events}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onMoveEvent={handleMoveEvent}
          onResizeEvent={handleResizeEvent}
          renderEventSubtitle={renderEventSubtitle}
        />
      </Box>
    </VStack>
  );
};
